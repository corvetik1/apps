/**
 * Типы и DTO для долгов
 *
 * Этот модуль содержит все типы, связанные с долгами в системе,
 * включая статусы долгов, основной интерфейс долга и DTO для API.
 */

import { createBaseJsonSchema } from '../utils/json-schema';

/**
 * Статусы долгов в системе
 *
 * @example
 * ```typescript
 * const debtStatus = DebtStatus.Active;
 * ```
 */
export enum DebtStatus {
  /** Активный долг */
  Active = 'active',
  /** Оплаченный долг */
  Paid = 'paid',
  /** Просроченный долг */
  Overdue = 'overdue',
  /** Реструктуризированный долг */
  Restructured = 'restructured',
  /** Списанный долг */
  WrittenOff = 'written_off',
}

/**
 * Интерфейс долга в системе
 *
 * @example
 * ```typescript
 * const debt: Debt = {
 *   id: '1',
 *   userId: 'user1',
 *   title: 'Долг по кредиту',
 *   description: 'Задолженность по кредитному договору №123',
 *   amount: 50000,
 *   currency: 'RUB',
 *   interestRate: 12.5,
 *   startDate: '2023-01-01',
 *   endDate: '2023-12-31',
 *   status: DebtStatus.Active,
 *   remainingAmount: 40000,
 *   nextPaymentDate: '2023-02-01',
 *   nextPaymentAmount: 5000,
 *   creditorName: 'Банк Открытие',
 *   creditorContacts: 'info@open.ru',
 *   documentIds: ['doc1', 'doc2'],
 *   createdAt: '2023-01-01T00:00:00Z',
 *   updatedAt: '2023-01-01T00:00:00Z',
 * };
 * ```
 */
export interface Debt {
  /** Уникальный идентификатор долга */
  id: string;
  /** Идентификатор владельца долга */
  userId: string;
  /** Название долга */
  title: string;
  /** Описание долга */
  description: string;
  /** Общая сумма долга */
  amount: number;
  /** Валюта долга */
  currency: string;
  /** Процентная ставка */
  interestRate: number;
  /** Дата начала долга */
  startDate: string;
  /** Дата окончания долга */
  endDate: string;
  /** Статус долга */
  status: DebtStatus | string;
  /** Оставшаяся сумма долга */
  remainingAmount: number;
  /** Дата следующего платежа */
  nextPaymentDate: string | null;
  /** Сумма следующего платежа */
  nextPaymentAmount: number;
  /** Название кредитора (опционально) */
  creditorName?: string;
  /** Контакты кредитора (опционально) */
  creditorContacts?: string;
  /** Список идентификаторов документов (опционально) */
  documentIds?: string[];
  /** Дата и время создания долга */
  createdAt: string;
  /** Дата и время последнего обновления долга */
  updatedAt: string;
}

/**
 * DTO для создания нового долга
 *
 * @example
 * ```typescript
 * const createDebtDto: CreateDebtDto = {
 *   userId: 'user1',
 *   title: 'Долг по кредиту',
 *   description: 'Задолженность по кредитному договору №123',
 *   amount: 50000,
 *   currency: 'RUB',
 *   interestRate: 12.5,
 *   startDate: '2023-01-01',
 *   endDate: '2023-12-31',
 *   status: DebtStatus.Active,
 *   remainingAmount: 50000,
 *   nextPaymentDate: '2023-02-01',
 *   nextPaymentAmount: 5000,
 *   creditorName: 'Банк Открытие',
 *   creditorContacts: 'info@open.ru',
 *   documentIds: ['doc1', 'doc2'],
 * };
 * ```
 */
export interface CreateDebtDto {
  /** Идентификатор владельца долга */
  userId: string;
  /** Название долга */
  title: string;
  /** Описание долга */
  description: string;
  /** Общая сумма долга */
  amount: number;
  /** Валюта долга */
  currency: string;
  /** Процентная ставка */
  interestRate: number;
  /** Дата начала долга */
  startDate: string;
  /** Дата окончания долга */
  endDate: string;
  /** Статус долга */
  status: DebtStatus | string;
  /** Оставшаяся сумма долга */
  remainingAmount: number;
  /** Дата следующего платежа */
  nextPaymentDate: string | null;
  /** Сумма следующего платежа */
  nextPaymentAmount: number;
  /** Название кредитора (опционально) */
  creditorName?: string;
  /** Контакты кредитора (опционально) */
  creditorContacts?: string;
  /** Список идентификаторов документов (опционально) */
  documentIds?: string[];
}

/**
 * DTO для обновления существующего долга
 *
 * @example
 * ```typescript
 * const updateDebtDto: UpdateDebtDto = {
 *   status: DebtStatus.Paid,
 *   remainingAmount: 0,
 *   nextPaymentDate: null,
 *   nextPaymentAmount: 0,
 * };
 * ```
 */
export interface UpdateDebtDto {
  /** Название долга */
  title?: string;
  /** Описание долга */
  description?: string;
  /** Общая сумма долга */
  amount?: number;
  /** Валюта долга */
  currency?: string;
  /** Процентная ставка */
  interestRate?: number;
  /** Дата начала долга */
  startDate?: string;
  /** Дата окончания долга */
  endDate?: string;
  /** Статус долга */
  status?: DebtStatus | string;
  /** Оставшаяся сумма долга */
  remainingAmount?: number;
  /** Дата следующего платежа */
  nextPaymentDate?: string | null;
  /** Сумма следующего платежа */
  nextPaymentAmount?: number;
  /** Название кредитора */
  creditorName?: string;
  /** Контакты кредитора */
  creditorContacts?: string;
  /** Список идентификаторов документов */
  documentIds?: string[];
}

/**
 * DTO для ответа с данными долга
 *
 * @example
 * ```typescript
 * const debtResponseDto: DebtResponseDto = {
 *   id: '1',
 *   userId: 'user1',
 *   title: 'Долг по кредиту',
 *   description: 'Задолженность по кредитному договору №123',
 *   amount: 50000,
 *   currency: 'RUB',
 *   interestRate: 12.5,
 *   startDate: '2023-01-01',
 *   endDate: '2023-12-31',
 *   status: DebtStatus.Active,
 *   remainingAmount: 40000,
 *   nextPaymentDate: '2023-02-01',
 *   nextPaymentAmount: 5000,
 *   creditorName: 'Банк Открытие',
 *   creditorContacts: 'info@open.ru',
 *   documentIds: ['doc1', 'doc2'],
 *   createdAt: '2023-01-01T00:00:00Z',
 *   updatedAt: '2023-01-01T00:00:00Z',
 * };
 * ```
 */
export interface DebtResponseDto extends Debt {
  // Добавляем служебное поле для отличия от базового интерфейса
  _responseType?: 'debt';
}

/**
 * JSON-схема для долга
 *
 * Используется для валидации данных и документации API
 */
export const debtSchema = createBaseJsonSchema({
  title: 'Debt',
  description: 'Долг в системе',
  required: [
    'id',
    'userId',
    'title',
    'description',
    'amount',
    'currency',
    'interestRate',
    'startDate',
    'endDate',
    'status',
    'remainingAmount',
    'nextPaymentDate',
    'nextPaymentAmount',
    'createdAt',
    'updatedAt',
  ],
  properties: {
    id: {
      type: 'string',
      description: 'Уникальный идентификатор долга',
      examples: ['1', 'a1b2c3d4'],
    },
    userId: {
      type: 'string',
      description: 'Идентификатор владельца долга',
      examples: ['user1'],
    },
    title: {
      type: 'string',
      description: 'Название долга',
      examples: ['Долг по кредиту'],
    },
    description: {
      type: 'string',
      description: 'Описание долга',
      examples: ['Задолженность по кредитному договору №123'],
    },
    amount: {
      type: 'number',
      description: 'Общая сумма долга',
      examples: [50000],
    },
    currency: {
      type: 'string',
      description: 'Валюта долга',
      examples: ['RUB', 'USD', 'EUR'],
    },
    interestRate: {
      type: 'number',
      description: 'Процентная ставка',
      examples: [12.5, 10.0],
    },
    startDate: {
      type: 'string',
      description: 'Дата начала долга',
      examples: ['2023-01-01'],
    },
    endDate: {
      type: 'string',
      description: 'Дата окончания долга',
      examples: ['2023-12-31'],
    },
    status: {
      type: 'string',
      enum: Object.values(DebtStatus),
      description: 'Статус долга',
      examples: ['active', 'paid', 'overdue'],
    },
    remainingAmount: {
      type: 'number',
      description: 'Оставшаяся сумма долга',
      examples: [40000],
    },
    nextPaymentDate: {
      type: ['string', 'null'],
      description: 'Дата следующего платежа',
      examples: ['2023-02-01', null],
    },
    nextPaymentAmount: {
      type: 'number',
      description: 'Сумма следующего платежа',
      examples: [5000],
    },
    creditorName: {
      type: 'string',
      description: 'Название кредитора',
      examples: ['Банк Открытие'],
    },
    creditorContacts: {
      type: 'string',
      description: 'Контакты кредитора',
      examples: ['info@open.ru'],
    },
    documentIds: {
      type: 'array',
      items: {
        type: 'string',
      },
      description: 'Список идентификаторов документов',
      examples: [['doc1', 'doc2']],
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Дата и время создания долга',
      examples: ['2023-01-01T00:00:00Z'],
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Дата и время последнего обновления долга',
      examples: ['2023-01-01T00:00:00Z'],
    },
  },
});
