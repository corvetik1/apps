import { describe, it, expect } from '@jest/globals';
import { aiAnalysisRequestSchema, aiAnalysisResponseSchema } from '../ai-analysis';
import {
  getSchemaProperties,
  expectValidJsonSchema,
  expectStringProperty,
  expectObjectProperty,
} from './schema-test-utils';

describe('AI Analysis Request JSON Schema', () => {
  it('должна иметь корректную структуру', () => {
    expectValidJsonSchema(aiAnalysisRequestSchema, 'AIAnalysisRequest');
  });

  it('должна содержать все необходимые свойства', () => {
    const properties = getSchemaProperties(aiAnalysisRequestSchema);

    expectStringProperty(properties, 'userId');
    expectStringProperty(properties, 'prompt');
    expectObjectProperty(properties, 'data');
    expectObjectProperty(properties, 'options');
  });

  it('должна требовать обязательные поля', () => {
    expect(aiAnalysisRequestSchema.required).toContain('userId');
    expect(aiAnalysisRequestSchema.required).toContain('prompt');
    expect(aiAnalysisRequestSchema.required).toContain('data');
  });
});

describe('AI Analysis Response JSON Schema', () => {
  it('должна иметь корректную структуру', () => {
    expectValidJsonSchema(aiAnalysisResponseSchema, 'AIAnalysisResponse');
  });

  it('должна содержать все необходимые свойства', () => {
    const properties = getSchemaProperties(aiAnalysisResponseSchema);

    expectStringProperty(properties, 'id');
    expectStringProperty(properties, 'userId');
    expectStringProperty(properties, 'requestId');
    expectObjectProperty(properties, 'result');
    expectObjectProperty(properties, 'metadata');
    expectStringProperty(properties, 'createdAt', 'date-time');
  });

  it('должна требовать обязательные поля', () => {
    expect(aiAnalysisResponseSchema.required).toContain('id');
    expect(aiAnalysisResponseSchema.required).toContain('userId');
    expect(aiAnalysisResponseSchema.required).toContain('requestId');
    expect(aiAnalysisResponseSchema.required).toContain('result');
    expect(aiAnalysisResponseSchema.required).toContain('metadata');
    expect(aiAnalysisResponseSchema.required).toContain('createdAt');
  });
});
