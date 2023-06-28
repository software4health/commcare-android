/**
 * Tupaia
 * Copyright (c) 2017 - 2023 Beyond Essential Systems Pty Ltd
 */

import { Request } from 'express';
import { Route } from '@tupaia/server-boilerplate';

export type LegacyMapOverlayReportRequest = Request<{ reportCode: string }, any, any, any>;

export class LegacyMapOverlayReportRoute extends Route<LegacyMapOverlayReportRequest> {
  public async buildResponse() {
    const { query, ctx } = this.req;
    const { reportCode } = this.req.params;

    return ctx.services.webConfig.fetchMeasureData(reportCode, query);
  }
}
