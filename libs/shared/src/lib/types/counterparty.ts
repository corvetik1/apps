/**
 * Типы и DTO для контрагентов
 *
 * Этот модуль содержит все типы, связанные с контрагентами в системе,
 * включая типы контрагентов, статусы, основной интерфейс контрагента и DTO для API.
 */

import { createBaseJsonSchema } from '../utils/json-schema';

/**
 * Типы контрагентов в системе
 *
 * @example
 * ```typescript
 * const counterpartyType = CounterpartyType.Company;
 * ```
 */
export enum CounterpartyType {
  /** Физическое лицо */
  Individual = 'individual',
  /** Компания */
  Company = 'company',
  /** Государственное учреждение */
  Government = 'government',
  /** Банк */
  Bank = 'bank',
  /** Другой тип */
  Other = 'other',
}

/**
 * Статусы контрагентов в системе
 *
 * @example
 * ```typescript
 * const counterpartyStatus = CounterpartyStatus.Active;
 * ```
 */
export enum CounterpartyStatus {
  /** Активный контрагент */
  Active = 'active',
  /** Неактивный контрагент */
  Inactive = 'inactive',
  /** Заблокированный контрагент */
  Blocked = 'blocked',
}

/**
 * Интерфейс банковских реквизитов
 *
 * @example
 * ```typescript
 * const bankDetails: BankDetails = {
 *   accountNumber: '40702810100000000123',
 *   bik: '044525225',
 *   bankName: 'Сбербанк',
 *   correspondentAccount: '30101810400000000225'
 * };
 * ```
 */
export interface BankDetails {
  /** Номер счета */
  accountNumber: string;
  /** БИК банка */
  bik: string;
  /** Название банка */
  bankName: string;
  /** Корреспондентский счет */
  correspondentAccount: string;
  /** Валюта счета (опционально) */
  currency?: string;
  /** Дополнительная информация (опционально) */
  additionalInfo?: string;
}

/**
 * Интерфейс контрагента в системе
 *
 * @example
 * ```typescript
 * const counterparty: Counterparty = {
 *   id: '1',
 *   userId: 'user1',
 *   name: 'ООО "Рога и Копыта"',
 *   type: CounterpartyType.Company,
 *   status: CounterpartyStatus.Active,
 *   inn: '7707083893',
 *   kpp: '770701001',
 *   ogrn: '1027700132195',
 *   address: 'г. Москва, ул. Примерная, д. 1',
 *   contactPerson: 'Иванов Иван Иванович',
 *   phone: '+7 (999) 123-45-67',
 *   email: 'info@example.com',
 *   website: 'https://example.com',
 *   bankDetails: {
 *     accountNumber: '40702810100000000123',
 *     bik: '044525225',
 *     bankName: 'Сбербанк',
 *     correspondentAccount: '30101810400000000225'
 *   },
 *   description: 'Поставщик канцелярских товаров',
 *   category: 'supplier',
 *   tags: ['поставщик', 'канцтовары'],
 *   documentIds: ['doc1', 'doc2'],
 *   createdAt: '2023-01-01T00:00:00Z',
 *   updatedAt: '2023-01-01T00:00:00Z',
 * };
 * ```
 */
export interface Counterparty {
  /** Уникальный идентификатор контрагента */
  id: string;
  /** Идентификатор владельца контрагента */
  userId: string;
  /** Название контрагента */
  name: string;
  /** Тип контрагента */
  type: CounterpartyType | string;
  /** Статус контрагента */
  status: CounterpartyStatus | string;
  /** ИНН (опционально) */
  inn?: string;
  /** КПП (опционально) */
  kpp?: string;
  /** ОГРН (опционально) */
  ogrn?: string;
  /** Адрес (опционально) */
  address?: string;
  /** Контактное лицо (опционально) */
  contactPerson?: string;
  /** Телефон (опционально) */
  phone?: string;
  /** Email (опционально) */
  email?: string;
  /** Веб-сайт (опционально) */
  website?: string;
  /** Банковские реквизиты (опционально) */
  bankDetails?: BankDetails;
  /** Описание (опционально) */
  description?: string;
  /** Категория (опционально) */
  category?: string;
  /** Теги (опционально) */
  tags?: string[];
  /** Список идентификаторов документов (опционально) */
  documentIds?: string[];
  /** Дата и время создания контрагента */
  createdAt: string;
  /** Дата и время последнего обновления контрагента */
  updatedAt: string;
}

/**
 * DTO для создания нового контрагента
 *
 * @example
 * ```typescript
 * const createCounterpartyDto: CreateCounterpartyDto = {
 *   userId: 'user1',
 *   name: 'ООО "Рога и Копыта"',
 *   type: CounterpartyType.Company,
 *   status: CounterpartyStatus.Active,
 *   inn: '7707083893',
 *   kpp: '770701001',
 *   ogrn: '1027700132195',
 *   address: 'г. Москва, ул. Примерная, д. 1',
 *   contactPerson: 'Иванов Иван Иванович',
 *   phone: '+7 (999) 123-45-67',
 *   email: 'info@example.com',
 *   website: 'https://example.com',
 *   bankDetails: {
 *     accountNumber: '40702810100000000123',
 *     bik: '044525225',
 *     bankName: 'Сбербанк',
 *     correspondentAccount: '30101810400000000225'
 *   },
 *   description: 'Поставщик канцелярских товаров',
 *   category: 'supplier',
 *   tags: ['поставщик', 'канцтовары'],
 *   documentIds: ['doc1', 'doc2'],
 * };
 * ```
 */
export interface CreateCounterpartyDto {
  /** Идентификатор владельца контрагента */
  userId: string;
  /** Название контрагента */
  name: string;
  /** Тип контрагента */
  type: CounterpartyType | string;
  /** Статус контрагента */
  status: CounterpartyStatus | string;
  /** ИНН (опционально) */
  inn?: string;
  /** КПП (опционально) */
  kpp?: string;
  /** ОГРН (опционально) */
  ogrn?: string;
  /** Адрес (опционально) */
  address?: string;
  /** Контактное лицо (опционально) */
  contactPerson?: string;
  /** Телефон (опционально) */
  phone?: string;
  /** Email (опционально) */
  email?: string;
  /** Веб-сайт (опционально) */
  website?: string;
  /** Банковские реквизиты (опционально) */
  bankDetails?: BankDetails;
  /** Описание (опционально) */
  description?: string;
  /** Категория (опционально) */
  category?: string;
  /** Теги (опционально) */
  tags?: string[];
  /** Список идентификаторов документов (опционально) */
  documentIds?: string[];
}

/**
 * DTO для обновления существующего контрагента
 *
 * @example
 * ```typescript
 * const updateCounterpartyDto: UpdateCounterpartyDto = {
 *   status: CounterpartyStatus.Inactive,
 *   phone: '+7 (999) 987-65-43',
 *   email: 'new@example.com',
 *   contactPerson: 'Петров Петр Петрович',
 * };
 * ```
 */
export interface UpdateCounterpartyDto {
  /** Название контрагента */
  name?: string;
  /** Тип контрагента */
  type?: CounterpartyType | string;
  /** Статус контрагента */
  status?: CounterpartyStatus | string;
  /** ИНН */
  inn?: string;
  /** КПП */
  kpp?: string;
  /** ОГРН */
  ogrn?: string;
  /** Адрес */
  address?: string;
  /** Контактное лицо */
  contactPerson?: string;
  /** Телефон */
  phone?: string;
  /** Email */
  email?: string;
  /** Веб-сайт */
  website?: string;
  /** Банковские реквизиты */
  bankDetails?: BankDetails;
  /** Описание */
  description?: string;
  /** Категория */
  category?: string;
  /** Теги */
  tags?: string[];
  /** Список идентификаторов документов */
  documentIds?: string[];
}

/**
 * DTO для ответа с данными контрагента
 *
 * @example
 * ```typescript
 * const counterpartyResponseDto: CounterpartyResponseDto = {
 *   id: '1',
 *   userId: 'user1',
 *   name: 'ООО "Рога и Копыта"',
 *   type: CounterpartyType.Company,
 *   status: CounterpartyStatus.Active,
 *   inn: '7707083893',
 *   kpp: '770701001',
 *   ogrn: '1027700132195',
 *   address: 'г. Москва, ул. Примерная, д. 1',
 *   contactPerson: 'Иванов Иван Иванович',
 *   phone: '+7 (999) 123-45-67',
 *   email: 'info@example.com',
 *   website: 'https://example.com',
 *   bankDetails: {
 *     accountNumber: '40702810100000000123',
 *     bik: '044525225',
 *     bankName: 'Сбербанк',
 *     correspondentAccount: '30101810400000000225'
 *   },
 *   description: 'Поставщик канцелярских товаров',
 *   category: 'supplier',
 *   tags: ['поставщик', 'канцтовары'],
 *   documentIds: ['doc1', 'doc2'],
 *   createdAt: '2023-01-01T00:00:00Z',
 *   updatedAt: '2023-01-01T00:00:00Z',
 * };
 * ```
 */
export interface CounterpartyResponseDto extends Counterparty {
  // Добавляем служебное поле для отличия от базового интерфейса
  _responseType?: 'counterparty';
}

/**
 * JSON-схема для контрагента
 *
 * Используется для валидации данных и документации API
 */
export const counterpartySchema = createBaseJsonSchema({
  title: 'Counterparty',
  description: 'Контрагент в системе',
  required: ['id', 'userId', 'name', 'type', 'status', 'createdAt', 'updatedAt'],
  properties: {
    id: {
      type: 'string',
      description: 'Уникальный идентификатор контрагента',
      examples: ['1', 'a1b2c3d4'],
    },
    userId: {
      type: 'string',
      description: 'Идентификатор владельца контрагента',
      examples: ['user1'],
    },
    name: {
      type: 'string',
      description: 'Название контрагента',
      examples: ['ООО "Рога и Копыта"'],
    },
    type: {
      type: 'string',
      enum: Object.values(CounterpartyType),
      description: 'Тип контрагента',
      examples: ['individual', 'company', 'government'],
    },
    status: {
      type: 'string',
      enum: Object.values(CounterpartyStatus),
      description: 'Статус контрагента',
      examples: ['active', 'inactive', 'blocked'],
    },
    inn: {
      type: 'string',
      description: 'ИНН',
      examples: ['7707083893'],
    },
    kpp: {
      type: 'string',
      description: 'КПП',
      examples: ['770701001'],
    },
    ogrn: {
      type: 'string',
      description: 'ОГРН',
      examples: ['1027700132195'],
    },
    address: {
      type: 'string',
      description: 'Адрес',
      examples: ['г. Москва, ул. Примерная, д. 1'],
    },
    contactPerson: {
      type: 'string',
      description: 'Контактное лицо',
      examples: ['Иванов Иван Иванович'],
    },
    phone: {
      type: 'string',
      description: 'Телефон',
      examples: ['+7 (999) 123-45-67'],
    },
    email: {
      type: 'string',
      description: 'Email',
      examples: ['info@example.com'],
    },
    website: {
      type: 'string',
      description: 'Веб-сайт',
      examples: ['https://example.com'],
    },
    bankDetails: {
      type: 'object',
      required: ['accountNumber', 'bik', 'bankName', 'correspondentAccount'],
      properties: {
        accountNumber: {
          type: 'string',
          description: 'Номер счета',
          examples: ['40702810100000000123'],
        },
        bik: {
          type: 'string',
          description: 'БИК банка',
          examples: ['044525225'],
        },
        bankName: {
          type: 'string',
          description: 'Название банка',
          examples: ['Сбербанк'],
        },
        correspondentAccount: {
          type: 'string',
          description: 'Корреспондентский счет',
          examples: ['30101810400000000225'],
        },
        currency: {
          type: 'string',
          description: 'Валюта счета',
          examples: ['RUB', 'USD', 'EUR'],
        },
        additionalInfo: {
          type: 'string',
          description: 'Дополнительная информация',
          examples: ['Для платежей по договору №123'],
        },
      },
      description: 'Банковские реквизиты',
    },
    description: {
      type: 'string',
      description: 'Описание',
      examples: ['Поставщик канцелярских товаров'],
    },
    category: {
      type: 'string',
      description: 'Категория',
      examples: ['supplier', 'client', 'partner'],
    },
    tags: {
      type: 'array',
      items: {
        type: 'string',
      },
      description: 'Теги',
      examples: [['поставщик', 'канцтовары']],
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
      description: 'Дата и время создания контрагента',
      examples: ['2023-01-01T00:00:00Z'],
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Дата и время последнего обновления контрагента',
      examples: ['2023-01-01T00:00:00Z'],
    },
  },
});
