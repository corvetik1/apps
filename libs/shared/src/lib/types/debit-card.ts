/**
 * Типы и DTO для дебетовых карт
 *
 * Этот модуль содержит все типы, связанные с дебетовыми картами в системе,
 * включая основной интерфейс дебетовой карты и DTO для API.
 */

import { createBaseJsonSchema } from '../utils/json-schema';

/**
 * Интерфейс дебетовой карты в системе
 *
 * @example
 * ```typescript
 * const debitCard: DebitCard = {
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
 *   createdAt: '2023-01-01T00:00:00Z',
 *   updatedAt: '2023-01-01T00:00:00Z',
 * };
 * ```
 */
export interface DebitCard {
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
  /** Дата и время создания карты */
  createdAt: string;
  /** Дата и время последнего обновления карты */
  updatedAt: string;
}

/**
 * DTO для создания новой дебетовой карты
 *
 * @example
 * ```typescript
 * const createDebitCardDto: CreateDebitCardDto = {
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
 * };
 * ```
 */
export interface CreateDebitCardDto {
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
}

/**
 * DTO для обновления существующей дебетовой карты
 *
 * @example
 * ```typescript
 * const updateDebitCardDto: UpdateDebitCardDto = {
 *   isActive: false,
 *   balance: 6000,
 * };
 * ```
 */
export interface UpdateDebitCardDto {
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
}

/**
 * DTO для ответа с данными дебетовой карты
 *
 * @example
 * ```typescript
 * const debitCardResponseDto: DebitCardResponseDto = {
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
 *   createdAt: '2023-01-01T00:00:00Z',
 *   updatedAt: '2023-01-01T00:00:00Z',
 * };
 * ```
 */
export type DebitCardResponseDto = Omit<DebitCard, 'cvv'>;

/**
 * JSON-схема для дебетовой карты
 *
 * Используется для валидации данных и документации API
 */
export const debitCardSchema = createBaseJsonSchema({
  title: 'DebitCard',
  description: 'Дебетовая карта в системе',
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
