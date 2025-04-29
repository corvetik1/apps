/**
 * Типы для запроса на AI-анализ
 *
 * Этот модуль содержит все типы, связанные с запросами на AI-анализ в системе.
 */

import { createBaseJsonSchema } from '../utils/json-schema';

/**
 * Интерфейс транзакции для AI-анализа
 *
 * @example
 * ```typescript
 * const transaction: AIAnalysisTransaction = {
 *   id: '1',
 *   amount: 1000,
 *   date: '2023-01-01',
 *   description: 'Продукты',
 *   type: 'expense',
 * };
 * ```
 */
export interface AIAnalysisTransaction {
  /** Идентификатор транзакции */
  id: string;
  /** Сумма транзакции */
  amount: number;
  /** Дата транзакции */
  date: string;
  /** Описание транзакции */
  description: string;
  /** Тип транзакции (доход/расход) */
  type: string;
  /** Категория транзакции (опционально) */
  category?: string;
  /** Дополнительные свойства */
  [key: string]: unknown;
}

/**
 * Интерфейс периода для AI-анализа
 *
 * @example
 * ```typescript
 * const period: AIAnalysisPeriod = {
 *   start: '2023-01-01',
 *   end: '2023-01-31',
 * };
 * ```
 */
export interface AIAnalysisPeriod {
  /** Дата начала периода */
  start: string;
  /** Дата окончания периода */
  end: string;
  /** Дополнительные свойства */
  [key: string]: unknown;
}

/**
 * Интерфейс данных для AI-анализа
 *
 * @example
 * ```typescript
 * const data: AIAnalysisData = {
 *   transactions: [
 *     {
 *       id: '1',
 *       amount: 1000,
 *       date: '2023-01-01',
 *       description: 'Продукты',
 *       type: 'expense',
 *     },
 *   ],
 *   period: {
 *     start: '2023-01-01',
 *     end: '2023-01-31',
 *   },
 * };
 * ```
 */
export interface AIAnalysisData {
  /** Список транзакций (опционально) */
  transactions?: AIAnalysisTransaction[];
  /** Период анализа (опционально) */
  period?: AIAnalysisPeriod;
  /** Дополнительные свойства */
  [key: string]: unknown;
}

/**
 * Интерфейс опций для AI-анализа
 *
 * @example
 * ```typescript
 * const options: AIAnalysisOptions = {
 *   language: 'ru',
 *   format: 'text',
 *   maxTokens: 500,
 * };
 * ```
 */
export interface AIAnalysisOptions {
  /** Язык ответа */
  language?: string;
  /** Формат ответа (text, json, html) */
  format?: string;
  /** Максимальное количество токенов */
  maxTokens?: number;
  /** Дополнительные свойства */
  [key: string]: unknown;
}

/**
 * Интерфейс запроса на AI-анализ
 *
 * @example
 * ```typescript
 * const request: AIAnalysisRequest = {
 *   userId: 'user1',
 *   prompt: 'Проанализируй мои расходы за последний месяц',
 *   data: {
 *     transactions: [
 *       {
 *         id: '1',
 *         amount: 1000,
 *         date: '2023-01-01',
 *         description: 'Продукты',
 *         type: 'expense',
 *       },
 *     ],
 *     period: {
 *       start: '2023-01-01',
 *       end: '2023-01-31',
 *     },
 *   },
 *   options: {
 *     language: 'ru',
 *     format: 'text',
 *     maxTokens: 500,
 *   },
 * };
 * ```
 */
export interface AIAnalysisRequest {
  /** Идентификатор пользователя */
  userId: string;
  /** Запрос пользователя */
  prompt: string;
  /** Данные для анализа */
  data: AIAnalysisData;
  /** Опции анализа (опционально) */
  options?: AIAnalysisOptions;
  /** Дополнительные свойства */
  [key: string]: unknown;
}

/**
 * JSON-схема для запроса на AI-анализ
 *
 * Используется для валидации данных и документации API
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
      properties: {
        transactions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: 'Идентификатор транзакции',
                examples: ['1'],
              },
              amount: {
                type: 'number',
                description: 'Сумма транзакции',
                examples: [1000],
              },
              date: {
                type: 'string',
                description: 'Дата транзакции',
                examples: ['2023-01-01'],
              },
              description: {
                type: 'string',
                description: 'Описание транзакции',
                examples: ['Продукты'],
              },
              type: {
                type: 'string',
                description: 'Тип транзакции (доход/расход)',
                examples: ['expense', 'income'],
              },
              category: {
                type: 'string',
                description: 'Категория транзакции',
                examples: ['Продукты'],
              },
            },
            required: ['id', 'amount', 'date', 'description', 'type'],
          },
          description: 'Список транзакций',
        },
        period: {
          type: 'object',
          properties: {
            start: {
              type: 'string',
              description: 'Дата начала периода',
              examples: ['2023-01-01'],
            },
            end: {
              type: 'string',
              description: 'Дата окончания периода',
              examples: ['2023-01-31'],
            },
          },
          required: ['start', 'end'],
          description: 'Период анализа',
        },
      },
    },
    options: {
      type: 'object',
      description: 'Опции анализа',
      properties: {
        language: {
          type: 'string',
          description: 'Язык ответа',
          examples: ['ru', 'en'],
        },
        format: {
          type: 'string',
          description: 'Формат ответа',
          examples: ['text', 'json', 'html'],
        },
        maxTokens: {
          type: 'number',
          description: 'Максимальное количество токенов',
          examples: [500],
        },
      },
    },
  },
});
