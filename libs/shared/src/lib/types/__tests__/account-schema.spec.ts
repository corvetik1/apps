import { describe, it, expect } from '@jest/globals';
import { accountSchema } from '../account';
import {
  getSchemaProperties,
  expectValidJsonSchema,
  expectStringProperty,
  expectNumberProperty,
  expectBooleanProperty,
  expectEnumProperty,
} from './schema-test-utils';

describe('Account JSON Schema', () => {
  it('должна иметь корректную структуру', () => {
    expectValidJsonSchema(accountSchema, 'Account');
  });

  it('должна содержать все необходимые свойства', () => {
    const properties = getSchemaProperties(accountSchema);

    expectStringProperty(properties, 'id');
    expectStringProperty(properties, 'name');
    expectEnumProperty(properties, 'type', ['debit', 'credit']);
    expectNumberProperty(properties, 'balance');
    expectStringProperty(properties, 'userId');
    expectNumberProperty(properties, 'creditLimit');
    expectNumberProperty(properties, 'debt');
    expectStringProperty(properties, 'gracePeriod');
    expectNumberProperty(properties, 'minPayment');
    expectStringProperty(properties, 'paymentDueDate');
    expectBooleanProperty(properties, 'isPaid');
    expectStringProperty(properties, 'createdAt', 'date-time');
    expectStringProperty(properties, 'updatedAt', 'date-time');
  });

  it('должна требовать обязательные поля', () => {
    expect(accountSchema.required).toContain('id');
    expect(accountSchema.required).toContain('name');
    expect(accountSchema.required).toContain('type');
    expect(accountSchema.required).toContain('balance');
    expect(accountSchema.required).toContain('userId');
    expect(accountSchema.required).toContain('createdAt');
    expect(accountSchema.required).toContain('updatedAt');
  });
});
