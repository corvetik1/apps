import { describe, it, expect } from '@jest/globals';
import { tenderSchema } from '../tender';
import {
  getSchemaProperties,
  expectValidJsonSchema,
  expectStringProperty,
  expectNumberProperty,
  expectEnumProperty,
} from './schema-test-utils';

describe('Tender JSON Schema', () => {
  it('должна иметь корректную структуру', () => {
    expectValidJsonSchema(tenderSchema, 'Tender');
  });

  it('должна содержать все необходимые свойства', () => {
    const properties = getSchemaProperties(tenderSchema);

    expectStringProperty(properties, 'id');
    expectStringProperty(properties, 'title');
    expectStringProperty(properties, 'description');
    expectEnumProperty(properties, 'status', ['open', 'closed', 'cancelled', 'draft', 'published']);
    expectNumberProperty(properties, 'amount');
    expectStringProperty(properties, 'currency');
    expectStringProperty(properties, 'startDate');
    expectStringProperty(properties, 'endDate');
    expectStringProperty(properties, 'categoryId');
    expectStringProperty(properties, 'location');
    expectStringProperty(properties, 'organizerId');
    expectStringProperty(properties, 'createdAt', 'date-time');
    expectStringProperty(properties, 'updatedAt', 'date-time');
  });

  it('должна требовать обязательные поля', () => {
    expect(tenderSchema.required).toContain('id');
    expect(tenderSchema.required).toContain('title');
    expect(tenderSchema.required).toContain('description');
    expect(tenderSchema.required).toContain('status');
    expect(tenderSchema.required).toContain('amount');
    expect(tenderSchema.required).toContain('currency');
    expect(tenderSchema.required).toContain('startDate');
    expect(tenderSchema.required).toContain('endDate');
    expect(tenderSchema.required).toContain('createdAt');
    expect(tenderSchema.required).toContain('updatedAt');
  });
});
