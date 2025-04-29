import { analyticsRequestSchema } from '../analytics';
import {
  expectValidJsonSchema,
  expectStringProperty,
  expectBooleanProperty,
  expectArrayProperty,
  expectEnumProperty,
  getSchemaProperties,
} from './schema-test-utils';

describe('analyticsRequestSchema', () => {
  it('должна быть валидной JSON-схемой', () => {
    expectValidJsonSchema(analyticsRequestSchema, 'AnalyticsRequest');
  });

  it('должна иметь правильные обязательные поля', () => {
    expect(analyticsRequestSchema.required).toContain('userId');
    expect(analyticsRequestSchema.required).toContain('period');
  });

  it('должна иметь правильные свойства с правильными типами', () => {
    const properties = getSchemaProperties(analyticsRequestSchema);

    // Проверка строковых свойств
    expectStringProperty(properties, 'userId');
    expectStringProperty(properties, 'startDate');
    expectStringProperty(properties, 'endDate');

    // Проверка перечисления
    expectEnumProperty(properties, 'period', ['day', 'week', 'month', 'quarter', 'year']);

    // Проверка булевых свойств
    expectBooleanProperty(properties, 'includeCharts');
    expectBooleanProperty(properties, 'includeMetrics');

    // Проверка массива
    expectArrayProperty(properties, 'categories', 'string');
  });
});
