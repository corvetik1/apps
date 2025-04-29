import { createBaseJsonSchema } from '../utils/json-schema';

/**
 * Тип запроса AI-анализа
 */
export enum AIAnalysisType {
  SPENDING = 'spending',
  INCOME = 'income',
  BUDGET = 'budget',
  INVESTMENT = 'investment',
  TAX = 'tax',
  CUSTOM = 'custom',
}

/**
 * Интерфейс запроса на AI-анализ
 */
export interface AIAnalysisRequest {
  userId: string;
  prompt: string;
  data: {
    transactions?: Array<{
      id: string;
      amount: number;
      date: string;
      type: string;
      category?: string;
      description?: string;
    }>;
    accounts?: Array<{
      id: string;
      name: string;
      balance: number;
      type: string;
    }>;
    period?: {
      start: string;
      end: string;
    };
    additionalContext?: Record<string, unknown>;
  };
  options?: {
    language?: string;
    format?: string;
    maxTokens?: number;
  };
}

/**
 * Интерфейс ответа AI-анализа
 */
export interface AIAnalysisResponse {
  id: string;
  userId: string;
  requestId: string;
  result: {
    text: string;
    insights: Array<{
      title: string;
      description: string;
      importance: number;
    }>;
    recommendations?: Array<{
      title: string;
      description: string;
      priority: number;
    }>;
    charts?: Array<{
      type: string;
      title: string;
      data: Record<string, unknown>;
    }>;
    summary: string;
  };
  metadata: {
    processingTime: number;
    modelVersion: string;
    tokensUsed: number;
  };
  createdAt: string;
}

/**
 * JSON-схема для запроса AI-анализа
 */
export const aiAnalysisRequestSchema = createBaseJsonSchema({
  title: 'AIAnalysisRequest',
  description: 'Запрос на AI-анализ',
  required: ['userId', 'prompt', 'data'],
  properties: {
    userId: {
      type: 'string',
      description: 'Идентификатор пользователя',
      examples: ['user1'],
    },
    prompt: {
      type: 'string',
      description: 'Запрос пользователя',
      examples: ['Проанализируй мои расходы за последний месяц'],
    },
    data: {
      type: 'object',
      description: 'Данные для анализа',
    },
    options: {
      type: 'object',
      description: 'Параметры запроса',
    },
  },
});

/**
 * JSON-схема для ответа AI-анализа
 */
export const aiAnalysisResponseSchema = createBaseJsonSchema({
  title: 'AIAnalysisResponse',
  description: 'Ответ AI-анализа',
  required: ['id', 'userId', 'requestId', 'result', 'metadata', 'createdAt'],
  properties: {
    id: {
      type: 'string',
      description: 'Уникальный идентификатор анализа',
      examples: ['analysis1'],
    },
    userId: {
      type: 'string',
      description: 'Идентификатор пользователя',
      examples: ['user1'],
    },
    requestId: {
      type: 'string',
      description: 'Идентификатор запроса',
      examples: ['req1'],
    },
    result: {
      type: 'object',
      description: 'Результат анализа',
    },
    metadata: {
      type: 'object',
      description: 'Метаданные анализа',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Дата и время создания анализа',
      examples: ['2023-01-31T12:00:00Z'],
    },
  },
});
