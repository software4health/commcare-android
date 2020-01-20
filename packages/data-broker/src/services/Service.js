/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

/**
 * @abstract
 */
export class Service {
  constructor(dataSource, metadata) {
    this.dataSource = dataSource;
    this.metadata = metadata;
  }

  /**
   * @abstract
   */
  // eslint-disable-next-line class-methods-use-this
  push() {
    throw new Error('Any subclass of Service must implement the "push" method');
  }

  /**
   * @abstract
   */
  // eslint-disable-next-line class-methods-use-this
  pull() {
    throw new Error('Any subclass of Service must implement the "pull" method');
  }
}
