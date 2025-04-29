import { describe, it, expect } from '@jest/globals';
import { taxSchema } from '../tax';
import {
  getSchemaProperties,
  expectValidJsonSchema,
  expectStringProperty,
  expectNumberProperty,
  expectEnumProperty,
} from './schema-test-utils';

describe('Tax JSON Schema', () => {
  it('должна иметь корректную структуру', () => {
    expectValidJsonSchema(taxSchema, 'Tax');
  });

  it('должна содержать все необходимые свойства', () => {
    const properties = getSchemaProperties(taxSchema);

    expectStringProperty(properties, 'id');
    expectStringProperty(properties, 'userId');
    expectStringProperty(properties, 'title');
    expectStringProperty(properties, 'description');
    expectEnumProperty(properties, 'type', [
      'income',
      'property',
      'vat',
      'transport',
      'land',
      'self_employed',
      'corporate',
      'other',
    ]);
    expectEnumProperty(properties, 'status', [
      'pending',
      'paid',
      'overdue',
      'calculated',
      'disputed',
    ]);
    expectNumberProperty(properties, 'amount');
    expectStringProperty(properties, 'currency');
    expectNumberProperty(properties, 'taxRate');
    expectNumberProperty(properties, 'taxableAmount');
    expectStringProperty(properties, 'taxPeriod');
    expectStringProperty(properties, 'dueDate');
    expectStringProperty(properties, 'createdAt', 'date-time');
    expectStringProperty(properties, 'updatedAt', 'date-time');
  });

  it('должна требовать обязательные поля', () => {
    expect(taxSchema.required).toContain('id');
    expect(taxSchema.required).toContain('userId');
    expect(taxSchema.required).toContain('title');
    expect(taxSchema.required).toContain('description');
    expect(taxSchema.required).toContain('type');
    expect(taxSchema.required).toContain('status');
    expect(taxSchema.required).toContain('amount');
    expect(taxSchema.required).toContain('currency');
    expect(taxSchema.required).toContain('taxPeriod');
    expect(taxSchema.required).toContain('dueDate');
    expect(taxSchema.required).toContain('createdAt');
    expect(taxSchema.required).toContain('updatedAt');
  });
});
