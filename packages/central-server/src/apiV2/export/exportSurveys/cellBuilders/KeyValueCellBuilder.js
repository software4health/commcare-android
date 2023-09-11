/**
 * Tupaia MediTrak
 * Copyright (c) 2019 Beyond Essential Systems Pty Ltd
 */

export class KeyValueCellBuilder {
  constructor(models) {
    this.models = models;
  }

  // Override handlers for specific fields that can't run through generic handlers
  // e.g. object fields that map one to many in our excel format
  individualFieldProcessors = {};

  fetchQuestionCode = async ({ questionId }) => {
    const question = await this.models.question.findById(questionId);
    if (!question) {
      throw new Error(`Could not find a question with id matching ${questionId}`);
    }
    return question.code;
  };

  async processKey(key) {
    return key;
  }

  async processValue(value) {
    return value.toString();
  }

  extractRelevantObject(object) {
    return object;
  }

  async build(jsonStringOrObject) {
    if (!jsonStringOrObject) {
      return '';
    }
    const fullObject =
      typeof jsonStringOrObject === 'string' ? JSON.parse(jsonStringOrObject) : jsonStringOrObject;
    const object = this.extractRelevantObject(fullObject) || {};
    const processedFields = await Promise.all(
      Object.entries(object).map(async ([key, value]) => {
        if (this.individualFieldProcessors[key]) {
          return this.individualFieldProcessors[key](this.models, value);
        }
        const processedKey = await this.processKey(key);
        const processedValue = await this.processValue(value, key);
        return `${processedKey}: ${processedValue}`;
      }),
    );
    return processedFields.join('\r\n');
  }
}
