/**
 * Tupaia Web
 * Copyright (c) 2019 Beyond Essential Systems Pty Ltd.
 * This source code is licensed under the AGPL-3.0 license
 * found in the LICENSE file in the root directory of this source tree.
 */

import styled from 'styled-components';
import { Button } from '@tupaia/ui-components';
import { WHITE, PRIMARY_BLUE, BREWER_PALETTE } from '../styles';

export const PrimaryButton = styled(Button)`
  color: ${WHITE};
  background-color: ${PRIMARY_BLUE};
  padding: 0.375rem 0.8rem;

  &.MuiButton-root.Mui-disabled {
    color: ${WHITE};
    opacity: 0.5;

    &:hover {
      background-color: ${PRIMARY_BLUE};
    }
  }

  :hover {
    background: ${BREWER_PALETTE.blue};
  }
`;
