/**
 * Типы и DTO для счетов
 *
 * Этот модуль содержит все типы, связанные со счетами в системе,
 * включая типы счетов, основной интерфейс счета и DTO для API.
 */

import { createBaseJsonSchema } from '../utils/json-schema';

/**
 * Типы счетов в системе
 *
 * @example
 * ```typescript
 * const accountType = AccountType.Debit;
 * ```
 */
export enum AccountType {
  /** Дебетовый счет (обычный) */
  Debit = 'debit',
  /** Кредитный счет */
  Credit = 'credit',
}

/**
 * Интерфейс счета в системе
 *
 * @example
 * ```typescript
 * // Дебетовый счет
 * const debitAccount: Account = {
 *   id: '1',
 *   name: 'Основной счет',
 *   type: AccountType.Debit,
 *   balance: 1000,
 *   userId: 'user1',
 *   createdAt: '2023-01-01T00:00:00Z',
 *   updatedAt: '2023-01-01T00:00:00Z',
 * };
 *
 * // Кредитный счет
 * const creditAccount: Account = {
 *   id: '2',
 *   name: 'Кредитная карта',
 *   type: AccountType.Credit,
 *   balance: 5000,
 *   userId: 'user1',
 *   creditLimit: 10000,
 *   debt: 5000,
 *   gracePeriod: '30',
 *   minPayment: 500,
 *   paymentDueDate: '2023-02-01',
 *   isPaid: false,
 *   createdAt: '2023-01-01T00:00:00Z',
 *   updatedAt: '2023-01-01T00:00:00Z',
 * };
 * ```
 */
export interface Account {
  /** Уникальный идентификатор счета */
  id: string;
  /** Название счета */
  name: string;
  /** Тип счета */
  type: AccountType | string;
  /** Текущий баланс счета */
  balance: number;
  /** Идентификатор владельца счета */
  userId: string;
  /** Кредитный лимит (только для кредитных счетов) */
  creditLimit?: number;
  /** Текущая задолженность (только для кредитных счетов) */
  debt?: number;
  /** Льготный период в днях (только для кредитных счетов) */
  gracePeriod?: string;
  /** Минимальный платеж (только для кредитных счетов) */
  minPayment?: number;
  /** Дата платежа (только для кредитных счетов) */
  paymentDueDate?: string;
  /** Флаг оплаты (только для кредитных счетов) */
  isPaid?: boolean;
  /** Дата и время создания счета */
  createdAt: string;
  /** Дата и время последнего обновления счета */
  updatedAt: string;
}

/**
 * DTO для создания нового счета
 *
 * @example
 * ```typescript
 * // Создание дебетового счета
 * const createDebitAccountDto: CreateAccountDto = {
 *   name: 'Новый счет',
 *   type: AccountType.Debit,
 *   balance: 0,
 *   userId: 'user1',
 * };
 *
 * // Создание кредитного счета
 * const createCreditAccountDto: CreateAccountDto = {
 *   name: 'Новая кредитная карта',
 *   type: AccountType.Credit,
 *   balance: 0,
 *   userId: 'user1',
 *   creditLimit: 10000,
 *   gracePeriod: '30',
 *   minPayment: 500,
 * };
 * ```
 */
export interface CreateAccountDto {
  /** Название счета */
  name: string;
  /** Тип счета */
  type: AccountType | string;
  /** Начальный баланс счета */
  balance: number;
  /** Идентификатор владельца счета */
  userId: string;
  /** Кредитный лимит (только для кредитных счетов) */
  creditLimit?: number;
  /** Льготный период в днях (только для кредитных счетов) */
  gracePeriod?: string;
  /** Минимальный платеж (только для кредитных счетов) */
  minPayment?: number;
  /** Дата платежа (только для кредитных счетов) */
  paymentDueDate?: string;
}

/**
 * DTO для обновления существующего счета
 *
 * @example
 * ```typescript
 * const updateAccountDto: UpdateAccountDto = {
 *   name: 'Обновленный счет',
 *   balance: 2000,
 * };
 * ```
 */
export interface UpdateAccountDto {
  /** Название счета */
  name?: string;
  /** Тип счета */
  type?: AccountType | string;
  /** Текущий баланс счета */
  balance?: number;
  /** Кредитный лимит (только для кредитных счетов) */
  creditLimit?: number;
  /** Текущая задолженность (только для кредитных счетов) */
  debt?: number;
  /** Льготный период в днях (только для кредитных счетов) */
  gracePeriod?: string;
  /** Минимальный платеж (только для кредитных счетов) */
  minPayment?: number;
  /** Дата платежа (только для кредитных счетов) */
  paymentDueDate?: string;
  /** Флаг оплаты (только для кредитных счетов) */
  isPaid?: boolean;
}

/**
 * DTO для ответа с данными счета
 *
 * @example
 * ```typescript
 * const accountResponseDto: AccountResponseDto = {
 *   id: '1',
 *   name: 'Основной счет',
 *   type: AccountType.Debit,
 *   balance: 1000,
 *   userId: 'user1',
 *   createdAt: '2023-01-01T00:00:00Z',
 *   updatedAt: '2023-01-01T00:00:00Z',
 * };
 * ```
 */
export interface AccountResponseDto extends Account {
  // Добавляем служебное поле для отличия от базового интерфейса
  _responseType?: 'account';
}

/**
 * JSON-схема для счета
 *
 * Используется для валидации данных и документации API
 */
export const accountSchema = createBaseJsonSchema({
  title: 'Account',
  description: 'Счет в системе',
  required: ['id', 'name', 'type', 'balance', 'userId', 'createdAt', 'updatedAt'],
  properties: {
    id: {
      type: 'string',
      description: 'Уникальный идентификатор счета',
      examples: ['1', 'a1b2c3d4'],
    },
    name: {
      type: 'string',
      description: 'Название счета',
      examples: ['Основной счет', 'Кредитная карта'],
    },
    type: {
      type: 'string',
      enum: Object.values(AccountType),
      description: 'Тип счета',
      examples: ['debit', 'credit'],
    },
    balance: {
      type: 'number',
      description: 'Текущий баланс счета',
      examples: [1000, 5000],
    },
    userId: {
      type: 'string',
      description: 'Идентификатор владельца счета',
      examples: ['user1'],
    },
    creditLimit: {
      type: 'number',
      description: 'Кредитный лимит (только для кредитных счетов)',
      examples: [10000],
    },
    debt: {
      type: 'number',
      description: 'Текущая задолженность (только для кредитных счетов)',
      examples: [5000],
    },
    gracePeriod: {
      type: 'string',
      description: 'Льготный период в днях (только для кредитных счетов)',
      examples: ['30'],
    },
    minPayment: {
      type: 'number',
      description: 'Минимальный платеж (только для кредитных счетов)',
      examples: [500],
    },
    paymentDueDate: {
      type: 'string',
      description: 'Дата платежа (только для кредитных счетов)',
      examples: ['2023-02-01'],
    },
    isPaid: {
      type: 'boolean',
      description: 'Флаг оплаты (только для кредитных счетов)',
      examples: [false, true],
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Дата и время создания счета',
      examples: ['2023-01-01T00:00:00Z'],
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Дата и время последнего обновления счета',
      examples: ['2023-01-01T00:00:00Z'],
    },
  },
});
