import { describe, it, expect } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

describe('JSON Schema файлы', () => {
  const schemaDir = path.resolve(__dirname, '../../../../../../docs/json-schema');

  const expectedSchemaFiles = [
    'user.schema.json',
    'account.schema.json',
    'transaction.schema.json',
    'tender.schema.json',
    'analytics-request.schema.json',
    'analytics-response.schema.json',
    'ai-analysis-request.schema.json',
    'ai-analysis-response.schema.json',
    'debit-card.schema.json',
    'credit-card.schema.json',
    'debt.schema.json',
    'loan.schema.json',
    'document.schema.json',
    'investment.schema.json',
    'note.schema.json',
    'counterparty.schema.json',
    'tax.schema.json',
    'report.schema.json',
    'settings.schema.json',
  ];

  it('должны существовать все необходимые JSON Schema файлы', () => {
    const existingFiles = fs.readdirSync(schemaDir);

    for (const expectedFile of expectedSchemaFiles) {
      expect(existingFiles).toContain(expectedFile);
    }
  });

  it('все JSON Schema файлы должны быть валидными JSON', () => {
    for (const schemaFile of expectedSchemaFiles) {
      const schemaPath = path.join(schemaDir, schemaFile);
      const schemaContent = fs.readFileSync(schemaPath, 'utf-8');

      expect(() => {
        JSON.parse(schemaContent);
      }).not.toThrow();
    }
  });

  it('все JSON Schema файлы должны иметь корректную структуру', () => {
    for (const schemaFile of expectedSchemaFiles) {
      const schemaPath = path.join(schemaDir, schemaFile);
      const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
      const schema = JSON.parse(schemaContent);

      // Проверяем обязательные поля
      expect(schema.$schema).toBe('http://json-schema.org/draft-07/schema#');
      expect(schema.title).toBeDefined();
      expect(schema.description).toBeDefined();
      expect(schema.type).toBe('object');
      expect(schema.properties).toBeDefined();
      expect(schema.required).toBeDefined();
      expect(Array.isArray(schema.required)).toBe(true);
    }
  });
});
