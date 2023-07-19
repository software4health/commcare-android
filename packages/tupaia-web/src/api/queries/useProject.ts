/*
 * Tupaia
 * Copyright (c) 2017 - 2023 Beyond Essential Systems Pty Ltd
 *
 */

import { useQuery } from 'react-query';
import { get } from '../api';

export const useProject = (projectCode?: string) => {
  return useQuery(['project', projectCode], () => get(`project/${projectCode}`, {}), {
    enabled: !!projectCode,
  });
};
