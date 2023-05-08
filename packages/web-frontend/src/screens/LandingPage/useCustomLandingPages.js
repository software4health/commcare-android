/*
 * Tupaia
 *  Copyright (c) 2017 - 2023 Beyond Essential Systems Pty Ltd
 */

import { useSelector } from 'react-redux';

// This will need to be replaced with real data when it's ready. @see waitp-1195
const customLandingPages = [
  {
    name: 'Fiji',
    urlSegment: 'landing-page-fiji',
    projects: ['wish', 'unfpa'],
    image_url: 'https://placehold.co/2000x2000',
    logo_url: 'https://placehold.co/800x800',
    include_name_in_header: true,
    primary_hexcode: '#010261',
    extended_title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    long_bio:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    external_link: 'https://www.bes.au',
    phone_number: '+123 456 789',
    website_url: 'https://www.bes.au',
  },
];

function getLandingPage(pathname) {
  const urlSegment = pathname.substring(1);
  return customLandingPages.find(page => page.urlSegment === urlSegment);
}

function getLandingPageProjects(landingPage, projects) {
  if (!landingPage) {
    return [];
  }
  return projects.filter(project => landingPage.projects.includes(project.code));
}
export const useCustomLandingPages = () => {
  const pathname = useSelector(state => state.routing.pathname);
  const projectData = useSelector(({ project }) => project?.projects || []);
  const customLandingPage = getLandingPage(pathname);

  return {
    isCustomLandingPage: !!customLandingPage,
    projects: getLandingPageProjects(customLandingPage, projectData),
    customLandingPageSettings: customLandingPage || {},
  };
};
