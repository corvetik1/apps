import { describe, it, expect } from '@jest/globals';
import { analyticsRequestSchema, analyticsResponseSchema } from '../analytics';
import {
  getSchemaProperties,
  expectValidJsonSchema,
  expectStringProperty,
  expectBooleanProperty,
  expectObjectProperty,
  expectEnumProperty,
  expectArrayProperty,
} from './schema-test-utils';

describe('Analytics JSON Schema', () => {
  describe('AnalyticsRequest Schema', () => {
    it('должна иметь корректную структуру', () => {
      expectValidJsonSchema(analyticsRequestSchema, 'AnalyticsRequest');
    });

    it('должна содержать все необходимые свойства', () => {
      const properties = getSchemaProperties(analyticsRequestSchema);

      expectStringProperty(properties, 'userId');
      expectEnumProperty(properties, 'period', ['day', 'week', 'month', 'quarter', 'year']);
      expectStringProperty(properties, 'startDate');
      expectStringProperty(properties, 'endDate');
      expectBooleanProperty(properties, 'includeCharts');
      expectBooleanProperty(properties, 'includeMetrics');
      expectArrayProperty(properties, 'categories', 'string');
    });

    it('должна требовать обязательные поля', () => {
      expect(analyticsRequestSchema.required).toContain('userId');
      expect(analyticsRequestSchema.required).toContain('period');
    });
  });

  describe('AnalyticsResponse Schema', () => {
    it('должна иметь корректную структуру', () => {
      expectValidJsonSchema(analyticsResponseSchema, 'AnalyticsResponse');
    });

    it('должна содержать все необходимые свойства', () => {
      const properties = getSchemaProperties(analyticsResponseSchema);

      expectStringProperty(properties, 'userId');
      expectEnumProperty(properties, 'period', ['day', 'week', 'month', 'quarter', 'year']);
      expectStringProperty(properties, 'startDate');
      expectStringProperty(properties, 'endDate');
      expectObjectProperty(properties, 'metrics');
      expectObjectProperty(properties, 'charts');
    });

    it('должна требовать обязательные поля', () => {
      expect(analyticsResponseSchema.required).toContain('userId');
      expect(analyticsResponseSchema.required).toContain('period');
    });
  });
});
