/**
 * Tupaia
 * Copyright (c) 2017 - 2022 Beyond Essential Systems Pty Ltd
 */

import { AccessPolicy } from '@tupaia/access-policy';
import { Aggregator } from '@tupaia/aggregator';
import { TupaiaApiClient } from '@tupaia/api-client';
import { DataBroker } from '@tupaia/data-broker';
import { yup, yupUtils, hasNoContent, takesDateForm } from '@tupaia/utils';
import { DataTableService } from '../DataTableService';

const paramsSchema = yup.object().shape({
  hierarchy: yup.string().required(),
  dataGroupCode: yup.string().required(),
  dataElementCodes: yup.array().of(yup.string().required()).strict(),
  organisationUnitCodes: yup.array().of(yup.string().required()).strict().required(),
  startDate: yup
    .string()
    .test(
      yupUtils.yupTestAny([hasNoContent, takesDateForm], 'startDate should be in ISO 8601 format'),
    ),
  endDate: yup
    .string()
    .test(
      yupUtils.yupTestAny([hasNoContent, takesDateForm], 'endDate should be in ISO 8601 format'),
    ),
  aggregations: yup.array().of(
    yup.object().shape({
      type: yup.string().required(),
      config: yup.object(),
    }),
  ),
});

const configSchema = yup.object();

type EventsDataTableServiceContext = {
  apiClient: TupaiaApiClient;
  accessPolicy: AccessPolicy;
};

type EventFields = {
  event: string;
  eventDate: string;
  orgUnit: string;
  orgUnitName: string;
};

type RawEvent = EventFields & {
  dataValues: Record<string, unknown>;
};
type Event = EventFields & Record<string, unknown>;

/**
 * DataTableService for pulling data from data-broker's fetchEvents() endpoint
 */
export class EventsDataTableService extends DataTableService<
  EventsDataTableServiceContext,
  typeof paramsSchema,
  typeof configSchema,
  Event
> {
  public constructor(context: EventsDataTableServiceContext, config: unknown) {
    super(context, paramsSchema, configSchema, config);
  }

  protected async pullData(params: {
    hierarchy: string;
    dataGroupCode: string;
    dataElementCodes?: string[];
    organisationUnitCodes: string[];
    startDate?: string;
    endDate?: string;
    aggregations?: { type: string; config?: Record<string, unknown> }[];
  }) {
    const {
      hierarchy,
      dataGroupCode,
      dataElementCodes,
      organisationUnitCodes,
      startDate,
      endDate,
      aggregations,
    } = params;

    const aggregator = new Aggregator(
      new DataBroker({
        services: this.ctx.apiClient,
        accessPolicy: this.ctx.accessPolicy,
      }),
    );

    const response = (await aggregator.fetchEvents(
      dataGroupCode,
      {
        hierarchy,
        organisationUnitCodes,
        startDate,
        endDate,
        dataElementCodes,
      },
      aggregations,
    )) as RawEvent[];
    return response.map(event => {
      const { dataValues, ...restOfEvent } = event;
      return { ...dataValues, ...restOfEvent };
    });
  }
}

export const createEventsDataTableService = (
  context: EventsDataTableServiceContext,
  config: unknown,
) => new EventsDataTableService(context, config);
