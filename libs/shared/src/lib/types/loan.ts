/**
 * Типы и DTO для кредитов
 *
 * Этот модуль содержит все типы, связанные с кредитами в системе,
 * включая статусы кредитов, типы кредитов, основной интерфейс кредита и DTO для API.
 */

import { createBaseJsonSchema } from '../utils/json-schema';

/**
 * Статусы кредитов в системе
 *
 * @example
 * ```typescript
 * const loanStatus = LoanStatus.Active;
 * ```
 */
export enum LoanStatus {
  /** Активный кредит */
  Active = 'active',
  /** Оплаченный кредит */
  Paid = 'paid',
  /** Просроченный кредит */
  Overdue = 'overdue',
  /** Реструктуризированный кредит */
  Restructured = 'restructured',
  /** Одобренный кредит (еще не активный) */
  Approved = 'approved',
  /** Отклоненный кредит */
  Rejected = 'rejected',
  /** Ожидающий рассмотрения */
  Pending = 'pending',
}

/**
 * Типы кредитов в системе
 *
 * @example
 * ```typescript
 * const loanType = LoanType.Mortgage;
 * ```
 */
export enum LoanType {
  /** Ипотечный кредит */
  Mortgage = 'mortgage',
  /** Автокредит */
  Car = 'car',
  /** Потребительский кредит */
  Consumer = 'consumer',
  /** Бизнес-кредит */
  Business = 'business',
  /** Образовательный кредит */
  Education = 'education',
  /** Другой тип кредита */
  Other = 'other',
}

/**
 * Интерфейс платежа по графику
 *
 * @example
 * ```typescript
 * const payment: LoanPayment = {
 *   date: '2023-02-01',
 *   amount: 45000,
 *   principal: 25000,
 *   interest: 20000,
 * };
 * ```
 */
export interface LoanPayment {
  /** Дата платежа */
  date: string;
  /** Общая сумма платежа */
  amount: number;
  /** Сумма основного долга */
  principal: number;
  /** Сумма процентов */
  interest: number;
  /** Статус платежа (опционально) */
  status?: 'paid' | 'pending' | 'overdue';
}

/**
 * Интерфейс кредита в системе
 *
 * @example
 * ```typescript
 * const loan: Loan = {
 *   id: '1',
 *   userId: 'user1',
 *   title: 'Ипотека',
 *   description: 'Ипотечный кредит на квартиру',
 *   type: LoanType.Mortgage,
 *   amount: 5000000,
 *   currency: 'RUB',
 *   interestRate: 9.5,
 *   term: 240,
 *   startDate: '2023-01-01',
 *   endDate: '2043-01-01',
 *   status: LoanStatus.Active,
 *   remainingAmount: 4950000,
 *   nextPaymentDate: '2023-02-01',
 *   nextPaymentAmount: 45000,
 *   paymentSchedule: [
 *     { date: '2023-02-01', amount: 45000, principal: 25000, interest: 20000 },
 *     { date: '2023-03-01', amount: 45000, principal: 25500, interest: 19500 }
 *   ],
 *   lenderName: 'Сбербанк',
 *   lenderContacts: 'info@sberbank.ru',
 *   collateral: 'Квартира по адресу г. Москва, ул. Примерная, д. 1, кв. 1',
 *   documentIds: ['doc1', 'doc2'],
 *   createdAt: '2023-01-01T00:00:00Z',
 *   updatedAt: '2023-01-01T00:00:00Z',
 * };
 * ```
 */
export interface Loan {
  /** Уникальный идентификатор кредита */
  id: string;
  /** Идентификатор владельца кредита */
  userId: string;
  /** Название кредита */
  title: string;
  /** Описание кредита */
  description: string;
  /** Тип кредита */
  type: LoanType | string;
  /** Общая сумма кредита */
  amount: number;
  /** Валюта кредита */
  currency: string;
  /** Процентная ставка */
  interestRate: number;
  /** Срок кредита в месяцах */
  term: number;
  /** Дата начала кредита */
  startDate: string;
  /** Дата окончания кредита */
  endDate: string;
  /** Статус кредита */
  status: LoanStatus | string;
  /** Оставшаяся сумма кредита */
  remainingAmount: number;
  /** Дата следующего платежа */
  nextPaymentDate: string | null;
  /** Сумма следующего платежа */
  nextPaymentAmount: number;
  /** График платежей (опционально) */
  paymentSchedule?: LoanPayment[];
  /** Название кредитора (опционально) */
  lenderName?: string;
  /** Контакты кредитора (опционально) */
  lenderContacts?: string;
  /** Залоговое имущество (опционально) */
  collateral?: string;
  /** Список идентификаторов документов (опционально) */
  documentIds?: string[];
  /** Дата и время создания кредита */
  createdAt: string;
  /** Дата и время последнего обновления кредита */
  updatedAt: string;
}

/**
 * DTO для создания нового кредита
 *
 * @example
 * ```typescript
 * const createLoanDto: CreateLoanDto = {
 *   userId: 'user1',
 *   title: 'Ипотека',
 *   description: 'Ипотечный кредит на квартиру',
 *   type: LoanType.Mortgage,
 *   amount: 5000000,
 *   currency: 'RUB',
 *   interestRate: 9.5,
 *   term: 240,
 *   startDate: '2023-01-01',
 *   endDate: '2043-01-01',
 *   status: LoanStatus.Active,
 *   remainingAmount: 5000000,
 *   nextPaymentDate: '2023-02-01',
 *   nextPaymentAmount: 45000,
 *   paymentSchedule: [
 *     { date: '2023-02-01', amount: 45000, principal: 25000, interest: 20000 },
 *     { date: '2023-03-01', amount: 45000, principal: 25500, interest: 19500 }
 *   ],
 *   lenderName: 'Сбербанк',
 *   lenderContacts: 'info@sberbank.ru',
 *   collateral: 'Квартира по адресу г. Москва, ул. Примерная, д. 1, кв. 1',
 *   documentIds: ['doc1', 'doc2'],
 * };
 * ```
 */
export interface CreateLoanDto {
  /** Идентификатор владельца кредита */
  userId: string;
  /** Название кредита */
  title: string;
  /** Описание кредита */
  description: string;
  /** Тип кредита */
  type: LoanType | string;
  /** Общая сумма кредита */
  amount: number;
  /** Валюта кредита */
  currency: string;
  /** Процентная ставка */
  interestRate: number;
  /** Срок кредита в месяцах */
  term: number;
  /** Дата начала кредита */
  startDate: string;
  /** Дата окончания кредита */
  endDate: string;
  /** Статус кредита */
  status: LoanStatus | string;
  /** Оставшаяся сумма кредита */
  remainingAmount: number;
  /** Дата следующего платежа */
  nextPaymentDate: string | null;
  /** Сумма следующего платежа */
  nextPaymentAmount: number;
  /** График платежей (опционально) */
  paymentSchedule?: LoanPayment[];
  /** Название кредитора (опционально) */
  lenderName?: string;
  /** Контакты кредитора (опционально) */
  lenderContacts?: string;
  /** Залоговое имущество (опционально) */
  collateral?: string;
  /** Список идентификаторов документов (опционально) */
  documentIds?: string[];
}

/**
 * DTO для обновления существующего кредита
 *
 * @example
 * ```typescript
 * const updateLoanDto: UpdateLoanDto = {
 *   status: LoanStatus.Paid,
 *   remainingAmount: 0,
 *   nextPaymentDate: null,
 *   nextPaymentAmount: 0,
 * };
 * ```
 */
export interface UpdateLoanDto {
  /** Название кредита */
  title?: string;
  /** Описание кредита */
  description?: string;
  /** Тип кредита */
  type?: LoanType | string;
  /** Общая сумма кредита */
  amount?: number;
  /** Валюта кредита */
  currency?: string;
  /** Процентная ставка */
  interestRate?: number;
  /** Срок кредита в месяцах */
  term?: number;
  /** Дата начала кредита */
  startDate?: string;
  /** Дата окончания кредита */
  endDate?: string;
  /** Статус кредита */
  status?: LoanStatus | string;
  /** Оставшаяся сумма кредита */
  remainingAmount?: number;
  /** Дата следующего платежа */
  nextPaymentDate?: string | null;
  /** Сумма следующего платежа */
  nextPaymentAmount?: number;
  /** График платежей */
  paymentSchedule?: LoanPayment[];
  /** Название кредитора */
  lenderName?: string;
  /** Контакты кредитора */
  lenderContacts?: string;
  /** Залоговое имущество */
  collateral?: string;
  /** Список идентификаторов документов */
  documentIds?: string[];
}

/**
 * DTO для ответа с данными кредита
 *
 * Расширяет интерфейс Loan без добавления новых полей.
 * Используется для типизации ответов API.
 *
 * @example
 * ```typescript
 * const loanResponseDto: LoanResponseDto = {
 *   id: '1',
 *   userId: 'user1',
 *   title: 'Ипотека',
 *   description: 'Ипотечный кредит на квартиру',
 *   type: LoanType.Mortgage,
 *   amount: 5000000,
 *   currency: 'RUB',
 *   interestRate: 9.5,
 *   term: 240,
 *   startDate: '2023-01-01',
 *   endDate: '2043-01-01',
 *   status: LoanStatus.Active,
 *   remainingAmount: 4950000,
 *   nextPaymentDate: '2023-02-01',
 *   nextPaymentAmount: 45000,
 *   paymentSchedule: [
 *     { date: '2023-02-01', amount: 45000, principal: 25000, interest: 20000 },
 *     { date: '2023-03-01', amount: 45000, principal: 25500, interest: 19500 }
 *   ],
 *   lenderName: 'Сбербанк',
 *   lenderContacts: 'info@sberbank.ru',
 *   collateral: 'Квартира по адресу г. Москва, ул. Примерная, д. 1, кв. 1',
 *   documentIds: ['doc1', 'doc2'],
 *   createdAt: '2023-01-01T00:00:00Z',
 *   updatedAt: '2023-01-01T00:00:00Z',
 * };
 * ```
 */
export interface LoanResponseDto extends Loan {
  // Интерфейс наследует все поля от Loan без изменений
  // Используется для семантического разделения DTO в API
  _responseType?: 'loan';
}

/**
 * JSON-схема для кредита
 *
 * Используется для валидации данных и документации API
 */
export const loanSchema = createBaseJsonSchema({
  title: 'Loan',
  description: 'Кредит в системе',
  required: [
    'id',
    'userId',
    'title',
    'description',
    'type',
    'amount',
    'currency',
    'interestRate',
    'term',
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
      description: 'Уникальный идентификатор кредита',
      examples: ['1', 'a1b2c3d4'],
    },
    userId: {
      type: 'string',
      description: 'Идентификатор владельца кредита',
      examples: ['user1'],
    },
    title: {
      type: 'string',
      description: 'Название кредита',
      examples: ['Ипотека'],
    },
    description: {
      type: 'string',
      description: 'Описание кредита',
      examples: ['Ипотечный кредит на квартиру'],
    },
    type: {
      type: 'string',
      enum: Object.values(LoanType),
      description: 'Тип кредита',
      examples: ['mortgage', 'car', 'consumer'],
    },
    amount: {
      type: 'number',
      description: 'Общая сумма кредита',
      examples: [5000000],
    },
    currency: {
      type: 'string',
      description: 'Валюта кредита',
      examples: ['RUB', 'USD', 'EUR'],
    },
    interestRate: {
      type: 'number',
      description: 'Процентная ставка',
      examples: [9.5, 12.0],
    },
    term: {
      type: 'number',
      description: 'Срок кредита в месяцах',
      examples: [240, 60, 36],
    },
    startDate: {
      type: 'string',
      description: 'Дата начала кредита',
      examples: ['2023-01-01'],
    },
    endDate: {
      type: 'string',
      description: 'Дата окончания кредита',
      examples: ['2043-01-01'],
    },
    status: {
      type: 'string',
      enum: Object.values(LoanStatus),
      description: 'Статус кредита',
      examples: ['active', 'paid', 'overdue'],
    },
    remainingAmount: {
      type: 'number',
      description: 'Оставшаяся сумма кредита',
      examples: [4950000],
    },
    nextPaymentDate: {
      type: ['string', 'null'],
      description: 'Дата следующего платежа',
      examples: ['2023-02-01', null],
    },
    nextPaymentAmount: {
      type: 'number',
      description: 'Сумма следующего платежа',
      examples: [45000],
    },
    paymentSchedule: {
      type: 'array',
      items: {
        type: 'object',
        required: ['date', 'amount', 'principal', 'interest'],
        properties: {
          date: {
            type: 'string',
            description: 'Дата платежа',
            examples: ['2023-02-01'],
          },
          amount: {
            type: 'number',
            description: 'Общая сумма платежа',
            examples: [45000],
          },
          principal: {
            type: 'number',
            description: 'Сумма основного долга',
            examples: [25000],
          },
          interest: {
            type: 'number',
            description: 'Сумма процентов',
            examples: [20000],
          },
          status: {
            type: 'string',
            enum: ['paid', 'pending', 'overdue'],
            description: 'Статус платежа',
            examples: ['paid', 'pending', 'overdue'],
          },
        },
      },
      description: 'График платежей',
    },
    lenderName: {
      type: 'string',
      description: 'Название кредитора',
      examples: ['Сбербанк'],
    },
    lenderContacts: {
      type: 'string',
      description: 'Контакты кредитора',
      examples: ['info@sberbank.ru'],
    },
    collateral: {
      type: 'string',
      description: 'Залоговое имущество',
      examples: ['Квартира по адресу г. Москва, ул. Примерная, д. 1, кв. 1'],
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
      description: 'Дата и время создания кредита',
      examples: ['2023-01-01T00:00:00Z'],
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Дата и время последнего обновления кредита',
      examples: ['2023-01-01T00:00:00Z'],
    },
  },
});
