import { describe, it, expect } from '@jest/globals';
import { debtSchema } from '../debt';
import {
  getSchemaProperties,
  expectValidJsonSchema,
  expectStringProperty,
  expectNumberProperty,
  expectEnumProperty,
} from './schema-test-utils';

describe('Debt JSON Schema', () => {
  it('должна иметь корректную структуру', () => {
    expectValidJsonSchema(debtSchema, 'Debt');
  });

  it('должна содержать все необходимые свойства', () => {
    const properties = getSchemaProperties(debtSchema);

    expectStringProperty(properties, 'id');
    expectStringProperty(properties, 'userId');
    expectStringProperty(properties, 'title');
    expectStringProperty(properties, 'description');
    expectNumberProperty(properties, 'amount');
    expectStringProperty(properties, 'currency');
    // поле type отсутствует в схеме
    expectEnumProperty(properties, 'status', [
      'active',
      'paid',
      'overdue',
      'restructured',
      'written_off',
    ]);
    expectNumberProperty(properties, 'interestRate');
    expectStringProperty(properties, 'startDate');
    expectStringProperty(properties, 'endDate');
    expectNumberProperty(properties, 'remainingAmount');
    // nextPaymentDate может быть строкой или null
    expect(properties['nextPaymentDate']).toBeDefined();
    expect(properties['nextPaymentDate'].type).toEqual(['string', 'null']);
    expectNumberProperty(properties, 'nextPaymentAmount');
    // поле creditorId отсутствует в схеме
    expectStringProperty(properties, 'createdAt', 'date-time');
    expectStringProperty(properties, 'updatedAt', 'date-time');
  });

  it('должна требовать обязательные поля', () => {
    expect(debtSchema.required).toContain('id');
    expect(debtSchema.required).toContain('userId');
    expect(debtSchema.required).toContain('title');
    expect(debtSchema.required).toContain('amount');
    expect(debtSchema.required).toContain('currency');
    expect(debtSchema.required).toContain('description');
    expect(debtSchema.required).toContain('interestRate');
    expect(debtSchema.required).toContain('startDate');
    expect(debtSchema.required).toContain('endDate');
    expect(debtSchema.required).toContain('status');
    expect(debtSchema.required).toContain('remainingAmount');
    expect(debtSchema.required).toContain('nextPaymentDate');
    expect(debtSchema.required).toContain('nextPaymentAmount');
    expect(debtSchema.required).toContain('createdAt');
    expect(debtSchema.required).toContain('updatedAt');
  });
});
