const chromium = require('chrome-aws-lambda');
const { process: coreWorkerProcess } = require('core-worker');
const fs = require('fs');
const nodemailer = require('nodemailer');

exports.handler = async (event, context, callback) => {
  console.log('Start lambda method');
  // For keeping the browser launch
  context.callbackWaitsForEmptyEventLoop = false;

  const config = {
    ...event,
    tmpFileName: `/tmp/all.${event.fileType}`,
  };

  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath,
    headless: true,
  });
  console.log('Created browser');

  try {
    await exports
      .run(browser, config)
      .then(result => callback(null, result))
      .catch(err => callback(err));
  } finally {
    console.log('Closing browser');
    await browser.close();
  }

  return 'done';
};

const exportMultiPage = async (page, { fileType, extraConfig, tmpFileName }) => {
  if (fileType !== 'pdf') {
    throw new Error('Multi page export must be pdf');
  }

  // Initialise the chart exporter. This turns the chart into a clipped, pageable UI that
  // can be modified by the exporter.
  await page.evaluate(`window.tupaiaExportProps.initExporter(${JSON.stringify(extraConfig)})`);

  const files = [];
  let exportComplete = false;
  let pageCounter = 0;
  while (!exportComplete) {
    const fileName = `/tmp/page-${pageCounter}.pdf`;
    files.push(fileName);

    await page.pdf({
      path: fileName,
      format: 'A4',
      printBackground: true,
      landscape: true,
    });

    // Run the next page script which advanced to the next column or row and returns true.
    // Returns false if there was no page to advance to.
    exportComplete = !(await page.evaluate('window.tupaiaExportProps.moveToNextExportPage()'));
    pageCounter++;
    console.log(`Created ${fileName}`);
  }

  console.log('Screenshots complete');
  await coreWorkerProcess(
    `/opt/bin/gs -dBATCH -dNOPAUSE -q -sDEVICE=pdfwrite -sOutputFile=${tmpFileName} ${files.join(
      ' ',
    )}`,
  ).death();
  console.log('Screenshot combining complete');
};

const exportSinglePage = async (page, { fileType, tmpFileName }) => {
  if (fileType === 'pdf') {
    await page.pdf({
      path: tmpFileName,
      format: 'A4',
      printBackground: true,
      landscape: true,
      pageRanges: '1',
    });
  } else if (fileType === 'png') {
    await page.screenshot({
      path: tmpFileName,
      fullPage: true,
    });
  } else {
    throw new Error(`Unknown file type ${fileType}`);
  }
};

const sendCompletionEmail = async ({
  email,
  emailSubject,
  emailMessage,
  exportFileName,
  tmpFileName,
}) => {
  const transporter = nodemailer.createTransport({
    port: 465,
    host: process.env.SMTP_HOST,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  console.log(`Emailing to ${email}`);

  return transporter.sendMail({
    from: process.env.SITE_EMAIL_ADDRESS,
    to: email,
    subject: emailSubject,
    html: emailMessage,
    attachments: [
      {
        filename: exportFileName,
        content: fs.createReadStream(tmpFileName),
      },
    ],
  });
};

const setCookie = async (page, cookies) => {
  for (let c = 0; c < cookies.length; c++) {
    await page.setCookie(cookies[c]);
  }
};

const isMultiPage = async page => {
  try {
    // Wait for muti page chart export handlers to be available (after the chart has finished loading).
    await page.waitForFunction('window.tupaiaExportProps', { timeout: 5000 });
    return true;
  } catch (error) {
    // Function did not appear, must be a single page chart
    return false;
  }
};

exports.run = async (browser, config) => {
  console.log('Begin running');
  const page = await browser.newPage();
  console.log('Browser launched');

  await setCookie(page, config.cookies);
  console.log('Set cookies');

  await page.goto(config.chartUrl);
  console.log('Page visited', config.chartUrl);
  await page.setViewport({ width: 1000, height: 720 });

  await page.waitForSelector('#chart-body'); // Wait for the chart body to be displayed
  await page.waitFor(5000); // Wait another 5 seconds for good measure

  if (await isMultiPage(page)) {
    await exportMultiPage(page, config);
  } else {
    await exportSinglePage(page, config);
  }

  console.log('Export complete');

  await sendCompletionEmail(config);
  console.log('Email sent');

  await page.close();
  return 'done';
};