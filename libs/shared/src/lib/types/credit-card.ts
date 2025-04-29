/**
 * Типы и DTO для кредитных карт
 *
 * Этот модуль содержит все типы, связанные с кредитными картами в системе,
 * включая основной интерфейс кредитной карты и DTO для API.
 */

import { createBaseJsonSchema } from '../utils/json-schema';

/**
 * Интерфейс кредитной карты в системе
 *
 * @example
 * ```typescript
 * const creditCard: CreditCard = {
 *   id: '1',
 *   accountId: 'account1',
 *   userId: 'user1',
 *   cardNumber: '1234 5678 9012 3456',
 *   cardHolder: 'IVAN IVANOV',
 *   expiryDate: '12/25',
 *   cvv: '123',
 *   isActive: true,
 *   balance: 5000,
 *   currency: 'RUB',
 *   bank: 'Сбербанк',
 *   paymentSystem: 'Visa',
 *   creditLimit: 100000,
 *   debt: 5000,
 *   gracePeriod: 30,
 *   interestRate: 19.9,
 *   minPayment: 1000,
 *   paymentDueDate: '2023-02-01',
 *   isPaid: false,
 *   createdAt: '2023-01-01T00:00:00Z',
 *   updatedAt: '2023-01-01T00:00:00Z',
 * };
 * ```
 */
export interface CreditCard {
  /** Уникальный идентификатор карты */
  id: string;
  /** Идентификатор связанного счета */
  accountId: string;
  /** Идентификатор владельца карты */
  userId: string;
  /** Номер карты */
  cardNumber: string;
  /** Имя держателя карты */
  cardHolder: string;
  /** Срок действия карты (MM/YY) */
  expiryDate: string;
  /** CVV/CVC код карты */
  cvv: string;
  /** Флаг активности карты */
  isActive: boolean;
  /** Текущий баланс карты */
  balance: number;
  /** Валюта карты */
  currency: string;
  /** Банк-эмитент (опционально) */
  bank?: string;
  /** Платежная система (опционально) */
  paymentSystem?: string;
  /** Кредитный лимит */
  creditLimit: number;
  /** Текущая задолженность */
  debt: number;
  /** Льготный период в днях */
  gracePeriod: number;
  /** Процентная ставка */
  interestRate: number;
  /** Минимальный платеж */
  minPayment: number;
  /** Дата платежа */
  paymentDueDate: string;
  /** Флаг оплаты */
  isPaid: boolean;
  /** Дата и время создания карты */
  createdAt: string;
  /** Дата и время последнего обновления карты */
  updatedAt: string;
}

/**
 * DTO для создания новой кредитной карты
 *
 * @example
 * ```typescript
 * const createCreditCardDto: CreateCreditCardDto = {
 *   accountId: 'account1',
 *   userId: 'user1',
 *   cardNumber: '1234 5678 9012 3456',
 *   cardHolder: 'IVAN IVANOV',
 *   expiryDate: '12/25',
 *   cvv: '123',
 *   isActive: true,
 *   balance: 5000,
 *   currency: 'RUB',
 *   bank: 'Сбербанк',
 *   paymentSystem: 'Visa',
 *   creditLimit: 100000,
 *   gracePeriod: 30,
 *   interestRate: 19.9,
 *   minPayment: 1000,
 *   paymentDueDate: '2023-02-01',
 * };
 * ```
 */
export interface CreateCreditCardDto {
  /** Идентификатор связанного счета */
  accountId: string;
  /** Идентификатор владельца карты */
  userId: string;
  /** Номер карты */
  cardNumber: string;
  /** Имя держателя карты */
  cardHolder: string;
  /** Срок действия карты (MM/YY) */
  expiryDate: string;
  /** CVV/CVC код карты */
  cvv: string;
  /** Флаг активности карты */
  isActive: boolean;
  /** Начальный баланс карты */
  balance: number;
  /** Валюта карты */
  currency: string;
  /** Банк-эмитент (опционально) */
  bank?: string;
  /** Платежная система (опционально) */
  paymentSystem?: string;
  /** Кредитный лимит */
  creditLimit: number;
  /** Льготный период в днях */
  gracePeriod: number;
  /** Процентная ставка */
  interestRate: number;
  /** Минимальный платеж */
  minPayment: number;
  /** Дата платежа */
  paymentDueDate: string;
}

/**
 * DTO для обновления существующей кредитной карты
 *
 * @example
 * ```typescript
 * const updateCreditCardDto: UpdateCreditCardDto = {
 *   isActive: false,
 *   balance: 6000,
 *   debt: 4000,
 *   isPaid: true,
 * };
 * ```
 */
export interface UpdateCreditCardDto {
  /** Номер карты */
  cardNumber?: string;
  /** Имя держателя карты */
  cardHolder?: string;
  /** Срок действия карты (MM/YY) */
  expiryDate?: string;
  /** CVV/CVC код карты */
  cvv?: string;
  /** Флаг активности карты */
  isActive?: boolean;
  /** Текущий баланс карты */
  balance?: number;
  /** Валюта карты */
  currency?: string;
  /** Банк-эмитент */
  bank?: string;
  /** Платежная система */
  paymentSystem?: string;
  /** Кредитный лимит */
  creditLimit?: number;
  /** Текущая задолженность */
  debt?: number;
  /** Льготный период в днях */
  gracePeriod?: number;
  /** Процентная ставка */
  interestRate?: number;
  /** Минимальный платеж */
  minPayment?: number;
  /** Дата платежа */
  paymentDueDate?: string;
  /** Флаг оплаты */
  isPaid?: boolean;
}

/**
 * DTO для ответа с данными кредитной карты
 *
 * @example
 * ```typescript
 * const creditCardResponseDto: CreditCardResponseDto = {
 *   id: '1',
 *   accountId: 'account1',
 *   userId: 'user1',
 *   cardNumber: '1234 5678 9012 3456',
 *   cardHolder: 'IVAN IVANOV',
 *   expiryDate: '12/25',
 *   isActive: true,
 *   balance: 5000,
 *   currency: 'RUB',
 *   bank: 'Сбербанк',
 *   paymentSystem: 'Visa',
 *   creditLimit: 100000,
 *   debt: 5000,
 *   gracePeriod: 30,
 *   interestRate: 19.9,
 *   minPayment: 1000,
 *   paymentDueDate: '2023-02-01',
 *   isPaid: false,
 *   createdAt: '2023-01-01T00:00:00Z',
 *   updatedAt: '2023-01-01T00:00:00Z',
 * };
 * ```
 */
export type CreditCardResponseDto = Omit<CreditCard, 'cvv'>;

/**
 * JSON-схема для кредитной карты
 *
 * Используется для валидации данных и документации API
 */
export const creditCardSchema = createBaseJsonSchema({
  title: 'CreditCard',
  description: 'Кредитная карта в системе',
  required: [
    'id',
    'accountId',
    'userId',
    'cardNumber',
    'cardHolder',
    'expiryDate',
    'cvv',
    'isActive',
    'balance',
    'currency',
    'creditLimit',
    'debt',
    'gracePeriod',
    'interestRate',
    'minPayment',
    'paymentDueDate',
    'isPaid',
    'createdAt',
    'updatedAt',
  ],
  properties: {
    id: {
      type: 'string',
      description: 'Уникальный идентификатор карты',
      examples: ['1', 'a1b2c3d4'],
    },
    accountId: {
      type: 'string',
      description: 'Идентификатор связанного счета',
      examples: ['account1'],
    },
    userId: {
      type: 'string',
      description: 'Идентификатор владельца карты',
      examples: ['user1'],
    },
    cardNumber: {
      type: 'string',
      description: 'Номер карты',
      examples: ['1234 5678 9012 3456'],
    },
    cardHolder: {
      type: 'string',
      description: 'Имя держателя карты',
      examples: ['IVAN IVANOV'],
    },
    expiryDate: {
      type: 'string',
      description: 'Срок действия карты (MM/YY)',
      examples: ['12/25'],
    },
    cvv: {
      type: 'string',
      description: 'CVV/CVC код карты',
      examples: ['123'],
    },
    isActive: {
      type: 'boolean',
      description: 'Флаг активности карты',
      examples: [true, false],
    },
    balance: {
      type: 'number',
      description: 'Текущий баланс карты',
      examples: [5000],
    },
    currency: {
      type: 'string',
      description: 'Валюта карты',
      examples: ['RUB', 'USD', 'EUR'],
    },
    bank: {
      type: 'string',
      description: 'Банк-эмитент',
      examples: ['Сбербанк', 'Тинькофф'],
    },
    paymentSystem: {
      type: 'string',
      description: 'Платежная система',
      examples: ['Visa', 'Mastercard', 'МИР'],
    },
    creditLimit: {
      type: 'number',
      description: 'Кредитный лимит',
      examples: [100000],
    },
    debt: {
      type: 'number',
      description: 'Текущая задолженность',
      examples: [5000],
    },
    gracePeriod: {
      type: 'number',
      description: 'Льготный период в днях',
      examples: [30, 60, 90],
    },
    interestRate: {
      type: 'number',
      description: 'Процентная ставка',
      examples: [19.9, 22.5],
    },
    minPayment: {
      type: 'number',
      description: 'Минимальный платеж',
      examples: [1000],
    },
    paymentDueDate: {
      type: 'string',
      description: 'Дата платежа',
      examples: ['2023-02-01'],
    },
    isPaid: {
      type: 'boolean',
      description: 'Флаг оплаты',
      examples: [true, false],
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Дата и время создания карты',
      examples: ['2023-01-01T00:00:00Z'],
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Дата и время последнего обновления карты',
      examples: ['2023-01-01T00:00:00Z'],
    },
  },
});
