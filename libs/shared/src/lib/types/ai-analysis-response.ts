/**
 * Типы для ответа AI-анализа
 *
 * Этот модуль содержит все типы, связанные с ответами AI-анализа в системе.
 */

import { createBaseJsonSchema } from '../utils/json-schema';

/**
 * Интерфейс сводки AI-анализа
 *
 * @example
 * ```typescript
 * const summary: AIAnalysisSummary = {
 *   totalIncome: 5000,
 *   totalExpense: 1000,
 *   balance: 4000,
 * };
 * ```
 */
export interface AIAnalysisSummary {
  /** Общий доход */
  totalIncome: number;
  /** Общий расход */
  totalExpense: number;
  /** Баланс (доход - расход) */
  balance: number;
  /** Дополнительные свойства */
  [key: string]: unknown;
}

/**
 * Интерфейс категории с суммой и процентом
 *
 * @example
 * ```typescript
 * const category: AIAnalysisCategory = {
 *   name: 'Продукты',
 *   amount: 1000,
 *   percentage: 100,
 * };
 * ```
 */
export interface AIAnalysisCategory {
  /** Название категории */
  name: string;
  /** Сумма */
  amount: number;
  /** Процент от общей суммы */
  percentage: number;
  /** Дополнительные свойства */
  [key: string]: unknown;
}

/**
 * Интерфейс данных ответа AI-анализа
 *
 * @example
 * ```typescript
 * const data: AIAnalysisResponseData = {
 *   summary: {
 *     totalIncome: 5000,
 *     totalExpense: 1000,
 *     balance: 4000,
 *   },
 *   recommendations: [
 *     'Рекомендуем увеличить сбережения',
 *     'Рассмотрите возможность инвестирования',
 *   ],
 *   categories: [
 *     { name: 'Продукты', amount: 1000, percentage: 100 },
 *   ],
 * };
 * ```
 */
export interface AIAnalysisResponseData {
  /** Сводка по финансам */
  summary?: AIAnalysisSummary;
  /** Список рекомендаций */
  recommendations?: string[];
  /** Список категорий с расходами */
  categories?: AIAnalysisCategory[];
  /** Дополнительные свойства */
  [key: string]: unknown;
}

/**
 * Интерфейс метаданных ответа AI-анализа
 *
 * @example
 * ```typescript
 * const metadata: AIAnalysisResponseMetadata = {
 *   processingTime: 0.5,
 *   modelVersion: '1.0',
 *   tokenCount: 150,
 * };
 * ```
 */
export interface AIAnalysisResponseMetadata {
  /** Время обработки запроса в секундах */
  processingTime?: number;
  /** Версия модели AI */
  modelVersion?: string;
  /** Количество использованных токенов */
  tokenCount?: number;
  /** Дополнительные свойства */
  [key: string]: unknown;
}

/**
 * Интерфейс ответа AI-анализа
 *
 * @example
 * ```typescript
 * const response: AIAnalysisResponse = {
 *   userId: 'user1',
 *   requestId: 'req1',
 *   result: 'За последний месяц ваши основные расходы были на продукты (1000 руб). Общий доход составил 5000 руб.',
 *   data: {
 *     summary: {
 *       totalIncome: 5000,
 *       totalExpense: 1000,
 *       balance: 4000,
 *     },
 *     recommendations: [
 *       'Рекомендуем увеличить сбережения',
 *       'Рассмотрите возможность инвестирования',
 *     ],
 *     categories: [
 *       { name: 'Продукты', amount: 1000, percentage: 100 },
 *     ],
 *   },
 *   metadata: {
 *     processingTime: 0.5,
 *     modelVersion: '1.0',
 *     tokenCount: 150,
 *   },
 *   createdAt: '2023-01-31T12:00:00Z',
 * };
 * ```
 */
export interface AIAnalysisResponse {
  /** Идентификатор пользователя */
  userId: string;
  /** Идентификатор запроса */
  requestId: string;
  /** Результат анализа в текстовом виде */
  result: string;
  /** Структурированные данные анализа (опционально) */
  data?: AIAnalysisResponseData;
  /** Метаданные ответа (опционально) */
  metadata?: AIAnalysisResponseMetadata;
  /** Дата и время создания ответа */
  createdAt: string;
  /** Дополнительные свойства */
  [key: string]: unknown;
}

/**
 * JSON-схема для ответа AI-анализа
 *
 * Используется для валидации данных и документации API
 */
export const aiAnalysisResponseSchema = createBaseJsonSchema({
  title: 'AIAnalysisResponse',
  description: 'Ответ AI-анализа',
  required: ['userId', 'requestId', 'result', 'createdAt'],
  properties: {
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
      type: 'string',
      description: 'Результат анализа в текстовом виде',
      examples: [
        'За последний месяц ваши основные расходы были на продукты (1000 руб). Общий доход составил 5000 руб.',
      ],
    },
    data: {
      type: 'object',
      description: 'Структурированные данные анализа',
      properties: {
        summary: {
          type: 'object',
          properties: {
            totalIncome: {
              type: 'number',
              description: 'Общий доход',
              examples: [5000],
            },
            totalExpense: {
              type: 'number',
              description: 'Общий расход',
              examples: [1000],
            },
            balance: {
              type: 'number',
              description: 'Баланс (доход - расход)',
              examples: [4000],
            },
          },
          required: ['totalIncome', 'totalExpense', 'balance'],
          description: 'Сводка по финансам',
        },
        recommendations: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Список рекомендаций',
          examples: [
            ['Рекомендуем увеличить сбережения', 'Рассмотрите возможность инвестирования'],
          ],
        },
        categories: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Название категории',
                examples: ['Продукты'],
              },
              amount: {
                type: 'number',
                description: 'Сумма',
                examples: [1000],
              },
              percentage: {
                type: 'number',
                description: 'Процент от общей суммы',
                examples: [100],
              },
            },
            required: ['name', 'amount', 'percentage'],
          },
          description: 'Список категорий с расходами',
          examples: [[{ name: 'Продукты', amount: 1000, percentage: 100 }]],
        },
      },
    },
    metadata: {
      type: 'object',
      description: 'Метаданные ответа',
      properties: {
        processingTime: {
          type: 'number',
          description: 'Время обработки запроса в секундах',
          examples: [0.5],
        },
        modelVersion: {
          type: 'string',
          description: 'Версия модели AI',
          examples: ['1.0'],
        },
        tokenCount: {
          type: 'number',
          description: 'Количество использованных токенов',
          examples: [150],
        },
      },
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Дата и время создания ответа',
      examples: ['2023-01-31T12:00:00Z'],
    },
  },
});
