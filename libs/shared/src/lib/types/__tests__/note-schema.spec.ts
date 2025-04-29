import { describe, it, expect } from '@jest/globals';
import { noteSchema } from '../note';
import {
  getSchemaProperties,
  expectValidJsonSchema,
  expectStringProperty,
  expectEnumProperty,
} from './schema-test-utils';

describe('Note JSON Schema', () => {
  it('должна иметь корректную структуру', () => {
    expectValidJsonSchema(noteSchema, 'Note');
  });

  it('должна содержать все необходимые свойства', () => {
    const properties = getSchemaProperties(noteSchema);

    expectStringProperty(properties, 'id');
    expectStringProperty(properties, 'userId');
    expectStringProperty(properties, 'title');
    expectStringProperty(properties, 'content');
    expectEnumProperty(properties, 'type', ['general', 'task', 'reminder', 'idea', 'financial']);
    expectEnumProperty(properties, 'priority', ['low', 'medium', 'high', 'urgent']);
    expect(properties['isCompleted']).toBeDefined();
    expect(properties['isCompleted'].type).toBe('boolean');
    expectStringProperty(properties, 'dueDate', 'date-time');
    expectStringProperty(properties, 'color');
    expectStringProperty(properties, 'entityId');
    expectStringProperty(properties, 'entityType');
    expect(properties['tags']).toBeDefined();
    expect(properties['tags'].type).toBe('array');
    expectStringProperty(properties, 'createdAt', 'date-time');
    expectStringProperty(properties, 'updatedAt', 'date-time');
  });

  it('должна требовать обязательные поля', () => {
    expect(noteSchema.required).toContain('id');
    expect(noteSchema.required).toContain('userId');
    expect(noteSchema.required).toContain('title');
    expect(noteSchema.required).toContain('content');
    expect(noteSchema.required).toContain('type');
    expect(noteSchema.required).toContain('priority');
    expect(noteSchema.required).toContain('isCompleted');
    expect(noteSchema.required).toContain('createdAt');
    expect(noteSchema.required).toContain('updatedAt');
  });
});
