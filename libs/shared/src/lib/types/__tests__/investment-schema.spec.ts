import { describe, it, expect } from '@jest/globals';
import { investmentSchema } from '../investment';
import {
  getSchemaProperties,
  expectValidJsonSchema,
  expectStringProperty,
  expectNumberProperty,
  expectEnumProperty,
} from './schema-test-utils';

describe('Investment JSON Schema', () => {
  it('должна иметь корректную структуру', () => {
    expectValidJsonSchema(investmentSchema, 'Investment');
  });

  it('должна содержать все необходимые свойства', () => {
    const properties = getSchemaProperties(investmentSchema);

    expectStringProperty(properties, 'id');
    expectStringProperty(properties, 'userId');
    expectStringProperty(properties, 'title');
    expectStringProperty(properties, 'description');
    expectEnumProperty(properties, 'type', [
      'stock',
      'bond',
      'etf',
      'mutual_fund',
      'real_estate',
      'deposit',
      'cryptocurrency',
      'other',
    ]);
    expectNumberProperty(properties, 'amount');
    expectStringProperty(properties, 'currency');
    expectStringProperty(properties, 'purchaseDate');
    expectNumberProperty(properties, 'currentPrice');
    expectEnumProperty(properties, 'status', ['active', 'sold', 'pending', 'frozen', 'closed']);
    expectStringProperty(properties, 'createdAt', 'date-time');
    expectStringProperty(properties, 'updatedAt', 'date-time');
  });

  it('должна требовать обязательные поля', () => {
    expect(investmentSchema.required).toContain('id');
    expect(investmentSchema.required).toContain('userId');
    expect(investmentSchema.required).toContain('title');
    expect(investmentSchema.required).toContain('type');
    expect(investmentSchema.required).toContain('description');
    expect(investmentSchema.required).toContain('status');
    expect(investmentSchema.required).toContain('amount');
    expect(investmentSchema.required).toContain('currency');
    expect(investmentSchema.required).toContain('purchaseDate');
    expect(investmentSchema.required).toContain('currentPrice');
    expect(investmentSchema.required).toContain('createdAt');
    expect(investmentSchema.required).toContain('updatedAt');
  });
});
