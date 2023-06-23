'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async function (db) {
  await db.runSql(`
    DROP TRIGGER IF EXISTS dashboardreport_trigger
    ON "dashboardReport";
  `);

  await db.runSql(`
    UPDATE "dashboardReport"
    SET "dataBuilder" = 'tableOfValuesForOrgUnits'
    WHERE id IN ('TO_PEHS_Facility', 'Imms_FridgeVaccineCount', 'TO_PEHS');
  `);

  await db.runSql(`
    UPDATE "dashboardReport"
    SET "dataBuilder" = 'tableOfValuesForOrgUnits'
    WHERE id IN ('TO_PEHS_Facility', 'Imms_FridgeVaccineCount', 'TO_PEHS');
  `);

  await db.runSql(`
    UPDATE "dashboardReport"
    SET
      "dataBuilderConfig" = '
        {
          "cells": [
            "PREAGGREGATED_DOSES_375874bf",
            "PREAGGREGATED_DOSES_44ec84bf",
            "PREAGGREGATED_DOSES_7191781d",
            "PREAGGREGATED_DOSES_6fc9d81d",
            "PREAGGREGATED_DOSES_cd2d581d",
            "PREAGGREGATED_DOSES_4e6a681d",
            "PREAGGREGATED_DOSES_40a8681d",
            "PREAGGREGATED_DOSES_452a74bf",
            "PREAGGREGATED_DOSES_5e0d74bf"
          ],
          "rows": [
            "Preaggregated Doses of BCG vaccine",
            "Preaggregated Doses of Hepatitis B vaccine",
            "Preaggregated Doses of HPV vaccine",
            "Preaggregated Doses of IPV vaccine",
            "Preaggregated Doses of MR vaccine",
            "Preaggregated Doses of OPV vaccine",
            "Preaggregated Doses of Pentavalent vaccine",
            "Preaggregated Doses of TD vaccine"
          ],
          "columns": "$orgUnit",
          "stripFromDataElementNames": "Preaggregated "
        }' WHERE "id" = 'Imms_FridgeVaccineCount';
  `);

  return db.runSql(`
    UPDATE "dashboardReport"
    SET
      "viewJson" = '{
        "placeholder": "/static/media/PEHSMatrixPlaceholder.png",
        "name": "Service Status By Facility",
        "type": "matrix",
        "presentationOptions": {
          "3": {
            "color": "#EE4230",
            "label": "",
            "description": "**Red** signifies that the intervention is not currently provided at this facility level, however it is a priority to provide this within the next 7 years as part of UHC.\\n"
          },
          "1": {
            "color": "#279A63",
            "label": "",
            "description": "**Green** signifies that these interventions are able to be routinely provided at this facility.\\n"
          },
          "2": {
            "color": "#EE9A30",
            "label": "",
            "description": "**Orange** signifies that these interventions are currently provided in part, but more work needs to be done to ensure consistent availability of the service. This is about the universality and quality of UHC.\\n"
          },
          "0": {
            "color": "#525258",
            "label": "",
            "description": "A **Blank** cell means that the intervention is not available at that level of facility and that it is not a priority to make it available. (For example, there are obviously no plans to perform surgery at a Level 3 facility).\\n"
          }
        }
      }',
      "dataBuilderConfig" = '{
        "cells" : [
          "PEHS_NEWCD004",
          "PEHS833",
          "PEHS805",
          "PEHS882",
          "PEHS875",
          "PEHS762",
          "PEHS812",
          "PEHS769",
          "PEHS776",
          "PEHS854",
          "PEHS_NEWCD001",
          "PEHS819",
          "PEHS847",
          "PEHS783",
          "PEHS861",
          "PEHS_NEWCD002",
          "PEHS_NEWCD005",
          "PEHS_NEWCD006",
          "PEHS868",
          "PEHS840",
          "PEHS_NEWCD003",
          "PEHS1310",
          "PEHS_NEWDS001",
          "PEHS1359",
          "PEHS_NEWDS002",
          "PEHS1331",
          "PEHS1324a",
          "PEHS_NEWDS006",
          "PEHS_NEWDS003",
          "PEHS1430",
          "PEHS_NEWDS008",
          "PEHS_NEWDS007",
          "PEHS1345",
          "PEHS_NEWDS004",
          "PEHS1380",
          "PEHS1366",
          "PEHS1317",
          "PEHS1373",
          "PEHS1437",
          "PEHS1423a",
          "PEHS1352",
          "PEHS_NEWDS005",
          "PEHS1387",
          "PEHS1230",
          "PEHS1273",
          "PEHS_NEWENT001",
          "PEHS_NEWENT003",
          "PEHS1237",
          "PEHS_NEWENT002",
          "PEHS1223",
          "PEHS1216",
          "PEHS_NEWENT004",
          "PEHS918",
          "PEHS911",
          "PEHS897",
          "PEHS1938",
          "PEHS1930",
          "PEHS890",
          "PEHS1906",
          "PEHS1890",
          "PEHS1922",
          "PEHS1898",
          "PEHS35",
          "PEHS126",
          "PEHS63",
          "PEHS119",
          "PEHS7",
          "PEHS_NEW025",
          "PEHS133",
          "PEHS42",
          "PEHS70",
          "PEHS_NEW001",
          "PEHS14",
          "PEHS_NEW057",
          "PEHS28",
          "PEHS_NEW049",
          "PEHS_NEW009",
          "PEHS_NEW065",
          "PEHS_NEW033",
          "PEHS_NEW017",
          "PEHS140",
          "PEHS112",
          "PEHS105",
          "PEHS56",
          "PEHS_NEW041",
          "PEHS49",
          "PEHS_NEW105",
          "PEHS_NEWMFP001",
          "PEHS156",
          "PEHS470",
          "PEHS525A",
          "PEHS314",
          "PEHS356",
          "PEHS164",
          "PEHS_NEW089",
          "PEHS328",
          "PEHS377",
          "PEHS498",
          "PEHS512",
          "PEHS363",
          "PEHS279",
          "PEHS_NEW097",
          "PEHS_NEW121",
          "PEHS228",
          "PEHS192",
          "PEHS235",
          "PEHS_NEW073",
          "PEHS463",
          "PEHS171",
          "PEHS399",
          "PEHS505",
          "PEHS178",
          "PEHS406",
          "PEHS293",
          "PEHS321",
          "PEHS149",
          "PEHS221",
          "PEHS392",
          "PEHS242",
          "PEHS420",
          "PEHS_NEW081",
          "PEHS435",
          "PEHS199",
          "PEHS206",
          "PEHS300",
          "PEHS370",
          "PEHS342",
          "PEHS249",
          "PEHS413",
          "PEHS484",
          "PEHS185",
          "PEHS286",
          "PEHS477",
          "PEHS270",
          "PEHS349",
          "PEHS221a",
          "PEHS491",
          "PEHS263",
          "PEHS427",
          "PEHS456",
          "PEHS_NEW113",
          "PEHS335",
          "PEHS384",
          "PEHS213",
          "PEHS662",
          "PEHS612",
          "PEHS570",
          "PEHS676",
          "PEHS655",
          "PEHS640",
          "PEHS556",
          "PEHS591",
          "PEHS563",
          "PEHS_NEWMH002",
          "PEHS549",
          "PEHS_NEWMH001",
          "PEHS535",
          "PEHS690",
          "PEHS626",
          "PEHS584",
          "PEHS648",
          "PEHS619",
          "PEHS542",
          "PEHS577",
          "PEHS_NEWMH003",
          "PEHS1158",
          "PEHS1172a",
          "PEHS1107",
          "PEHS1137",
          "PEHS1179a",
          "PEHS1005",
          "PEHS933",
          "PEHS1020",
          "PEHS_NEWNCD003",
          "PEHS1086",
          "PEHS1058",
          "PEHS1072",
          "PEHS1100a",
          "PEHS997",
          "PEHS969a",
          "PEHS1193",
          "PEHS1027",
          "PEHS940",
          "PEHS1200",
          "PEHS1114",
          "PEHS_NEWNCD001",
          "PEHS983",
          "PEHS1129",
          "PEHS1186a",
          "PEHS_NEWNCD002",
          "PEHS1207",
          "PEHS1050",
          "PEHS1042",
          "PEHS962",
          "PEHS990",
          "PEHS1065",
          "PEHS1151",
          "PEHS_NEWNCD007",
          "PEHS969",
          "PEHS1107a",
          "PEHS1034",
          "PEHS1093",
          "PEHS976",
          "PEHS926",
          "PEHS1079",
          "PEHS1122",
          "PEHS1100",
          "PEHS1012",
          "PEHS_NEWNCD005",
          "PEHS1165",
          "PEHS_NEWNCD004",
          "PEHS_NEWNCD006",
          "PEHS1473",
          "PEHS1445",
          "PEHS1466",
          "PEHS_NEWOHS002",
          "PEHS_NEWOHS003",
          "PEHS_NEWOHS001",
          "PEHS1480",
          "PEHS1459",
          "PEHS_NEWOHS005",
          "PEHS1487",
          "PEHS1452"
        ],
        "rows" : [
          {
            "rows" : [
              "Detection and reporting of notifiable diseases and conditions subject to syndromic surveillance",
              "HIV rapid diagnostic testing (RDT)",
              "Access to free male and female condoms",
              "HPV vaccination",
              "Comprehensive syndromic management of STIs",
              "IEC (Information, education & communication) on priority diseases (e.g. chikungunya self-referral)",
              "Prevention of mother-to-child transmission of HIV",
              "Screening for TB symptoms and suspected cases referred",
              "Collection and preparation of samples to send to laboratory for testing",
              "Treatment of opportunistic infections of HIV positive",
              "TB prevention control and treatment guidelines are available and followed",
              "Voluntary and provider initiated confidential counselling and testing for HIV and STI’s are available",
              "Antiretroviral treatment for HIV",
              "Complete DOTS coverage as per WHO recommendations",
              "Access to molecular screening for chlamydia and gonorrhoea",
              "National Antibiotic guidelines are available and followed",
              "TB-HIV and TB- Diabetes program linkages are established and operating effectively",
              "Suitable space for isolation of potentially infectious patients are available",
              "Other STI testing",
              "HIV confirmation and commencement of treatment",
              "National Infection control policy and guidelines are available and followed"
            ],
            "category" : "Communicable Diseases"
          },
          {
            "rows" : [
              "Hematology, HB, and blood cell count, blood film available on site or by referral",
              "Advanced chemistry (e.g. immunoassay, Tumour markers, and Troponin) onsite or by referral",
              "Blood grouping and cross-match",
              "Microbiology ZN stain for TB on site or by referral",
              "Lipid Point of care",
              "HBAIC and Glucose testing at point of care",
              "Computerized radiology (CR) and Teleradiology support available",
              "Plain x-ray i.e. chest, skeletal, abdomen",
              "CT scan",
              "Ultra sound non-obstetrics (including ultra sound guided fine needle aspiration)",
              "Ultra sound obstetrics",
              "Microbiology gram stain on site or by referral",
              "Contrast media x-ray e.g. barium swallow or enema",
              "Histology tissue diagnosis and cytology",
              "Infectious serology testing (HepB, Syphilis, HIV, Dengue)",
              "Basic chemistry Electrolyte, and serum chemistry available on site or by referral",
              "Pap smear testing and transfer to Vaiola",
              "Mammogram",
              "Electrocardiograph ECG",
              "Microbiology culture and sensitivity testing and TB stain on site or by referral",
              "Interventional radiology",
              "Molecular testing (Chlamydia and TB) on site or by referral"
            ],
            "category" : "Diagnostic Services"
          },
          {
            "rows" : [
              "Access to refraction and provision of spectacles as appropriate",
              "Simple Test for hearing loss",
              "Primary ENT screening assessment and referral if required",
              "Access or referral to audiometry and fitting of hearing aids as appropriate",
              "Eye clinic: eye surgery and specialist eye care (diabetes eye care, glaucoma, cataract surgery, pterygium etc.)",
              "Maintenance and adjustment of hearing aids",
              "Screening for cataract, pterygium and diabetes eye problems",
              "Primary eye care – screening, assessment and referral",
              "Access to specialist review and care as required"
            ],
            "category" : "ENT and Audiology Services"
          },
          {
            "rows" : [
              "Post-exposure prophylaxis for STDs",
              "Emergency contraception provided",
              "Assessment and psychosocial care support for survivors of sexual gender based and intimate partner violence including safety planning and referral as appropriate",
              "Provide written evidence and attend court",
              "Collect documentation for forensic specimens",
              "Recognition of signs and symptoms of GBV and make appropriate referral",
              "Sexual assault exam and care",
              "Written information on intimate partner violence and non-partner sexual assault is available",
              "Comprehensive medical record of gender based violence",
              "Care of GBV injuries and urgent medical issues"
            ],
            "category" : "Gender Based Violence"
          },
          {
            "rows" : [
              "IV treatment",
              "Specialist surgery performed by visiting surgeons",
              "Dispensing of higher classification of drugs",
              "General surgery and operating theatre services",
              "Out-patient clinics",
              "Scheduled visiting services provide specialist eye clinics (> 2x yearly)",
              "General anaesthetics",
              "Suturing and dressing of wounds",
              "Minor procedures",
              "Specialist NCD\/diabetes clinics are consistently available (daily\/weekly)",
              "Assessment and basic management of accident and emergency",
              "Scheduled visiting services provide other specialist clinics (> 2x yearly)",
              "Short-term admission of patients with acute conditions",
              "Other specialist clinic are consistently available (daily\/weekly)",
              "Scheduled visiting services provide specialist NCD\/diabetes clinics (> 2x yearly)",
              "Anaesthetic services – Regional anaesthesia is available",
              "Specialist paediatric services are consistently available (daily\/weekly)",
              "Specialist eye clinics are consistently available (daily\/weekly)",
              "In-patient services (medical, paediatric, O&G)",
              "Visiting specialist clinics",
              "Post-operative rehabilitation for trauma related injuries",
              "Pharmacy dispensing and counselling",
              "Scheduled visiting services provide specialist paediatric services (> 2x yearly)",
              "Selection and organisation of patients for visiting medical and dental clinics"
            ],
            "category" : "General Clinical Services"
          },
          {
            "rows" : [
              "MMR are available",
              "HPV are available",
              "Lifestyle interventions to support women to maintain healthier weight during child-bearing years (HF)",
              "Integrated Management of Childhood Illness (IMCI): management of diarrhoea, pneumonia, mild newborn illness, pre-referral treatment and referral of severe cases",
              "Rotavirus vaccine is available",
              "Augmentation of labour with medical indication",
              "Continuous positive airway pressure to manage babies with respiratory distress syndrome",
              "Education and counselling about appropriate family planning methods",
              "Standard treatment guidelines for Child health are available and followed",
              "Essential newborn care (basic newborn resuscitation, drying and warmth, eye prophylaxis, clean cord care, early and exclusive breastfeeding)",
              "Detection and management of post-partum sepsis",
              "Counselling on infant\/young child feeding, including exclusive breastfeeding for 6 months",
              "Vitamin A supplementation",
              "Case management of neonatal sepsis, meningitis and pneumonia",
              "Skilled care available during childbirth",
              "EPI (expanded program of immunization) guidelines are available",
              "Recognition and management of major adverse events following immunization",
              "Screening activities offered as part of ante-natal care include blood pressure, weight, syphilis, diabetes",
              "LARC Implants are available",
              "Preventive activities offered as part of ante-natal care, including screening and tetanus toxoid vaccination",
              "Referral for specialist physician assessment and\/or shared \/ joint care between a physician and obstetrician",
              "Anaemia assessment, counselling and treatment",
              "Contraceptive pills are available",
              "Ability to respond appropriately to detected signs and symptoms of a condition that needs to be referred or managed",
              "Basic therapeutic feeding and inpatient services",
              "Condoms are available",
              "Support for breastfeeding at least up to 6 months",
              "Supported referral for cases needing more specialised care",
              "Comprehensive emergency obstetric care at all times : BEOC + caesarean section + safe blood transfusion",
              "Exposure to “First 1000” days program (to improve maternal and community knowledge\/attitudes\/behaviour in relation to healthy pregnancy and the first two years of life",
              "At least 4 sessions of ante-natal care provided",
              "Examination of mother and newborn (up to six weeks)",
              "Clinical management of pregnant women with\/at risk of diabetes (HF)",
              "All diabetic mothers to have HbA1c monitored so that it is <7 before next pregnancy",
              "Skilled care during childbirth is consistently available",
              "EPI (extended program of immunization) at health facility and\/or regular outreach site (requires functioning cold chain)",
              "Emergency contraceptive pills are available",
              "Vasectomy is available",
              "Stabilisation and referral of obstetric emergencies",
              "Detection and referral of post-partum sepsis",
              "All routine birth immunisations and vitamins",
              "Stabilisation and referral of complicated pregnancies (pre-eclampsia, breech etc.)",
              "Support family planning",
              "Growth monitoring",
              "Intrauterine contraceptive device (IUCD) are available",
              "Basic emergency obstetric care (BEOC) available at all times",
              "IMCI community component: information for child carer + active case findings + community case management",
              "Folic acid supplement",
              "Presumptive antibiotic therapy for newborns at risk of bacterial infection",
              "National ANC guidelines are available and followed",
              "Identification and management of acute malnutrition and failure to thrive, and management provided appropriate to the level of care",
              "Iron supplements",
              "National Guidelines on newborn care are available and followed",
              "Deworming and other antiparasitic treatments are available",
              "Recognition and management of minor adverse events following immunization",
              "Information and counselling on nutrition, hygiene, contraception and essential newborn care",
              "National guidelines essential childbirth care are available and followed",
              "Tubal ligation is available"
            ],
            "category" : "Maternal and Family Planning"
          },
          {
            "rows" : [
              "Support self-help groups for people with disabilities",
              "Non-specialists’ referrals to mental health specialist",
              "Non-specialist support for  Developmental Disorders",
              "Community based rehab available for people with long term and\/or acute disabilities are available",
              "All eligible people with disabilities are offered a referral for endorsement by The Ministry of Internal affairs (MIA) for purposes of accessing the social protection fund or other disability related services",
              "Psychological counselling",
              "Non-specialist support for Bipolar Disorder",
              "Non-specialist support for Alcohol and other substance misuse",
              "Non-specialist support for  Epilepsy \/ Seizures",
              "Physiotherapy services are available",
              "Non-specialist support for moderate-severe depression",
              "Psychiatry Admission Guideline, Standard Psychiatry Treatment, Mental Health Act available, National Mental Health Policy, guidelines",
              "Health staff trained in general principles of care for mental health, as per the WHO mhGAP Intervention Guide (essential packages of mental health)",
              "Mobility device services appropriate to level of care available",
              "Specialist support for chronic psychiatric patients",
              "Non-specialist support for  Dementia",
              "Community\/family awareness of rehabilitation and appropriate services in the community",
              "Psychological first aid for distressed people, including survivors of violence",
              "Non-specialist support for Psychosis",
              "Non-specialist support for  Behavioural Disorders",
              "Prosthetists\/orthotists are available"
            ],
            "category" : "Mental Health and Rehabilitation"
          },
          {
            "rows" : [
              "Long-acting bronchodilators for patients who remain symptomatic despite treatment with short-acting bronchodilators (for improvement of lung function)",
              "Prevention of cervical cancer through screening services",
              "Referral for screening and evaluation for laser treatment for diabetic retinopathy",
              "Smoking cessation support for COPD patients is available",
              "Prevention of breast cancer through screening services",
              "Post myocardial infarction: Individual advice about tobacco cessation, healthy diet and regular physical activity",
              "Nutritional counselling and education for priority groups (HF)",
              "Post stroke: Individual advice about tobacco cessation, healthy diet and regular physical activity",
              "Referral post screening to next level for confirmation of diagnosis",
              "Reduction of cardiovascular risk for those with diabetes and 10 year cardiovascular risk >20% with aspirin, angiotensin converting enzyme inhibitor and statins",
              "Individual advice about modification of diet, maintenance of a healthy body weight and regular physical activity",
              "Metformin as initial drug for all patients",
              "Angiotensin converting enzyme inhibitor for persistent albuminuria",
              "Cardiac rehabilitation (supervision of treatment and follow-up)",
              "Assess cardiovascular risk",
              "Identify presenting features of cancer and refer to next level for confirmation of diagnosis (from NCD PEN)",
              "Aspirin, antihypertensive (low dose thiazide, angiotensin-converting enzyme inhibitor) and statins",
              "NCD outreach clinics\/services are regularly provided",
              "Medical palliative care for cancer",
              "Prevention of onset and progression of neuropathy: Optimal glycemic control",
              "Type 1 diabetes patients provided with meters and strips",
              "Anti-hypertensives for people with persistent blood pressure ≥140\/90 and 10 year cardiovascular risk >20% unable to lower blood pressure through life style measure",
              "Inhaled steroids for moderate \/severe asthma to improve lung function, reduce asthma mortality and frequency and severity of exacerbations",
              "Prevention of endometrial cancer through screening services",
              "Promotion of early healing of diabetic foot ulcers and reduction in risk of amputation through off-loading techniques",
              "National guidelines for management of diabetes",
              "Daily insulin injections",
              "Regular administration of antibiotics to prevent streptococcal pharyngitis and recurrent acute rheumatic fever",
              "The population served have access to key messages related to NCDs",
              "Aspirin for acute myocardial infarction",
              "Oral hypoglycemic agents for type 2 diabetes, if glycemic targets are not achieved with modification of diet, maintenance of a healthy body weight and regular physical activity",
              "Inhaled corticosteroids for improvement of lung function",
              "Checklists to assist early detection and referral are available",
              "Aspirin, statins and anti-hypertensives for people with 10 year cardiovascular risk >30%",
              "Diabetic retinopathy prevention through glycemic and blood pressure control",
              "Care of acute stroke and rehabilitation",
              "Prevention of foot complications through examination and monitoring:",
              "Anti-hypertensives for people with blood pressure ≥160\/100",
              "Health promotion about healthy lifestyle and prevention",
              "Other classes of anti-hyperglycemic agents added to metformin if glycemic targets are not met",
              "Relief of symptoms: Oral or inhaled short-acting ß2 agonists",
              "Chronic kidney disease prevention in diabetes",
              "Aspirin, angiotensin-converting enzyme inhibitor, beta-blocker and statin",
              "Psycho social support and other no medical aspects of palliative care available through community and faith-based organisations",
              "Counselling and education on risk factors, signs and symptoms of cancer",
              "Cancer treatment services available",
              "End of life care and support including death certification available appropriate to level of care"
            ],
            "category" : "NCDs"
          },
          {
            "rows" : [
              "Special care for RHD, NCD and people with special needs (Disabilities)",
              "School preventives to all pre-and primary schools",
              "Oral assessments of RHD patients",
              "Referral of any oral lesions for specialist assessment",
              "Emergency care for dental trauma and referral to specialist is available",
              "Information on oral health is available and displayed in the facilities",
              "Curative work: consultation, assessment and treatments provided (save the tooth-fillings or dental extraction), pain relief and referral",
              "Oral assessment of pre-natal\/pregnant mothers",
              "Fabricate other dental prosthesis, removal orthodontic appliance, mouthguard, space maintainers",
              "Provision of dentures",
              "School preventives to secondary school and NCD patients"
            ],
            "category" : "Oral Health Services"
          }
        ],
        "columns" : "$orgUnit",
        "filterEmptyRows" : true
      }' WHERE "id" IN ('TO_PEHS', 'TO_PEHS_Facility');
  `);
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  version: 1,
};
