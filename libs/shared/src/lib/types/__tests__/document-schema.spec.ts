import { describe, it, expect } from '@jest/globals';
import { documentSchema } from '../document';
import {
  getSchemaProperties,
  expectValidJsonSchema,
  expectStringProperty,
  expectNumberProperty,
  expectEnumProperty,
} from './schema-test-utils';

describe('Document JSON Schema', () => {
  it('должна иметь корректную структуру', () => {
    expectValidJsonSchema(documentSchema, 'Document');
  });

  it('должна содержать все необходимые свойства', () => {
    const properties = getSchemaProperties(documentSchema);

    expectStringProperty(properties, 'id');
    expectStringProperty(properties, 'userId');
    expectStringProperty(properties, 'title');
    expectStringProperty(properties, 'description');
    expectEnumProperty(properties, 'type', [
      'contract',
      'invoice',
      'receipt',
      'report',
      'certificate',
      'id',
      'other',
    ]);
    expectStringProperty(properties, 'fileUrl');
    expectNumberProperty(properties, 'fileSize');
    expectStringProperty(properties, 'fileType');
    expectStringProperty(properties, 'fileName');
    expectEnumProperty(properties, 'status', [
      'active',
      'archived',
      'pending',
      'rejected',
      'expired',
    ]);
    // Опциональные поля
    expectStringProperty(properties, 'entityId');
    expectStringProperty(properties, 'entityType');
    expectStringProperty(properties, 'validFrom');
    expectStringProperty(properties, 'validUntil');
    expectStringProperty(properties, 'issuedBy');
    expectStringProperty(properties, 'issuedTo');
    expect(properties['tags']).toBeDefined();
    expect(properties['tags'].type).toBe('array');
    expectStringProperty(properties, 'createdAt', 'date-time');
    expectStringProperty(properties, 'updatedAt', 'date-time');
  });

  it('должна требовать обязательные поля', () => {
    expect(documentSchema.required).toContain('id');
    expect(documentSchema.required).toContain('userId');
    expect(documentSchema.required).toContain('title');
    expect(documentSchema.required).toContain('type');
    expect(documentSchema.required).toContain('fileUrl');
    expect(documentSchema.required).toContain('fileSize');
    expect(documentSchema.required).toContain('fileType');
    expect(documentSchema.required).toContain('fileName');
    expect(documentSchema.required).toContain('description');
    expect(documentSchema.required).toContain('status');
    expect(documentSchema.required).toContain('createdAt');
    expect(documentSchema.required).toContain('updatedAt');
  });
});
