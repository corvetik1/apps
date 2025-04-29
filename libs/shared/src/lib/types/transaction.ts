/**
 * Типы и DTO для транзакций
 *
 * Этот модуль содержит все типы, связанные с транзакциями в системе,
 * включая типы транзакций, основной интерфейс транзакции и DTO для API.
 */

import { createBaseJsonSchema } from '../utils/json-schema';

/**
 * Типы транзакций в системе
 *
 * @example
 * ```typescript
 * const transactionType = TransactionType.Income;
 * ```
 */
export enum TransactionType {
  /** Доход (пополнение) */
  Income = 'income',
  /** Расход (списание) */
  Expense = 'expense',
}

/**
 * Интерфейс транзакции в системе
 *
 * @example
 * ```typescript
 * const transaction: Transaction = {
 *   id: '1',
 *   tenderId: 'tender1',
 *   amount: 1000,
 *   currency: 'RUB',
 *   date: '2023-01-01T00:00:00Z',
 *   type: TransactionType.Income,
 *   description: 'Зарплата',
 *   accountId: 'account1',
 *   createdAt: '2023-01-01T00:00:00Z',
 *   updatedAt: '2023-01-01T00:00:00Z',
 * };
 * ```
 */
export interface Transaction {
  /** Уникальный идентификатор транзакции */
  id: string;
  /** Идентификатор связанного тендера */
  tenderId: string;
  /** Сумма транзакции */
  amount: number;
  /** Валюта транзакции */
  currency: string;
  /** Дата и время транзакции */
  date: string;
  /** Тип транзакции (доход/расход) */
  type: TransactionType | string;
  /** Описание транзакции */
  description: string;
  /** Идентификатор счета */
  accountId: string;
  /** Идентификатор категории (опционально) */
  categoryId?: string;
  /** Идентификатор контрагента (опционально) */
  counterpartyId?: string;
  /** Теги транзакции (опционально) */
  tags?: string[];
  /** Дата и время создания транзакции */
  createdAt: string;
  /** Дата и время последнего обновления транзакции */
  updatedAt: string;
}

/**
 * DTO для создания новой транзакции
 *
 * @example
 * ```typescript
 * const createTransactionDto: CreateTransactionDto = {
 *   tenderId: 'tender1',
 *   amount: 1000,
 *   currency: 'RUB',
 *   date: '2023-01-01T00:00:00Z',
 *   type: TransactionType.Income,
 *   description: 'Зарплата',
 *   accountId: 'account1',
 * };
 * ```
 */
export interface CreateTransactionDto {
  /** Идентификатор связанного тендера */
  tenderId: string;
  /** Сумма транзакции */
  amount: number;
  /** Валюта транзакции */
  currency: string;
  /** Дата и время транзакции */
  date: string;
  /** Тип транзакции (доход/расход) */
  type: TransactionType | string;
  /** Описание транзакции */
  description: string;
  /** Идентификатор счета */
  accountId: string;
  /** Идентификатор категории (опционально) */
  categoryId?: string;
  /** Идентификатор контрагента (опционально) */
  counterpartyId?: string;
  /** Теги транзакции (опционально) */
  tags?: string[];
}

/**
 * DTO для ответа с данными транзакции
 *
 * @example
 * ```typescript
 * const transactionResponseDto: TransactionResponseDto = {
 *   id: '1',
 *   tenderId: 'tender1',
 *   amount: 1000,
 *   currency: 'RUB',
 *   date: '2023-01-01T00:00:00Z',
 *   type: TransactionType.Income,
 *   description: 'Зарплата',
 *   accountId: 'account1',
 *   createdAt: '2023-01-01T00:00:00Z',
 *   updatedAt: '2023-01-01T00:00:00Z',
 * };
 * ```
 */
export interface TransactionResponseDto extends Transaction {
  // Добавляем служебное поле для отличия от базового интерфейса
  _responseType?: 'transaction';
}

/**
 * JSON-схема для транзакции
 *
 * Используется для валидации данных и документации API
 */
export const transactionSchema = createBaseJsonSchema({
  title: 'Transaction',
  description: 'Транзакция в системе',
  required: [
    'id',
    'tenderId',
    'amount',
    'currency',
    'date',
    'type',
    'description',
    'accountId',
    'createdAt',
    'updatedAt',
  ],
  properties: {
    id: {
      type: 'string',
      description: 'Уникальный идентификатор транзакции',
      examples: ['1', 'a1b2c3d4'],
    },
    tenderId: {
      type: 'string',
      description: 'Идентификатор связанного тендера',
      examples: ['tender1'],
    },
    amount: {
      type: 'number',
      description: 'Сумма транзакции',
      examples: [1000, 5000],
    },
    currency: {
      type: 'string',
      description: 'Валюта транзакции',
      examples: ['RUB', 'USD', 'EUR'],
    },
    date: {
      type: 'string',
      format: 'date-time',
      description: 'Дата и время транзакции',
      examples: ['2023-01-01T00:00:00Z'],
    },
    type: {
      type: 'string',
      enum: Object.values(TransactionType),
      description: 'Тип транзакции (доход/расход)',
      examples: ['income', 'expense'],
    },
    description: {
      type: 'string',
      description: 'Описание транзакции',
      examples: ['Зарплата', 'Покупка продуктов'],
    },
    accountId: {
      type: 'string',
      description: 'Идентификатор счета',
      examples: ['account1'],
    },
    categoryId: {
      type: 'string',
      description: 'Идентификатор категории',
      examples: ['category1'],
    },
    counterpartyId: {
      type: 'string',
      description: 'Идентификатор контрагента',
      examples: ['counterparty1'],
    },
    tags: {
      type: 'array',
      items: {
        type: 'string',
      },
      description: 'Теги транзакции',
      examples: [['покупка', 'электроника']],
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Дата и время создания транзакции',
      examples: ['2023-01-01T00:00:00Z'],
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Дата и время последнего обновления транзакции',
      examples: ['2023-01-01T00:00:00Z'],
    },
  },
});
