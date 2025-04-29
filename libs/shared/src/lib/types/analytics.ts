/**
 * Типы и DTO для аналитики
 *
 * Этот модуль содержит все типы, связанные с аналитикой в системе,
 * включая периоды аналитики, данные для графиков, метрики и DTO для API.
 */

import { createBaseJsonSchema } from '../utils/json-schema';

/**
 * Периоды аналитики в системе
 *
 * @example
 * ```typescript
 * const period = AnalyticsPeriod.Month;
 * ```
 */
export enum AnalyticsPeriod {
  /** День */
  Day = 'day',
  /** Неделя */
  Week = 'week',
  /** Месяц */
  Month = 'month',
  /** Квартал */
  Quarter = 'quarter',
  /** Год */
  Year = 'year',
}

/**
 * Интерфейс для набора данных графика
 *
 * @example
 * ```typescript
 * const dataset: ChartDataset = {
 *   label: 'Доходы',
 *   data: [1000, 1500, 2000],
 *   backgroundColor: 'rgba(75, 192, 192, 0.2)',
 *   borderColor: 'rgba(75, 192, 192, 1)',
 * };
 * ```
 */
export interface ChartDataset {
  /** Название набора данных */
  label: string;
  /** Массив значений */
  data: number[];
  /** Цвет фона (CSS цвет или массив цветов) */
  backgroundColor: string | string[];
  /** Цвет границы (CSS цвет или массив цветов) */
  borderColor: string | string[];
  /** Дополнительные свойства для настройки отображения */
  [key: string]: unknown;
}

/**
 * Интерфейс данных для графика
 *
 * @example
 * ```typescript
 * const chartData: ChartData = {
 *   labels: ['Январь', 'Февраль', 'Март'],
 *   datasets: [
 *     {
 *       label: 'Доходы',
 *       data: [1000, 1500, 2000],
 *       backgroundColor: 'rgba(75, 192, 192, 0.2)',
 *       borderColor: 'rgba(75, 192, 192, 1)',
 *     }
 *   ],
 * };
 * ```
 */
export interface ChartData {
  /** Подписи для оси X */
  labels: string[];
  /** Наборы данных для графика */
  datasets: ChartDataset[];
  /** Дополнительные свойства для настройки отображения */
  [key: string]: unknown;
}

/**
 * Интерфейс для категории с суммой
 *
 * @example
 * ```typescript
 * const category: CategoryAmount = {
 *   name: 'Продукты',
 *   amount: 3000,
 * };
 * ```
 */
export interface CategoryAmount {
  /** Название категории */
  name: string;
  /** Сумма */
  amount: number;
  /** Дополнительные свойства */
  [key: string]: unknown;
}

/**
 * Интерфейс метрик аналитики
 *
 * @example
 * ```typescript
 * const metrics: AnalyticsMetrics = {
 *   totalIncome: 10000,
 *   totalExpense: 8000,
 *   balance: 2000,
 *   transactionCount: 50,
 *   averageTransaction: 200,
 *   topCategories: [
 *     { name: 'Продукты', amount: 3000 },
 *     { name: 'Транспорт', amount: 2000 },
 *   ],
 * };
 * ```
 */
export interface AnalyticsMetrics {
  /** Общий доход */
  totalIncome: number;
  /** Общий расход */
  totalExpense: number;
  /** Баланс (доход - расход) */
  balance: number;
  /** Количество транзакций */
  transactionCount: number;
  /** Средняя сумма транзакции */
  averageTransaction: number;
  /** Топ категорий по расходам */
  topCategories: CategoryAmount[];
  /** Дополнительные метрики */
  [key: string]: unknown;
}

/**
 * Интерфейс графиков аналитики
 *
 * @example
 * ```typescript
 * const charts: AnalyticsCharts = {
 *   income: {
 *     labels: ['Неделя 1', 'Неделя 2', 'Неделя 3', 'Неделя 4'],
 *     datasets: [
 *       {
 *         label: 'Доходы',
 *         data: [2000, 3000, 2500, 2500],
 *         backgroundColor: 'rgba(75, 192, 192, 0.2)',
 *         borderColor: 'rgba(75, 192, 192, 1)',
 *       },
 *     ],
 *   },
 *   expense: {
 *     labels: ['Неделя 1', 'Неделя 2', 'Неделя 3', 'Неделя 4'],
 *     datasets: [
 *       {
 *         label: 'Расходы',
 *         data: [1800, 2200, 2000, 2000],
 *         backgroundColor: 'rgba(255, 99, 132, 0.2)',
 *         borderColor: 'rgba(255, 99, 132, 1)',
 *       },
 *     ],
 *   },
 *   categories: {
 *     labels: ['Продукты', 'Транспорт', 'Развлечения', 'Прочее'],
 *     datasets: [
 *       {
 *         label: 'Расходы по категориям',
 *         data: [3000, 2000, 1500, 1500],
 *         backgroundColor: [
 *           'rgba(255, 99, 132, 0.2)',
 *           'rgba(54, 162, 235, 0.2)',
 *           'rgba(255, 206, 86, 0.2)',
 *           'rgba(75, 192, 192, 0.2)',
 *         ],
 *         borderColor: [
 *           'rgba(255, 99, 132, 1)',
 *           'rgba(54, 162, 235, 1)',
 *           'rgba(255, 206, 86, 1)',
 *           'rgba(75, 192, 192, 1)',
 *         ],
 *       },
 *     ],
 *   },
 * };
 * ```
 */
export interface AnalyticsCharts {
  /** График доходов */
  income: ChartData;
  /** График расходов */
  expense: ChartData;
  /** График по категориям */
  categories: ChartData;
  /** Дополнительные графики */
  [key: string]: ChartData;
}

/**
 * Интерфейс запроса на аналитику
 *
 * @example
 * ```typescript
 * const request: AnalyticsRequest = {
 *   userId: 'user1',
 *   period: AnalyticsPeriod.Month,
 *   startDate: '2023-01-01',
 *   endDate: '2023-01-31',
 *   includeCharts: true,
 *   includeMetrics: true,
 *   categories: ['Продукты', 'Транспорт'],
 * };
 * ```
 */
export interface AnalyticsRequest {
  /** Идентификатор пользователя */
  userId: string;
  /** Период аналитики */
  period: AnalyticsPeriod | string;
  /** Дата начала периода (опционально) */
  startDate?: string;
  /** Дата окончания периода (опционально) */
  endDate?: string;
  /** Флаг включения графиков в ответ (опционально) */
  includeCharts?: boolean;
  /** Флаг включения метрик в ответ (опционально) */
  includeMetrics?: boolean;
  /** Список категорий для фильтрации (опционально) */
  categories?: string[];
  /** Дополнительные параметры запроса */
  [key: string]: unknown;
}

/**
 * Интерфейс ответа с аналитикой
 *
 * @example
 * ```typescript
 * const response: AnalyticsResponse = {
 *   userId: 'user1',
 *   period: AnalyticsPeriod.Month,
 *   startDate: '2023-01-01',
 *   endDate: '2023-01-31',
 *   metrics: {
 *     totalIncome: 10000,
 *     totalExpense: 8000,
 *     balance: 2000,
 *     transactionCount: 50,
 *     averageTransaction: 200,
 *     topCategories: [
 *       { name: 'Продукты', amount: 3000 },
 *       { name: 'Транспорт', amount: 2000 },
 *     ],
 *   },
 *   charts: {
 *     income: { ... },
 *     expense: { ... },
 *     categories: { ... },
 *   },
 * };
 * ```
 */
export interface AnalyticsResponse {
  /** Идентификатор пользователя */
  userId: string;
  /** Период аналитики */
  period: AnalyticsPeriod | string;
  /** Дата начала периода */
  startDate?: string;
  /** Дата окончания периода */
  endDate?: string;
  /** Метрики аналитики */
  metrics?: AnalyticsMetrics;
  /** Графики аналитики */
  charts?: AnalyticsCharts;
  /** Дополнительные данные ответа */
  [key: string]: unknown;
}

/**
 * JSON-схема для запроса на аналитику
 *
 * Используется для валидации данных и документации API
 */
export const analyticsRequestSchema = createBaseJsonSchema({
  title: 'AnalyticsRequest',
  description: 'Запрос на аналитику',
  required: ['userId', 'period'],
  properties: {
    userId: {
      type: 'string',
      description: 'Идентификатор пользователя',
      examples: ['user1'],
    },
    period: {
      type: 'string',
      enum: Object.values(AnalyticsPeriod),
      description: 'Период аналитики',
      examples: ['month', 'year'],
    },
    startDate: {
      type: 'string',
      description: 'Дата начала периода',
      examples: ['2023-01-01'],
    },
    endDate: {
      type: 'string',
      description: 'Дата окончания периода',
      examples: ['2023-01-31'],
    },
    includeCharts: {
      type: 'boolean',
      description: 'Флаг включения графиков в ответ',
      examples: [true],
    },
    includeMetrics: {
      type: 'boolean',
      description: 'Флаг включения метрик в ответ',
      examples: [true],
    },
    categories: {
      type: 'array',
      items: {
        type: 'string',
      },
      description: 'Список категорий для фильтрации',
      examples: [['Продукты', 'Транспорт']],
    },
  },
});

/**
 * JSON-схема для ответа с аналитикой
 *
 * Используется для валидации данных и документации API
 */
export const analyticsResponseSchema = createBaseJsonSchema({
  title: 'AnalyticsResponse',
  description: 'Ответ с аналитикой',
  required: ['userId', 'period'],
  properties: {
    userId: {
      type: 'string',
      description: 'Идентификатор пользователя',
      examples: ['user1'],
    },
    period: {
      type: 'string',
      enum: Object.values(AnalyticsPeriod),
      description: 'Период аналитики',
      examples: ['month', 'year'],
    },
    startDate: {
      type: 'string',
      description: 'Дата начала периода',
      examples: ['2023-01-01'],
    },
    endDate: {
      type: 'string',
      description: 'Дата окончания периода',
      examples: ['2023-01-31'],
    },
    metrics: {
      type: 'object',
      description: 'Метрики аналитики',
      properties: {
        totalIncome: {
          type: 'number',
          description: 'Общий доход',
          examples: [10000],
        },
        totalExpense: {
          type: 'number',
          description: 'Общий расход',
          examples: [8000],
        },
        balance: {
          type: 'number',
          description: 'Баланс (доход - расход)',
          examples: [2000],
        },
        transactionCount: {
          type: 'number',
          description: 'Количество транзакций',
          examples: [50],
        },
        averageTransaction: {
          type: 'number',
          description: 'Средняя сумма транзакции',
          examples: [200],
        },
        topCategories: {
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
                examples: [3000],
              },
            },
            required: ['name', 'amount'],
          },
          description: 'Топ категорий по расходам',
          examples: [[{ name: 'Продукты', amount: 3000 }]],
        },
      },
      required: [
        'totalIncome',
        'totalExpense',
        'balance',
        'transactionCount',
        'averageTransaction',
        'topCategories',
      ],
    },
    charts: {
      type: 'object',
      description: 'Графики аналитики',
      properties: {
        income: {
          type: 'object',
          description: 'График доходов',
        },
        expense: {
          type: 'object',
          description: 'График расходов',
        },
        categories: {
          type: 'object',
          description: 'График по категориям',
        },
      },
    },
  },
});
