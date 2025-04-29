import { describe, it, expect } from '@jest/globals';
import { transactionSchema } from '../transaction';
import {
  getSchemaProperties,
  expectValidJsonSchema,
  expectStringProperty,
  expectNumberProperty,
  expectEnumProperty,
  expectArrayProperty,
} from './schema-test-utils';

describe('Transaction JSON Schema', () => {
  it('должна иметь корректную структуру', () => {
    expectValidJsonSchema(transactionSchema, 'Transaction');
  });

  it('должна содержать все необходимые свойства', () => {
    const properties = getSchemaProperties(transactionSchema);

    expectStringProperty(properties, 'id');
    expectStringProperty(properties, 'tenderId');
    expectNumberProperty(properties, 'amount');
    expectStringProperty(properties, 'currency');
    expectStringProperty(properties, 'date', 'date-time');
    expectEnumProperty(properties, 'type', ['income', 'expense']);
    expectStringProperty(properties, 'description');
    expectStringProperty(properties, 'accountId');
    expectStringProperty(properties, 'categoryId');
    expectStringProperty(properties, 'counterpartyId');
    expectArrayProperty(properties, 'tags', 'string');
    expectStringProperty(properties, 'createdAt', 'date-time');
    expectStringProperty(properties, 'updatedAt', 'date-time');
  });

  it('должна требовать обязательные поля', () => {
    expect(transactionSchema.required).toContain('id');
    expect(transactionSchema.required).toContain('tenderId');
    expect(transactionSchema.required).toContain('amount');
    expect(transactionSchema.required).toContain('currency');
    expect(transactionSchema.required).toContain('date');
    expect(transactionSchema.required).toContain('type');
    expect(transactionSchema.required).toContain('description');
    expect(transactionSchema.required).toContain('accountId');
    expect(transactionSchema.required).toContain('createdAt');
    expect(transactionSchema.required).toContain('updatedAt');
  });
});
