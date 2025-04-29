/**
 * Типы и DTO для тендеров
 *
 * Этот модуль содержит все типы, связанные с тендерами в системе,
 * включая статусы тендеров, основной интерфейс тендера и DTO для API.
 */

import { createBaseJsonSchema } from '../utils/json-schema';

/**
 * Статусы тендеров в системе
 *
 * @example
 * ```typescript
 * const tenderStatus = TenderStatus.Open;
 * ```
 */
export enum TenderStatus {
  /** Открытый тендер */
  Open = 'open',
  /** Закрытый тендер */
  Closed = 'closed',
  /** Отмененный тендер */
  Cancelled = 'cancelled',
  /** Черновик тендера */
  Draft = 'draft',
  /** Опубликованный тендер */
  Published = 'published',
}

/**
 * Интерфейс тендера в системе
 *
 * @example
 * ```typescript
 * const tender: Tender = {
 *   id: '1',
 *   title: 'Тендер на поставку оборудования',
 *   description: 'Поставка компьютерного оборудования',
 *   status: TenderStatus.Open,
 *   amount: 100000,
 *   currency: 'RUB',
 *   startDate: '2023-01-01',
 *   endDate: '2023-02-01',
 *   createdAt: '2023-01-01T00:00:00Z',
 *   updatedAt: '2023-01-01T00:00:00Z',
 * };
 * ```
 */
export interface Tender {
  /** Уникальный идентификатор тендера */
  id: string;
  /** Название тендера */
  title: string;
  /** Описание тендера */
  description: string;
  /** Статус тендера */
  status: TenderStatus | string;
  /** Сумма тендера */
  amount: number;
  /** Валюта тендера */
  currency: string;
  /** Дата начала тендера */
  startDate: string;
  /** Дата окончания тендера */
  endDate: string;
  /** Идентификатор категории (опционально) */
  categoryId?: string;
  /** Местоположение (опционально) */
  location?: string;
  /** Идентификатор организатора (опционально) */
  organizerId?: string;
  /** Список идентификаторов участников (опционально) */
  participants?: string[];
  /** Идентификатор победителя (опционально) */
  winnerId?: string;
  /** Список идентификаторов документов (опционально) */
  documents?: string[];
  /** Теги тендера (опционально) */
  tags?: string[];
  /** Дата и время создания тендера */
  createdAt: string;
  /** Дата и время последнего обновления тендера */
  updatedAt: string;
}

/**
 * DTO для создания нового тендера
 *
 * @example
 * ```typescript
 * const createTenderDto: CreateTenderDto = {
 *   title: 'Тендер на поставку оборудования',
 *   description: 'Поставка компьютерного оборудования',
 *   status: TenderStatus.Draft,
 *   amount: 100000,
 *   currency: 'RUB',
 *   startDate: '2023-01-01',
 *   endDate: '2023-02-01',
 * };
 * ```
 */
export interface CreateTenderDto {
  /** Название тендера */
  title: string;
  /** Описание тендера */
  description: string;
  /** Статус тендера */
  status: TenderStatus | string;
  /** Сумма тендера */
  amount: number;
  /** Валюта тендера */
  currency: string;
  /** Дата начала тендера */
  startDate: string;
  /** Дата окончания тендера */
  endDate: string;
  /** Идентификатор категории (опционально) */
  categoryId?: string;
  /** Местоположение (опционально) */
  location?: string;
  /** Идентификатор организатора (опционально) */
  organizerId?: string;
  /** Теги тендера (опционально) */
  tags?: string[];
}

/**
 * DTO для обновления существующего тендера
 *
 * @example
 * ```typescript
 * const updateTenderDto: UpdateTenderDto = {
 *   title: 'Обновленный тендер',
 *   status: TenderStatus.Closed,
 * };
 * ```
 */
export interface UpdateTenderDto {
  /** Название тендера */
  title?: string;
  /** Описание тендера */
  description?: string;
  /** Статус тендера */
  status?: TenderStatus | string;
  /** Сумма тендера */
  amount?: number;
  /** Валюта тендера */
  currency?: string;
  /** Дата начала тендера */
  startDate?: string;
  /** Дата окончания тендера */
  endDate?: string;
  /** Идентификатор категории */
  categoryId?: string;
  /** Местоположение */
  location?: string;
  /** Идентификатор организатора */
  organizerId?: string;
  /** Список идентификаторов участников */
  participants?: string[];
  /** Идентификатор победителя */
  winnerId?: string;
  /** Список идентификаторов документов */
  documents?: string[];
  /** Теги тендера */
  tags?: string[];
}

/**
 * DTO для ответа с данными тендера
 *
 * @example
 * ```typescript
 * const tenderResponseDto: TenderResponseDto = {
 *   id: '1',
 *   title: 'Тендер на поставку оборудования',
 *   description: 'Поставка компьютерного оборудования',
 *   status: TenderStatus.Open,
 *   amount: 100000,
 *   currency: 'RUB',
 *   startDate: '2023-01-01',
 *   endDate: '2023-02-01',
 *   createdAt: '2023-01-01T00:00:00Z',
 *   updatedAt: '2023-01-01T00:00:00Z',
 * };
 * ```
 */
export interface TenderResponseDto extends Tender {
  // Добавляем служебное поле для отличия от базового интерфейса
  _responseType?: 'tender';
}

/**
 * JSON-схема для тендера
 *
 * Используется для валидации данных и документации API
 */
export const tenderSchema = createBaseJsonSchema({
  title: 'Tender',
  description: 'Тендер в системе',
  required: [
    'id',
    'title',
    'description',
    'status',
    'amount',
    'currency',
    'startDate',
    'endDate',
    'createdAt',
    'updatedAt',
  ],
  properties: {
    id: {
      type: 'string',
      description: 'Уникальный идентификатор тендера',
      examples: ['1', 'a1b2c3d4'],
    },
    title: {
      type: 'string',
      description: 'Название тендера',
      examples: ['Тендер на поставку оборудования'],
    },
    description: {
      type: 'string',
      description: 'Описание тендера',
      examples: ['Поставка компьютерного оборудования'],
    },
    status: {
      type: 'string',
      enum: Object.values(TenderStatus),
      description: 'Статус тендера',
      examples: ['open', 'closed', 'draft'],
    },
    amount: {
      type: 'number',
      description: 'Сумма тендера',
      examples: [100000, 500000],
    },
    currency: {
      type: 'string',
      description: 'Валюта тендера',
      examples: ['RUB', 'USD', 'EUR'],
    },
    startDate: {
      type: 'string',
      description: 'Дата начала тендера',
      examples: ['2023-01-01'],
    },
    endDate: {
      type: 'string',
      description: 'Дата окончания тендера',
      examples: ['2023-02-01'],
    },
    categoryId: {
      type: 'string',
      description: 'Идентификатор категории',
      examples: ['category1'],
    },
    location: {
      type: 'string',
      description: 'Местоположение',
      examples: ['Москва'],
    },
    organizerId: {
      type: 'string',
      description: 'Идентификатор организатора',
      examples: ['user1'],
    },
    participants: {
      type: 'array',
      items: {
        type: 'string',
      },
      description: 'Список идентификаторов участников',
      examples: [['user2', 'user3']],
    },
    winnerId: {
      type: 'string',
      description: 'Идентификатор победителя',
      examples: ['user2'],
    },
    documents: {
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
      description: 'Теги тендера',
      examples: [['оборудование', 'компьютеры']],
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Дата и время создания тендера',
      examples: ['2023-01-01T00:00:00Z'],
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Дата и время последнего обновления тендера',
      examples: ['2023-01-01T00:00:00Z'],
    },
  },
});
