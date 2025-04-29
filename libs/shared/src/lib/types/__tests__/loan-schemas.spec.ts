import { describe, it, expect } from '@jest/globals';
import { loanSchema } from '../loan';
import {
  getSchemaProperties,
  expectValidJsonSchema,
  expectStringProperty,
  expectNumberProperty,
  expectEnumProperty,
} from './schema-test-utils';

describe('Loan JSON Schema', () => {
  it('должна иметь корректную структуру', () => {
    expectValidJsonSchema(loanSchema, 'Loan');
  });

  it('должна содержать все необходимые свойства', () => {
    const properties = getSchemaProperties(loanSchema);

    expectStringProperty(properties, 'id');
    expectStringProperty(properties, 'userId');
    expectStringProperty(properties, 'title');
    expectStringProperty(properties, 'description');
    expectEnumProperty(properties, 'type', [
      'mortgage',
      'car',
      'consumer',
      'business',
      'education',
      'other',
    ]);
    expectNumberProperty(properties, 'amount');
    expectStringProperty(properties, 'currency');
    expectNumberProperty(properties, 'interestRate');
    expectNumberProperty(properties, 'term');
    expectStringProperty(properties, 'startDate');
    expectStringProperty(properties, 'endDate');
    expectEnumProperty(properties, 'status', [
      'active',
      'paid',
      'overdue',
      'restructured',
      'approved',
      'rejected',
      'pending',
    ]);
    expectNumberProperty(properties, 'remainingAmount');
    // nextPaymentDate может быть строкой или null
    expect(properties['nextPaymentDate']).toBeDefined();
    expect(properties['nextPaymentDate'].type).toEqual(['string', 'null']);
    expectNumberProperty(properties, 'nextPaymentAmount');
    expectStringProperty(properties, 'createdAt', 'date-time');
    expectStringProperty(properties, 'updatedAt', 'date-time');
  });

  it('должна требовать обязательные поля', () => {
    expect(loanSchema.required).toContain('id');
    expect(loanSchema.required).toContain('userId');
    expect(loanSchema.required).toContain('title');
    expect(loanSchema.required).toContain('description');
    expect(loanSchema.required).toContain('type');
    expect(loanSchema.required).toContain('amount');
    expect(loanSchema.required).toContain('currency');
    expect(loanSchema.required).toContain('interestRate');
    expect(loanSchema.required).toContain('term');
    expect(loanSchema.required).toContain('startDate');
    expect(loanSchema.required).toContain('endDate');
    expect(loanSchema.required).toContain('status');
    expect(loanSchema.required).toContain('remainingAmount');
    expect(loanSchema.required).toContain('nextPaymentDate');
    expect(loanSchema.required).toContain('nextPaymentAmount');
    expect(loanSchema.required).toContain('createdAt');
    expect(loanSchema.required).toContain('updatedAt');
  });
});
