/*
 * Tupaia
 *  Copyright (c) 2017 - 2023 Beyond Essential Systems Pty Ltd
 */

export const getApiUrl = () => {
  return process.env.REACT_APP_TUPAIA_WEB_API_URL || 'http://localhost:8100/api/v1/';
};
