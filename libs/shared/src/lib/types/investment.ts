/**
 * Типы и DTO для инвестиций
 *
 * Этот модуль содержит все типы, связанные с инвестициями в системе,
 * включая типы инвестиций, статусы, основной интерфейс инвестиции и DTO для API.
 */

import { createBaseJsonSchema } from '../utils/json-schema';

/**
 * Типы инвестиций в системе
 *
 * @example
 * ```typescript
 * const investmentType = InvestmentType.Stock;
 * ```
 */
export enum InvestmentType {
  /** Акции */
  Stock = 'stock',
  /** Облигации */
  Bond = 'bond',
  /** Биржевой фонд (ETF) */
  ETF = 'etf',
  /** Паевой инвестиционный фонд */
  MutualFund = 'mutual_fund',
  /** Недвижимость */
  RealEstate = 'real_estate',
  /** Депозит */
  Deposit = 'deposit',
  /** Криптовалюта */
  Cryptocurrency = 'cryptocurrency',
  /** Другой тип инвестиции */
  Other = 'other',
}

/**
 * Статусы инвестиций в системе
 *
 * @example
 * ```typescript
 * const investmentStatus = InvestmentStatus.Active;
 * ```
 */
export enum InvestmentStatus {
  /** Активная инвестиция */
  Active = 'active',
  /** Проданная инвестиция */
  Sold = 'sold',
  /** Ожидающая инвестиция */
  Pending = 'pending',
  /** Замороженная инвестиция */
  Frozen = 'frozen',
  /** Закрытая инвестиция */
  Closed = 'closed',
}

/**
 * Интерфейс инвестиции в системе
 *
 * @example
 * ```typescript
 * const investment: Investment = {
 *   id: '1',
 *   userId: 'user1',
 *   title: 'Акции Сбербанк',
 *   description: 'Инвестиции в акции Сбербанка',
 *   type: InvestmentType.Stock,
 *   status: InvestmentStatus.Active,
 *   amount: 100000,
 *   currency: 'RUB',
 *   purchaseDate: '2023-01-01',
 *   purchasePrice: 250.5,
 *   currentPrice: 270.8,
 *   quantity: 400,
 *   ticker: 'SBER',
 *   exchange: 'MOEX',
 *   profit: 8120,
 *   profitPercentage: 8.12,
 *   dividends: 2000,
 *   fees: 500,
 *   taxes: 1000,
 *   maturityDate: '2025-01-01',
 *   interestRate: 7.5,
 *   accountId: 'account1',
 *   documentIds: ['doc1', 'doc2'],
 *   tags: ['акции', 'банк', 'голубые фишки'],
 *   createdAt: '2023-01-01T00:00:00Z',
 *   updatedAt: '2023-01-01T00:00:00Z',
 * };
 * ```
 */
export interface Investment {
  /** Уникальный идентификатор инвестиции */
  id: string;
  /** Идентификатор владельца инвестиции */
  userId: string;
  /** Название инвестиции */
  title: string;
  /** Описание инвестиции */
  description: string;
  /** Тип инвестиции */
  type: InvestmentType | string;
  /** Статус инвестиции */
  status: InvestmentStatus | string;
  /** Сумма инвестиции */
  amount: number;
  /** Валюта инвестиции */
  currency: string;
  /** Дата покупки */
  purchaseDate: string;
  /** Цена покупки (опционально) */
  purchasePrice?: number;
  /** Текущая цена */
  currentPrice: number;
  /** Количество (опционально) */
  quantity?: number;
  /** Тикер (опционально) */
  ticker?: string;
  /** Биржа (опционально) */
  exchange?: string;
  /** Прибыль (опционально) */
  profit?: number;
  /** Процент прибыли (опционально) */
  profitPercentage?: number;
  /** Дивиденды (опционально) */
  dividends?: number;
  /** Комиссии (опционально) */
  fees?: number;
  /** Налоги (опционально) */
  taxes?: number;
  /** Дата погашения (опционально) */
  maturityDate?: string;
  /** Процентная ставка (опционально) */
  interestRate?: number;
  /** Идентификатор связанного счета (опционально) */
  accountId?: string;
  /** Список идентификаторов документов (опционально) */
  documentIds?: string[];
  /** Теги инвестиции (опционально) */
  tags?: string[];
  /** Дата и время создания инвестиции */
  createdAt: string;
  /** Дата и время последнего обновления инвестиции */
  updatedAt: string;
}

/**
 * DTO для создания новой инвестиции
 *
 * @example
 * ```typescript
 * const createInvestmentDto: CreateInvestmentDto = {
 *   userId: 'user1',
 *   title: 'Акции Сбербанк',
 *   description: 'Инвестиции в акции Сбербанка',
 *   type: InvestmentType.Stock,
 *   status: InvestmentStatus.Active,
 *   amount: 100000,
 *   currency: 'RUB',
 *   purchaseDate: '2023-01-01',
 *   purchasePrice: 250.5,
 *   currentPrice: 270.8,
 *   quantity: 400,
 *   ticker: 'SBER',
 *   exchange: 'MOEX',
 *   profit: 8120,
 *   profitPercentage: 8.12,
 *   dividends: 2000,
 *   fees: 500,
 *   taxes: 1000,
 *   maturityDate: '2025-01-01',
 *   interestRate: 7.5,
 *   accountId: 'account1',
 *   documentIds: ['doc1', 'doc2'],
 *   tags: ['акции', 'банк', 'голубые фишки'],
 * };
 * ```
 */
export interface CreateInvestmentDto {
  /** Идентификатор владельца инвестиции */
  userId: string;
  /** Название инвестиции */
  title: string;
  /** Описание инвестиции */
  description: string;
  /** Тип инвестиции */
  type: InvestmentType | string;
  /** Статус инвестиции */
  status: InvestmentStatus | string;
  /** Сумма инвестиции */
  amount: number;
  /** Валюта инвестиции */
  currency: string;
  /** Дата покупки */
  purchaseDate: string;
  /** Цена покупки (опционально) */
  purchasePrice?: number;
  /** Текущая цена */
  currentPrice: number;
  /** Количество (опционально) */
  quantity?: number;
  /** Тикер (опционально) */
  ticker?: string;
  /** Биржа (опционально) */
  exchange?: string;
  /** Прибыль (опционально) */
  profit?: number;
  /** Процент прибыли (опционально) */
  profitPercentage?: number;
  /** Дивиденды (опционально) */
  dividends?: number;
  /** Комиссии (опционально) */
  fees?: number;
  /** Налоги (опционально) */
  taxes?: number;
  /** Дата погашения (опционально) */
  maturityDate?: string;
  /** Процентная ставка (опционально) */
  interestRate?: number;
  /** Идентификатор связанного счета (опционально) */
  accountId?: string;
  /** Список идентификаторов документов (опционально) */
  documentIds?: string[];
  /** Теги инвестиции (опционально) */
  tags?: string[];
}

/**
 * DTO для обновления существующей инвестиции
 *
 * @example
 * ```typescript
 * const updateInvestmentDto: UpdateInvestmentDto = {
 *   status: InvestmentStatus.Sold,
 *   currentPrice: 280.5,
 *   profit: 12000,
 *   profitPercentage: 12.0,
 * };
 * ```
 */
export interface UpdateInvestmentDto {
  /** Название инвестиции */
  title?: string;
  /** Описание инвестиции */
  description?: string;
  /** Тип инвестиции */
  type?: InvestmentType | string;
  /** Статус инвестиции */
  status?: InvestmentStatus | string;
  /** Сумма инвестиции */
  amount?: number;
  /** Валюта инвестиции */
  currency?: string;
  /** Дата покупки */
  purchaseDate?: string;
  /** Цена покупки */
  purchasePrice?: number;
  /** Текущая цена */
  currentPrice?: number;
  /** Количество */
  quantity?: number;
  /** Тикер */
  ticker?: string;
  /** Биржа */
  exchange?: string;
  /** Прибыль */
  profit?: number;
  /** Процент прибыли */
  profitPercentage?: number;
  /** Дивиденды */
  dividends?: number;
  /** Комиссии */
  fees?: number;
  /** Налоги */
  taxes?: number;
  /** Дата погашения */
  maturityDate?: string;
  /** Процентная ставка */
  interestRate?: number;
  /** Идентификатор связанного счета */
  accountId?: string;
  /** Список идентификаторов документов */
  documentIds?: string[];
  /** Теги инвестиции */
  tags?: string[];
}

/**
 * DTO для ответа с данными инвестиции
 *
 * @example
 * ```typescript
 * const investmentResponseDto: InvestmentResponseDto = {
 *   id: '1',
 *   userId: 'user1',
 *   title: 'Акции Сбербанк',
 *   description: 'Инвестиции в акции Сбербанка',
 *   type: InvestmentType.Stock,
 *   status: InvestmentStatus.Active,
 *   amount: 100000,
 *   currency: 'RUB',
 *   purchaseDate: '2023-01-01',
 *   purchasePrice: 250.5,
 *   currentPrice: 270.8,
 *   quantity: 400,
 *   ticker: 'SBER',
 *   exchange: 'MOEX',
 *   profit: 8120,
 *   profitPercentage: 8.12,
 *   dividends: 2000,
 *   fees: 500,
 *   taxes: 1000,
 *   maturityDate: '2025-01-01',
 *   interestRate: 7.5,
 *   accountId: 'account1',
 *   documentIds: ['doc1', 'doc2'],
 *   tags: ['акции', 'банк', 'голубые фишки'],
 *   createdAt: '2023-01-01T00:00:00Z',
 *   updatedAt: '2023-01-01T00:00:00Z',
 * };
 * ```
 */
export interface InvestmentResponseDto extends Investment {
  // Добавляем служебное поле для отличия от базового интерфейса
  _responseType?: 'investment';
}

/**
 * JSON-схема для инвестиции
 *
 * Используется для валидации данных и документации API
 */
export const investmentSchema = createBaseJsonSchema({
  title: 'Investment',
  description: 'Инвестиция в системе',
  required: [
    'id',
    'userId',
    'title',
    'description',
    'type',
    'status',
    'amount',
    'currency',
    'purchaseDate',
    'currentPrice',
    'createdAt',
    'updatedAt',
  ],
  properties: {
    id: {
      type: 'string',
      description: 'Уникальный идентификатор инвестиции',
      examples: ['1', 'a1b2c3d4'],
    },
    userId: {
      type: 'string',
      description: 'Идентификатор владельца инвестиции',
      examples: ['user1'],
    },
    title: {
      type: 'string',
      description: 'Название инвестиции',
      examples: ['Акции Сбербанк'],
    },
    description: {
      type: 'string',
      description: 'Описание инвестиции',
      examples: ['Инвестиции в акции Сбербанка'],
    },
    type: {
      type: 'string',
      enum: Object.values(InvestmentType),
      description: 'Тип инвестиции',
      examples: ['stock', 'bond', 'etf'],
    },
    status: {
      type: 'string',
      enum: Object.values(InvestmentStatus),
      description: 'Статус инвестиции',
      examples: ['active', 'sold', 'pending'],
    },
    amount: {
      type: 'number',
      description: 'Сумма инвестиции',
      examples: [100000],
    },
    currency: {
      type: 'string',
      description: 'Валюта инвестиции',
      examples: ['RUB', 'USD', 'EUR'],
    },
    purchaseDate: {
      type: 'string',
      description: 'Дата покупки',
      examples: ['2023-01-01'],
    },
    purchasePrice: {
      type: 'number',
      description: 'Цена покупки',
      examples: [250.5],
    },
    currentPrice: {
      type: 'number',
      description: 'Текущая цена',
      examples: [270.8],
    },
    quantity: {
      type: 'number',
      description: 'Количество',
      examples: [400],
    },
    ticker: {
      type: 'string',
      description: 'Тикер',
      examples: ['SBER', 'AAPL', 'MSFT'],
    },
    exchange: {
      type: 'string',
      description: 'Биржа',
      examples: ['MOEX', 'NYSE', 'NASDAQ'],
    },
    profit: {
      type: 'number',
      description: 'Прибыль',
      examples: [8120],
    },
    profitPercentage: {
      type: 'number',
      description: 'Процент прибыли',
      examples: [8.12],
    },
    dividends: {
      type: 'number',
      description: 'Дивиденды',
      examples: [2000],
    },
    fees: {
      type: 'number',
      description: 'Комиссии',
      examples: [500],
    },
    taxes: {
      type: 'number',
      description: 'Налоги',
      examples: [1000],
    },
    maturityDate: {
      type: 'string',
      description: 'Дата погашения',
      examples: ['2025-01-01'],
    },
    interestRate: {
      type: 'number',
      description: 'Процентная ставка',
      examples: [7.5],
    },
    accountId: {
      type: 'string',
      description: 'Идентификатор связанного счета',
      examples: ['account1'],
    },
    documentIds: {
      type: 'array',
      items: {
        type: 'string',
      },
      description: 'Список идентификаторов документов',
      examples: [['doc1', 'doc2']],
    },
    tags: {
      type: 'array',
      items: {
        type: 'string',
      },
      description: 'Теги инвестиции',
      examples: [['акции', 'банк', 'голубые фишки']],
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Дата и время создания инвестиции',
      examples: ['2023-01-01T00:00:00Z'],
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Дата и время последнего обновления инвестиции',
      examples: ['2023-01-01T00:00:00Z'],
    },
  },
});
