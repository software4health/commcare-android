/*
 * Tupaia
 *  Copyright (c) 2017 - 2023 Beyond Essential Systems Pty Ltd
 */
import React, { ReactElement, ReactNode } from 'react';
import { To, Link as RouterLink } from 'react-router-dom';
import { Tooltip as BaseTooltip, Button as UIButton } from '@tupaia/ui-components';
import styled from 'styled-components';

const TOOLTIP_COLOR = '#002d47';
const StyledButton = styled(UIButton)`
  &.Mui-disabled {
    pointer-events: auto; // this is to allow the hover effect of a tooltip to work
  }
`;

const Tooltip = styled(BaseTooltip).attrs({
  disablePortal: true,
})`
  .MuiTooltip-tooltip {
    background-color: ${TOOLTIP_COLOR};
    .MuiTooltip-arrow {
      color: ${TOOLTIP_COLOR};
    }
  }
`;
interface ButtonProps extends Record<string, any> {
  tooltip?: string;
  children?: ReactNode;
  to?: To;
}

const ButtonWrapper = ({
  children,
  tooltip,
}: {
  children: ReactElement<any, any>;
  tooltip?: ButtonProps['tooltip'];
}) => {
  if (!tooltip) return children;
  return (
    <Tooltip title={tooltip} arrow>
      {children}
    </Tooltip>
  );
};
export const Button = ({ tooltip, children, to, ...restOfProps }: ButtonProps) => {
  return (
    <ButtonWrapper tooltip={tooltip}>
      <StyledButton component={to ? RouterLink : undefined} to={to} {...restOfProps}>
        {children}
      </StyledButton>
    </ButtonWrapper>
  );
};