/*
 * Tupaia
 *  Copyright (c) 2017 - 2021 Beyond Essential Systems Pty Ltd
 */

import { Request, Response, NextFunction } from 'express';
import { Route } from '@tupaia/server-boilerplate';
import { MeditrakConnection } from '../connections';

export class UserRoute extends Route {
  private readonly meditrakConnection: MeditrakConnection;

  public constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next);
    this.meditrakConnection = new MeditrakConnection(req.session);
  }

  public async buildResponse() {
    return this.meditrakConnection.getUser();
  }
}
