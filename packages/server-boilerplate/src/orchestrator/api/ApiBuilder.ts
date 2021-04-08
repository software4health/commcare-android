/**
 * Tupaia
 * Copyright (c) 2017 - 2021 Beyond Essential Systems Pty Ltd
 */

import express, { Express, Request, Response, NextFunction, RequestHandler } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import errorHandler from 'api-error-handler';

import { TupaiaDatabase } from '@tupaia/database';
import { AccessPolicy } from '@tupaia/access-policy';
import { UnauthenticatedError } from '@tupaia/utils';

import { handleWith, handleError } from '../../utils';
import { TestRoute } from '../../routes';
import { LoginRoute, LoginRequest, LogoutRoute, attachSession } from '../routes';
import { ExpressRequest, Params, ReqBody, ResBody, Query } from '../../routes/Route';
import { sessionCookie } from './sessionCookie';
import { SessionModel } from '../models';

export class ApiBuilder {
  private readonly app: Express;

  private readonly database: TupaiaDatabase;

  private attachVerifyLogin?: (req: LoginRequest, res: Response, next: NextFunction) => void;

  private verifyLoginMiddleware?: (req: Request, res: Response, next: NextFunction) => void;

  constructor(transactingConnection: TupaiaDatabase) {
    this.database = transactingConnection;
    this.app = express();

    /**
     * Add middleware
     */
    this.app.use(
      cors({
        origin: true,
        credentials: true, // withCredentials needs to be set for cookies to save @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials
      }),
    );
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.app.use(errorHandler());
    this.app.use(sessionCookie());

    /**
     * Add singletons to be attached to req for every route
     */
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const context = {}; // context is shared between request and response
      req.ctx = context;
      res.ctx = context;

      next();
    });

    /**
     * Test Route
     */
    this.app.get('/v1/test', handleWith(TestRoute));
  }

  useSessionModel(SessionModelClass: new (database: TupaiaDatabase) => SessionModel) {
    const sessionModel = new SessionModelClass(this.database);
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      req.sessionModel = sessionModel;
      next();
    });
    return this;
  }

  verifyLogin(verify: (accessPolicy: AccessPolicy) => void) {
    this.attachVerifyLogin = (req: LoginRequest, res: Response, next: NextFunction) => {
      req.ctx.verifyLogin = verify;
      next();
    };
    this.verifyLoginMiddleware = (req: Request, res: Response, next: NextFunction) => {
      try {
        const { session } = req;
        if (!session) {
          throw new UnauthenticatedError('Session not attached to request');
        }

        verify(session.accessPolicy);

        next();
      } catch (error) {
        next(error);
      }
    };
    return this;
  }

  use<T extends ExpressRequest<T> = Request>(
    path: string,
    middleware: RequestHandler<Params<T>, ResBody<T>, ReqBody<T>, Query<T>>,
  ) {
    this.app.use(path, attachSession, middleware);
    return this;
  }

  get<T extends ExpressRequest<T> = Request>(
    path: string,
    handler: RequestHandler<Params<T>, ResBody<T>, ReqBody<T>, Query<T>>,
  ) {
    if (this.verifyLoginMiddleware) {
      this.app.get(path, attachSession, this.verifyLoginMiddleware, handler);
    } else {
      this.app.get(path, attachSession, handler);
    }
    return this;
  }

  build() {
    if (this.attachVerifyLogin) {
      this.app.post('/v1/login', this.attachVerifyLogin, handleWith(LoginRoute));
    } else {
      this.app.post('/v1/login', handleWith(LoginRoute));
    }
    this.app.post('/v1/logout', handleWith(LogoutRoute));

    this.app.use(handleError);
    return this.app;
  }
}