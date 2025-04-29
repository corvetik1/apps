import { analyticsResponseSchema } from '../analytics';
import {
  expectValidJsonSchema,
  expectStringProperty,
  expectObjectProperty,
  expectEnumProperty,
  getSchemaProperties,
} from './schema-test-utils';

describe('analyticsResponseSchema', () => {
  it('должна быть валидной JSON-схемой', () => {
    expectValidJsonSchema(analyticsResponseSchema, 'AnalyticsResponse');
  });

  it('должна иметь правильные обязательные поля', () => {
    expect(analyticsResponseSchema.required).toContain('userId');
    expect(analyticsResponseSchema.required).toContain('period');
  });

  it('должна иметь правильные свойства с правильными типами', () => {
    const properties = getSchemaProperties(analyticsResponseSchema);

    // Проверка строковых свойств
    expectStringProperty(properties, 'userId');
    expectStringProperty(properties, 'startDate');
    expectStringProperty(properties, 'endDate');

    // Проверка перечисления
    expectEnumProperty(properties, 'period', ['day', 'week', 'month', 'quarter', 'year']);

    // Проверка объектных свойств
    expectObjectProperty(properties, 'metrics');
    expectObjectProperty(properties, 'charts');
  });
});
