import { describe, it, expect } from '@jest/globals';
import { reportSchema } from '../report';
import {
  getSchemaProperties,
  expectValidJsonSchema,
  expectStringProperty,
  expectObjectProperty,
  expectEnumProperty,
} from './schema-test-utils';

describe('Report JSON Schema', () => {
  it('должна иметь корректную структуру', () => {
    expectValidJsonSchema(reportSchema, 'Report');
  });

  it('должна содержать все необходимые свойства', () => {
    const properties = getSchemaProperties(reportSchema);

    expectStringProperty(properties, 'id');
    expectStringProperty(properties, 'userId');
    expectStringProperty(properties, 'title');
    expectStringProperty(properties, 'description');
    expectEnumProperty(properties, 'type', [
      'financial',
      'tax',
      'budget',
      'investment',
      'expense',
      'income',
      'custom',
    ]);
    expectEnumProperty(properties, 'format', ['pdf', 'excel', 'csv', 'json', 'html']);
    expectEnumProperty(properties, 'status', ['pending', 'generated', 'failed', 'expired']);
    expectObjectProperty(properties, 'parameters');
    expectStringProperty(properties, 'fileUrl');
    expectStringProperty(properties, 'createdAt', 'date-time');
    expectStringProperty(properties, 'updatedAt', 'date-time');
  });

  it('должна требовать обязательные поля', () => {
    expect(reportSchema.required).toContain('id');
    expect(reportSchema.required).toContain('userId');
    expect(reportSchema.required).toContain('title');
    expect(reportSchema.required).toContain('description');
    expect(reportSchema.required).toContain('type');
    expect(reportSchema.required).toContain('format');
    expect(reportSchema.required).toContain('status');
    expect(reportSchema.required).toContain('parameters');
    expect(reportSchema.required).toContain('createdAt');
    expect(reportSchema.required).toContain('updatedAt');
  });
});
