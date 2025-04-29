/**
 * Типы и DTO для налогов
 *
 * Этот модуль содержит все типы, связанные с налогами в системе,
 * включая типы налогов, статусы, основной интерфейс налога и DTO для API.
 */

import { createBaseJsonSchema } from '../utils/json-schema';

/**
 * Типы налогов в системе
 *
 * @example
 * ```typescript
 * const taxType = TaxType.Income;
 * ```
 */
export enum TaxType {
  /** Налог на доходы */
  Income = 'income',
  /** Налог на имущество */
  Property = 'property',
  /** НДС */
  VAT = 'vat',
  /** Транспортный налог */
  Transport = 'transport',
  /** Земельный налог */
  Land = 'land',
  /** Налог для самозанятых */
  SelfEmployed = 'self_employed',
  /** Корпоративный налог */
  Corporate = 'corporate',
  /** Другой тип налога */
  Other = 'other',
}

/**
 * Статусы налогов в системе
 *
 * @example
 * ```typescript
 * const taxStatus = TaxStatus.Pending;
 * ```
 */
export enum TaxStatus {
  /** Ожидает оплаты */
  Pending = 'pending',
  /** Оплачен */
  Paid = 'paid',
  /** Просрочен */
  Overdue = 'overdue',
  /** Рассчитан */
  Calculated = 'calculated',
  /** Оспаривается */
  Disputed = 'disputed',
}

/**
 * Интерфейс налога в системе
 *
 * @example
 * ```typescript
 * const tax: Tax = {
 *   id: '1',
 *   userId: 'user1',
 *   title: 'НДФЛ за 2023 год',
 *   description: 'Налог на доходы физических лиц',
 *   type: TaxType.Income,
 *   status: TaxStatus.Pending,
 *   amount: 65000,
 *   currency: 'RUB',
 *   taxRate: 13,
 *   taxableAmount: 500000,
 *   taxPeriod: '2023',
 *   taxPeriodStart: '2023-01-01',
 *   taxPeriodEnd: '2023-12-31',
 *   dueDate: '2024-04-30',
 *   paymentDate: null,
 *   taxAuthority: 'ФНС России',
 *   taxIdentifier: 'НДФЛ-2023',
 *   documentIds: ['doc1', 'doc2'],
 *   relatedEntityId: 'income1',
 *   relatedEntityType: 'income',
 *   createdAt: '2023-01-01T00:00:00Z',
 *   updatedAt: '2023-01-01T00:00:00Z',
 * };
 * ```
 */
export interface Tax {
  /** Уникальный идентификатор налога */
  id: string;
  /** Идентификатор владельца налога */
  userId: string;
  /** Название налога */
  title: string;
  /** Описание налога */
  description: string;
  /** Тип налога */
  type: TaxType | string;
  /** Статус налога */
  status: TaxStatus | string;
  /** Сумма налога */
  amount: number;
  /** Валюта налога */
  currency: string;
  /** Налоговая ставка (опционально) */
  taxRate?: number;
  /** Налогооблагаемая сумма (опционально) */
  taxableAmount?: number;
  /** Налоговый период (опционально) */
  taxPeriod: string;
  /** Начало налогового периода (опционально) */
  taxPeriodStart?: string;
  /** Конец налогового периода (опционально) */
  taxPeriodEnd?: string;
  /** Срок оплаты */
  dueDate: string;
  /** Дата оплаты (опционально) */
  paymentDate?: string | null;
  /** Налоговый орган (опционально) */
  taxAuthority?: string;
  /** Идентификатор налога (опционально) */
  taxIdentifier?: string;
  /** Список идентификаторов документов (опционально) */
  documentIds?: string[];
  /** Идентификатор связанной сущности (опционально) */
  relatedEntityId?: string;
  /** Тип связанной сущности (опционально) */
  relatedEntityType?: string;
  /** Дата и время создания налога */
  createdAt: string;
  /** Дата и время последнего обновления налога */
  updatedAt: string;
}

/**
 * DTO для создания нового налога
 *
 * @example
 * ```typescript
 * const createTaxDto: CreateTaxDto = {
 *   userId: 'user1',
 *   title: 'НДФЛ за 2023 год',
 *   description: 'Налог на доходы физических лиц',
 *   type: TaxType.Income,
 *   status: TaxStatus.Pending,
 *   amount: 65000,
 *   currency: 'RUB',
 *   taxRate: 13,
 *   taxableAmount: 500000,
 *   taxPeriod: '2023',
 *   taxPeriodStart: '2023-01-01',
 *   taxPeriodEnd: '2023-12-31',
 *   dueDate: '2024-04-30',
 *   paymentDate: null,
 *   taxAuthority: 'ФНС России',
 *   taxIdentifier: 'НДФЛ-2023',
 *   documentIds: ['doc1', 'doc2'],
 *   relatedEntityId: 'income1',
 *   relatedEntityType: 'income',
 * };
 * ```
 */
export interface CreateTaxDto {
  /** Идентификатор владельца налога */
  userId: string;
  /** Название налога */
  title: string;
  /** Описание налога */
  description: string;
  /** Тип налога */
  type: TaxType | string;
  /** Статус налога */
  status: TaxStatus | string;
  /** Сумма налога */
  amount: number;
  /** Валюта налога */
  currency: string;
  /** Налоговая ставка (опционально) */
  taxRate?: number;
  /** Налогооблагаемая сумма (опционально) */
  taxableAmount?: number;
  /** Налоговый период (опционально) */
  taxPeriod: string;
  /** Начало налогового периода (опционально) */
  taxPeriodStart?: string;
  /** Конец налогового периода (опционально) */
  taxPeriodEnd?: string;
  /** Срок оплаты */
  dueDate: string;
  /** Дата оплаты (опционально) */
  paymentDate?: string | null;
  /** Налоговый орган (опционально) */
  taxAuthority?: string;
  /** Идентификатор налога (опционально) */
  taxIdentifier?: string;
  /** Список идентификаторов документов (опционально) */
  documentIds?: string[];
  /** Идентификатор связанной сущности (опционально) */
  relatedEntityId?: string;
  /** Тип связанной сущности (опционально) */
  relatedEntityType?: string;
}

/**
 * DTO для обновления существующего налога
 *
 * @example
 * ```typescript
 * const updateTaxDto: UpdateTaxDto = {
 *   status: TaxStatus.Paid,
 *   paymentDate: '2024-04-15',
 *   amount: 65000,
 * };
 * ```
 */
export interface UpdateTaxDto {
  /** Название налога */
  title?: string;
  /** Описание налога */
  description?: string;
  /** Тип налога */
  type?: TaxType | string;
  /** Статус налога */
  status?: TaxStatus | string;
  /** Сумма налога */
  amount?: number;
  /** Валюта налога */
  currency?: string;
  /** Налоговая ставка */
  taxRate?: number;
  /** Налогооблагаемая сумма */
  taxableAmount?: number;
  /** Налоговый период */
  taxPeriod?: string;
  /** Начало налогового периода */
  taxPeriodStart?: string;
  /** Конец налогового периода */
  taxPeriodEnd?: string;
  /** Срок оплаты */
  dueDate?: string;
  /** Дата оплаты */
  paymentDate?: string | null;
  /** Налоговый орган */
  taxAuthority?: string;
  /** Идентификатор налога */
  taxIdentifier?: string;
  /** Список идентификаторов документов */
  documentIds?: string[];
  /** Идентификатор связанной сущности */
  relatedEntityId?: string;
  /** Тип связанной сущности */
  relatedEntityType?: string;
}

/**
 * DTO для ответа с данными налога
 *
 * @example
 * ```typescript
 * const taxResponseDto: TaxResponseDto = {
 *   id: '1',
 *   userId: 'user1',
 *   title: 'НДФЛ за 2023 год',
 *   description: 'Налог на доходы физических лиц',
 *   type: TaxType.Income,
 *   status: TaxStatus.Pending,
 *   amount: 65000,
 *   currency: 'RUB',
 *   taxRate: 13,
 *   taxableAmount: 500000,
 *   taxPeriod: '2023',
 *   taxPeriodStart: '2023-01-01',
 *   taxPeriodEnd: '2023-12-31',
 *   dueDate: '2024-04-30',
 *   paymentDate: null,
 *   taxAuthority: 'ФНС России',
 *   taxIdentifier: 'НДФЛ-2023',
 *   documentIds: ['doc1', 'doc2'],
 *   relatedEntityId: 'income1',
 *   relatedEntityType: 'income',
 *   createdAt: '2023-01-01T00:00:00Z',
 *   updatedAt: '2023-01-01T00:00:00Z',
 * };
 * ```
 */
export interface TaxResponseDto extends Tax {
  // Добавляем служебное поле для отличия от базового интерфейса
  _responseType?: 'tax';
}

/**
 * JSON-схема для налога
 *
 * Используется для валидации данных и документации API
 */
export const taxSchema = createBaseJsonSchema({
  title: 'Tax',
  description: 'Налог в системе',
  required: [
    'id',
    'userId',
    'title',
    'description',
    'type',
    'status',
    'amount',
    'currency',
    'taxPeriod',
    'dueDate',
    'createdAt',
    'updatedAt',
  ],
  properties: {
    id: {
      type: 'string',
      description: 'Уникальный идентификатор налога',
      examples: ['1', 'a1b2c3d4'],
    },
    userId: {
      type: 'string',
      description: 'Идентификатор владельца налога',
      examples: ['user1'],
    },
    title: {
      type: 'string',
      description: 'Название налога',
      examples: ['НДФЛ за 2023 год'],
    },
    description: {
      type: 'string',
      description: 'Описание налога',
      examples: ['Налог на доходы физических лиц'],
    },
    type: {
      type: 'string',
      enum: Object.values(TaxType),
      description: 'Тип налога',
      examples: ['income', 'property', 'vat'],
    },
    status: {
      type: 'string',
      enum: Object.values(TaxStatus),
      description: 'Статус налога',
      examples: ['pending', 'paid', 'overdue'],
    },
    amount: {
      type: 'number',
      description: 'Сумма налога',
      examples: [65000],
    },
    currency: {
      type: 'string',
      description: 'Валюта налога',
      examples: ['RUB', 'USD', 'EUR'],
    },
    taxRate: {
      type: 'number',
      description: 'Налоговая ставка',
      examples: [13, 20, 6],
    },
    taxableAmount: {
      type: 'number',
      description: 'Налогооблагаемая сумма',
      examples: [500000],
    },
    taxPeriod: {
      type: 'string',
      description: 'Налоговый период',
      examples: ['2023', '2023-Q1', '2023-01'],
    },
    taxPeriodStart: {
      type: 'string',
      description: 'Начало налогового периода',
      examples: ['2023-01-01'],
    },
    taxPeriodEnd: {
      type: 'string',
      description: 'Конец налогового периода',
      examples: ['2023-12-31'],
    },
    dueDate: {
      type: 'string',
      description: 'Срок оплаты',
      examples: ['2024-04-30'],
    },
    paymentDate: {
      type: ['string', 'null'],
      description: 'Дата оплаты',
      examples: ['2024-04-15', null],
    },
    taxAuthority: {
      type: 'string',
      description: 'Налоговый орган',
      examples: ['ФНС России'],
    },
    taxIdentifier: {
      type: 'string',
      description: 'Идентификатор налога',
      examples: ['НДФЛ-2023'],
    },
    documentIds: {
      type: 'array',
      items: {
        type: 'string',
      },
      description: 'Список идентификаторов документов',
      examples: [['doc1', 'doc2']],
    },
    relatedEntityId: {
      type: 'string',
      description: 'Идентификатор связанной сущности',
      examples: ['income1'],
    },
    relatedEntityType: {
      type: 'string',
      description: 'Тип связанной сущности',
      examples: ['income', 'property', 'business'],
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Дата и время создания налога',
      examples: ['2023-01-01T00:00:00Z'],
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Дата и время последнего обновления налога',
      examples: ['2023-01-01T00:00:00Z'],
    },
  },
});
