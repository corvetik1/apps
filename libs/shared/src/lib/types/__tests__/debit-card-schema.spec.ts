import { describe, it, expect } from '@jest/globals';
import { debitCardSchema } from '../debit-card';
import {
  getSchemaProperties,
  expectValidJsonSchema,
  expectStringProperty,
  expectNumberProperty,
  // expectEnumProperty, // Не используется в этом файле
} from './schema-test-utils';

describe('Debit Card JSON Schema', () => {
  it('должна иметь корректную структуру', () => {
    expectValidJsonSchema(debitCardSchema, 'DebitCard');
  });

  it('должна содержать все необходимые свойства', () => {
    const properties = getSchemaProperties(debitCardSchema);

    expectStringProperty(properties, 'id');
    expectStringProperty(properties, 'accountId');
    expectStringProperty(properties, 'userId');
    expectStringProperty(properties, 'cardNumber');
    expectStringProperty(properties, 'cardHolder');
    expectStringProperty(properties, 'expiryDate');
    expectStringProperty(properties, 'cvv');
    expect(properties['isActive']).toBeDefined();
    expect(properties['isActive'].type).toBe('boolean');
    expectNumberProperty(properties, 'balance');
    expectStringProperty(properties, 'currency');
    expectStringProperty(properties, 'bank');
    expectStringProperty(properties, 'paymentSystem');
    expectStringProperty(properties, 'createdAt', 'date-time');
    expectStringProperty(properties, 'updatedAt', 'date-time');
  });

  it('должна требовать обязательные поля', () => {
    expect(debitCardSchema.required).toContain('id');
    expect(debitCardSchema.required).toContain('accountId');
    expect(debitCardSchema.required).toContain('userId');
    expect(debitCardSchema.required).toContain('cardNumber');
    expect(debitCardSchema.required).toContain('cardHolder');
    expect(debitCardSchema.required).toContain('expiryDate');
    expect(debitCardSchema.required).toContain('cvv');
    expect(debitCardSchema.required).toContain('isActive');
    expect(debitCardSchema.required).toContain('balance');
    expect(debitCardSchema.required).toContain('currency');
    expect(debitCardSchema.required).toContain('createdAt');
    expect(debitCardSchema.required).toContain('updatedAt');
  });
});
