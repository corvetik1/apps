import { describe, it, expect } from '@jest/globals';
import { userSchema } from '../user';
import {
  getSchemaProperties,
  expectValidJsonSchema,
  expectStringProperty,
  expectEnumProperty,
} from './schema-test-utils';

describe('User JSON Schema', () => {
  it('должна иметь корректную структуру', () => {
    expectValidJsonSchema(userSchema, 'User');
  });

  it('должна содержать все необходимые свойства', () => {
    const properties = getSchemaProperties(userSchema);

    expectStringProperty(properties, 'id');
    expectStringProperty(properties, 'email', 'email');
    expectStringProperty(properties, 'name');
    expectEnumProperty(properties, 'role', ['admin', 'manager', 'user', 'guest']);
    expectStringProperty(properties, 'createdAt', 'date-time');
    expectStringProperty(properties, 'updatedAt', 'date-time');
  });

  it('должна требовать обязательные поля', () => {
    expect(userSchema.required).toContain('id');
    expect(userSchema.required).toContain('email');
    expect(userSchema.required).toContain('name');
    expect(userSchema.required).toContain('role');
    expect(userSchema.required).toContain('createdAt');
    expect(userSchema.required).toContain('updatedAt');
  });
});
