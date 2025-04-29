import { describe, it, expect } from '@jest/globals';
import { counterpartySchema } from '../counterparty';
import {
  getSchemaProperties,
  expectValidJsonSchema,
  expectStringProperty,
  expectEnumProperty,
} from './schema-test-utils';

describe('Counterparty JSON Schema', () => {
  it('должна иметь корректную структуру', () => {
    expectValidJsonSchema(counterpartySchema, 'Counterparty');
  });

  it('должна содержать все необходимые свойства', () => {
    const properties = getSchemaProperties(counterpartySchema);

    expectStringProperty(properties, 'id');
    expectStringProperty(properties, 'userId');
    expectStringProperty(properties, 'name');
    expectEnumProperty(properties, 'type', [
      'individual',
      'company',
      'government',
      'bank',
      'other',
    ]);
    expectEnumProperty(properties, 'status', ['active', 'inactive', 'blocked']);
    expectStringProperty(properties, 'inn');
    expectStringProperty(properties, 'kpp');
    expectStringProperty(properties, 'ogrn');
    expectStringProperty(properties, 'address');
    expectStringProperty(properties, 'contactPerson');
    expectStringProperty(properties, 'createdAt', 'date-time');
    expectStringProperty(properties, 'updatedAt', 'date-time');
  });

  it('должна требовать обязательные поля', () => {
    expect(counterpartySchema.required).toContain('id');
    expect(counterpartySchema.required).toContain('userId');
    expect(counterpartySchema.required).toContain('name');
    expect(counterpartySchema.required).toContain('type');
    expect(counterpartySchema.required).toContain('status');
    expect(counterpartySchema.required).toContain('createdAt');
    expect(counterpartySchema.required).toContain('updatedAt');
  });
});
