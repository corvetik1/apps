/**
 * Типы и DTO для отчетов
 *
 * Этот модуль содержит все типы, связанные с отчетами в системе,
 * включая типы отчетов, форматы, статусы, основной интерфейс отчета и DTO для API.
 */

import { createBaseJsonSchema } from '../utils/json-schema';

/**
 * Типы отчетов в системе
 *
 * @example
 * ```typescript
 * const reportType = ReportType.Financial;
 * ```
 */
export enum ReportType {
  /** Финансовый отчет */
  Financial = 'financial',
  /** Налоговый отчет */
  Tax = 'tax',
  /** Бюджетный отчет */
  Budget = 'budget',
  /** Инвестиционный отчет */
  Investment = 'investment',
  /** Отчет по расходам */
  Expense = 'expense',
  /** Отчет по доходам */
  Income = 'income',
  /** Пользовательский отчет */
  Custom = 'custom',
}

/**
 * Форматы отчетов в системе
 *
 * @example
 * ```typescript
 * const reportFormat = ReportFormat.PDF;
 * ```
 */
export enum ReportFormat {
  /** PDF формат */
  PDF = 'pdf',
  /** Excel формат */
  Excel = 'excel',
  /** CSV формат */
  CSV = 'csv',
  /** JSON формат */
  JSON = 'json',
  /** HTML формат */
  HTML = 'html',
}

/**
 * Статусы отчетов в системе
 *
 * @example
 * ```typescript
 * const reportStatus = ReportStatus.Generated;
 * ```
 */
export enum ReportStatus {
  /** Ожидает генерации */
  Pending = 'pending',
  /** Сгенерирован */
  Generated = 'generated',
  /** Ошибка генерации */
  Failed = 'failed',
  /** Срок действия истек */
  Expired = 'expired',
}

/**
 * Интерфейс параметров отчета
 *
 * @example
 * ```typescript
 * const reportParameters: ReportParameters = {
 *   startDate: '2023-01-01',
 *   endDate: '2023-12-31',
 *   includeCategories: ['income', 'expense', 'investment'],
 *   groupBy: 'month'
 * };
 * ```
 */
export interface ReportParameters {
  /** Начальная дата (опционально) */
  startDate?: string;
  /** Конечная дата (опционально) */
  endDate?: string;
  /** Категории для включения (опционально) */
  includeCategories?: string[];
  /** Группировка (опционально) */
  groupBy?: string;
  /** Год (опционально) */
  year?: string;
  /** Типы налогов (опционально) */
  taxTypes?: string[];
  /** Любые другие параметры (опционально) */
  [key: string]: any;
}

/**
 * Интерфейс фильтров отчета
 *
 * @example
 * ```typescript
 * const reportFilters: ReportFilters = {
 *   accounts: ['account1', 'account2'],
 *   categories: ['salary', 'rent', 'food'],
 *   minAmount: 1000,
 *   maxAmount: 50000
 * };
 * ```
 */
export interface ReportFilters {
  /** Счета (опционально) */
  accounts?: string[];
  /** Категории (опционально) */
  categories?: string[];
  /** Минимальная сумма (опционально) */
  minAmount?: number;
  /** Максимальная сумма (опционально) */
  maxAmount?: number;
  /** Любые другие фильтры (опционально) */
  [key: string]: any;
}

/**
 * Интерфейс отчета в системе
 *
 * @example
 * ```typescript
 * const report: Report = {
 *   id: '1',
 *   userId: 'user1',
 *   title: 'Финансовый отчет за 2023 год',
 *   description: 'Годовой финансовый отчет',
 *   type: ReportType.Financial,
 *   format: ReportFormat.PDF,
 *   status: ReportStatus.Generated,
 *   parameters: {
 *     startDate: '2023-01-01',
 *     endDate: '2023-12-31',
 *     includeCategories: ['income', 'expense', 'investment'],
 *     groupBy: 'month'
 *   },
 *   fileUrl: 'https://example.com/reports/financial-2023.pdf',
 *   fileSize: 1024000,
 *   generatedAt: '2024-01-05T10:00:00Z',
 *   expiresAt: '2025-01-05T10:00:00Z',
 *   filters: {
 *     accounts: ['account1', 'account2'],
 *     categories: ['salary', 'rent', 'food'],
 *     minAmount: 1000,
 *     maxAmount: 50000
 *   },
 *   tags: ['годовой', 'финансы', '2023'],
 *   createdAt: '2024-01-01T00:00:00Z',
 *   updatedAt: '2024-01-05T10:00:00Z',
 * };
 * ```
 */
export interface Report {
  /** Уникальный идентификатор отчета */
  id: string;
  /** Идентификатор владельца отчета */
  userId: string;
  /** Название отчета */
  title: string;
  /** Описание отчета */
  description: string;
  /** Тип отчета */
  type: ReportType | string;
  /** Формат отчета */
  format: ReportFormat | string;
  /** Статус отчета */
  status: ReportStatus | string;
  /** Параметры отчета */
  parameters: ReportParameters;
  /** URL файла отчета (опционально) */
  fileUrl?: string;
  /** Размер файла в байтах (опционально) */
  fileSize?: number;
  /** Дата и время генерации отчета (опционально) */
  generatedAt?: string;
  /** Дата и время истечения срока действия отчета (опционально) */
  expiresAt?: string;
  /** Фильтры отчета (опционально) */
  filters?: ReportFilters;
  /** Теги отчета (опционально) */
  tags?: string[];
  /** Дата и время создания отчета */
  createdAt: string;
  /** Дата и время последнего обновления отчета */
  updatedAt: string;
}

/**
 * DTO для создания нового отчета
 *
 * @example
 * ```typescript
 * const createReportDto: CreateReportDto = {
 *   userId: 'user1',
 *   title: 'Финансовый отчет за 2023 год',
 *   description: 'Годовой финансовый отчет',
 *   type: ReportType.Financial,
 *   format: ReportFormat.PDF,
 *   parameters: {
 *     startDate: '2023-01-01',
 *     endDate: '2023-12-31',
 *     includeCategories: ['income', 'expense', 'investment'],
 *     groupBy: 'month'
 *   },
 *   filters: {
 *     accounts: ['account1', 'account2'],
 *     categories: ['salary', 'rent', 'food'],
 *     minAmount: 1000,
 *     maxAmount: 50000
 *   },
 *   tags: ['годовой', 'финансы', '2023'],
 * };
 * ```
 */
export interface CreateReportDto {
  /** Идентификатор владельца отчета */
  userId: string;
  /** Название отчета */
  title: string;
  /** Описание отчета */
  description: string;
  /** Тип отчета */
  type: ReportType | string;
  /** Формат отчета */
  format: ReportFormat | string;
  /** Параметры отчета */
  parameters: ReportParameters;
  /** Фильтры отчета (опционально) */
  filters?: ReportFilters;
  /** Теги отчета (опционально) */
  tags?: string[];
}

/**
 * DTO для обновления существующего отчета
 *
 * @example
 * ```typescript
 * const updateReportDto: UpdateReportDto = {
 *   title: 'Обновленный финансовый отчет за 2023 год',
 *   status: ReportStatus.Generated,
 *   fileUrl: 'https://example.com/reports/financial-2023-updated.pdf',
 *   fileSize: 1048576,
 *   generatedAt: '2024-01-10T15:30:00Z',
 * };
 * ```
 */
export interface UpdateReportDto {
  /** Название отчета */
  title?: string;
  /** Описание отчета */
  description?: string;
  /** Тип отчета */
  type?: ReportType | string;
  /** Формат отчета */
  format?: ReportFormat | string;
  /** Статус отчета */
  status?: ReportStatus | string;
  /** Параметры отчета */
  parameters?: ReportParameters;
  /** URL файла отчета */
  fileUrl?: string;
  /** Размер файла в байтах */
  fileSize?: number;
  /** Дата и время генерации отчета */
  generatedAt?: string;
  /** Дата и время истечения срока действия отчета */
  expiresAt?: string;
  /** Фильтры отчета */
  filters?: ReportFilters;
  /** Теги отчета */
  tags?: string[];
}

/**
 * DTO для ответа с данными отчета
 *
 * @example
 * ```typescript
 * const reportResponseDto: ReportResponseDto = {
 *   id: '1',
 *   userId: 'user1',
 *   title: 'Финансовый отчет за 2023 год',
 *   description: 'Годовой финансовый отчет',
 *   type: ReportType.Financial,
 *   format: ReportFormat.PDF,
 *   status: ReportStatus.Generated,
 *   parameters: {
 *     startDate: '2023-01-01',
 *     endDate: '2023-12-31',
 *     includeCategories: ['income', 'expense', 'investment'],
 *     groupBy: 'month'
 *   },
 *   fileUrl: 'https://example.com/reports/financial-2023.pdf',
 *   fileSize: 1024000,
 *   generatedAt: '2024-01-05T10:00:00Z',
 *   expiresAt: '2025-01-05T10:00:00Z',
 *   filters: {
 *     accounts: ['account1', 'account2'],
 *     categories: ['salary', 'rent', 'food'],
 *     minAmount: 1000,
 *     maxAmount: 50000
 *   },
 *   tags: ['годовой', 'финансы', '2023'],
 *   createdAt: '2024-01-01T00:00:00Z',
 *   updatedAt: '2024-01-05T10:00:00Z',
 * };
 * ```
 */
export interface ReportResponseDto extends Report {
  // Добавляем служебное поле для отличия от базового интерфейса
  _responseType?: 'report';
}

/**
 * JSON-схема для отчета
 *
 * Используется для валидации данных и документации API
 */
export const reportSchema = createBaseJsonSchema({
  title: 'Report',
  description: 'Отчет в системе',
  required: [
    'id',
    'userId',
    'title',
    'description',
    'type',
    'format',
    'status',
    'parameters',
    'createdAt',
    'updatedAt',
  ],
  properties: {
    id: {
      type: 'string',
      description: 'Уникальный идентификатор отчета',
      examples: ['1', 'a1b2c3d4'],
    },
    userId: {
      type: 'string',
      description: 'Идентификатор владельца отчета',
      examples: ['user1'],
    },
    title: {
      type: 'string',
      description: 'Название отчета',
      examples: ['Финансовый отчет за 2023 год'],
    },
    description: {
      type: 'string',
      description: 'Описание отчета',
      examples: ['Годовой финансовый отчет'],
    },
    type: {
      type: 'string',
      enum: Object.values(ReportType),
      description: 'Тип отчета',
      examples: ['financial', 'tax', 'budget'],
    },
    format: {
      type: 'string',
      enum: Object.values(ReportFormat),
      description: 'Формат отчета',
      examples: ['pdf', 'excel', 'csv'],
    },
    status: {
      type: 'string',
      enum: Object.values(ReportStatus),
      description: 'Статус отчета',
      examples: ['pending', 'generated', 'failed'],
    },
    parameters: {
      type: 'object',
      description: 'Параметры отчета',
      examples: [
        {
          startDate: '2023-01-01',
          endDate: '2023-12-31',
          includeCategories: ['income', 'expense', 'investment'],
          groupBy: 'month',
        },
      ],
    },
    fileUrl: {
      type: 'string',
      description: 'URL файла отчета',
      examples: ['https://example.com/reports/financial-2023.pdf'],
    },
    fileSize: {
      type: 'number',
      description: 'Размер файла в байтах',
      examples: [1024000],
    },
    generatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Дата и время генерации отчета',
      examples: ['2024-01-05T10:00:00Z'],
    },
    expiresAt: {
      type: 'string',
      format: 'date-time',
      description: 'Дата и время истечения срока действия отчета',
      examples: ['2025-01-05T10:00:00Z'],
    },
    filters: {
      type: 'object',
      description: 'Фильтры отчета',
      examples: [
        {
          accounts: ['account1', 'account2'],
          categories: ['salary', 'rent', 'food'],
          minAmount: 1000,
          maxAmount: 50000,
        },
      ],
    },
    tags: {
      type: 'array',
      items: {
        type: 'string',
      },
      description: 'Теги отчета',
      examples: [['годовой', 'финансы', '2023']],
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Дата и время создания отчета',
      examples: ['2024-01-01T00:00:00Z'],
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Дата и время последнего обновления отчета',
      examples: ['2024-01-05T10:00:00Z'],
    },
  },
});
