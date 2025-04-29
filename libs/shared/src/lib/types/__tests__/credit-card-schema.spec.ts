import { describe, it, expect } from '@jest/globals';
import { creditCardSchema } from '../credit-card';
import {
  getSchemaProperties,
  expectValidJsonSchema,
  expectStringProperty,
  expectNumberProperty,
  expectBooleanProperty,
} from './schema-test-utils';

describe('Credit Card JSON Schema', () => {
  it('должна иметь корректную структуру', () => {
    expectValidJsonSchema(creditCardSchema, 'CreditCard');
  });

  it('должна содержать все необходимые свойства', () => {
    const properties = getSchemaProperties(creditCardSchema);

    expectStringProperty(properties, 'id');
    expectStringProperty(properties, 'accountId');
    expectStringProperty(properties, 'userId');
    expectStringProperty(properties, 'cardNumber');
    expectStringProperty(properties, 'cardHolder');
    expectStringProperty(properties, 'expiryDate');
    expectStringProperty(properties, 'cvv');
    expectBooleanProperty(properties, 'isActive');
    expectNumberProperty(properties, 'balance');
    expectStringProperty(properties, 'currency');
    expectStringProperty(properties, 'bank');
    expectStringProperty(properties, 'paymentSystem');
    expectNumberProperty(properties, 'creditLimit');
    expectNumberProperty(properties, 'debt');
    expectNumberProperty(properties, 'gracePeriod');
    expectNumberProperty(properties, 'interestRate');
    expectNumberProperty(properties, 'minPayment');
    expectStringProperty(properties, 'paymentDueDate');
    expectBooleanProperty(properties, 'isPaid');
    expectStringProperty(properties, 'createdAt', 'date-time');
    expectStringProperty(properties, 'updatedAt', 'date-time');
  });

  it('должна требовать обязательные поля', () => {
    expect(creditCardSchema.required).toContain('id');
    expect(creditCardSchema.required).toContain('accountId');
    expect(creditCardSchema.required).toContain('userId');
    expect(creditCardSchema.required).toContain('cardNumber');
    expect(creditCardSchema.required).toContain('cardHolder');
    expect(creditCardSchema.required).toContain('expiryDate');
    expect(creditCardSchema.required).toContain('cvv');
    expect(creditCardSchema.required).toContain('isActive');
    expect(creditCardSchema.required).toContain('balance');
    expect(creditCardSchema.required).toContain('currency');
    expect(creditCardSchema.required).toContain('creditLimit');
    expect(creditCardSchema.required).toContain('debt');
    expect(creditCardSchema.required).toContain('gracePeriod');
    expect(creditCardSchema.required).toContain('interestRate');
    expect(creditCardSchema.required).toContain('minPayment');
    expect(creditCardSchema.required).toContain('paymentDueDate');
    expect(creditCardSchema.required).toContain('isPaid');
    expect(creditCardSchema.required).toContain('createdAt');
    expect(creditCardSchema.required).toContain('updatedAt');
  });
});
