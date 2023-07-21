/*
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */
import React, { SVGAttributes } from 'react';
import BaseIcon from './BaseIcon';

export const CalendarToday = (props: SVGAttributes<HTMLOrSVGElement>) => (
  <BaseIcon {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20 3H19V1H17V3H7V1H5V3H4C2.9 3 2 3.9 2 5V21C2 22.1 2.9 23 4 23H20C21.1 23 22 22.1 22 21V5C22 3.9 21.1 3 20 3ZM20 21H4V10H20V21ZM20 8H4V5H20V8Z"
      fill="#414D55"
    />
  </BaseIcon>
);