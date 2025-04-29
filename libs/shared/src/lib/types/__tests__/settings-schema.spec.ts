import { describe, it, expect } from '@jest/globals';
import { settingsSchema } from '../settings';
import {
  getSchemaProperties,
  expectValidJsonSchema,
  expectStringProperty,
  expectBooleanProperty,
  expectObjectProperty,
  expectEnumProperty,
} from './schema-test-utils';

describe('Settings JSON Schema', () => {
  it('должна иметь корректную структуру', () => {
    expectValidJsonSchema(settingsSchema, 'Settings');
  });

  it('должна содержать все необходимые свойства', () => {
    const properties = getSchemaProperties(settingsSchema);

    expectStringProperty(properties, 'id');
    expectStringProperty(properties, 'userId');

    expectEnumProperty(properties, 'theme', ['light', 'dark', 'system']);
    expectEnumProperty(properties, 'language', ['ru', 'en']);

    expectStringProperty(properties, 'defaultCurrency');
    expectEnumProperty(properties, 'currencyFormat', ['symbol', 'code', 'symbol_code']);

    expectStringProperty(properties, 'dateFormat');
    expectStringProperty(properties, 'timeFormat');

    expectBooleanProperty(properties, 'notificationsEnabled');
    expectObjectProperty(properties, 'emailNotifications');

    expectStringProperty(properties, 'createdAt', 'date-time');
    expectStringProperty(properties, 'updatedAt', 'date-time');
  });

  it('должна требовать обязательные поля', () => {
    expect(settingsSchema.required).toContain('id');
    expect(settingsSchema.required).toContain('userId');
    expect(settingsSchema.required).toContain('theme');
    expect(settingsSchema.required).toContain('language');
    expect(settingsSchema.required).toContain('defaultCurrency');
    expect(settingsSchema.required).toContain('currencyFormat');
    expect(settingsSchema.required).toContain('dateFormat');
    expect(settingsSchema.required).toContain('timeFormat');
    expect(settingsSchema.required).toContain('notificationsEnabled');
    expect(settingsSchema.required).toContain('createdAt');
    expect(settingsSchema.required).toContain('updatedAt');
  });
});
