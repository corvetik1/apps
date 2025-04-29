/**
 * Типы и DTO для документов
 *
 * Этот модуль содержит все типы, связанные с документами в системе,
 * включая типы документов, статусы, основной интерфейс документа и DTO для API.
 */

import { createBaseJsonSchema } from '../utils/json-schema';

/**
 * Типы документов в системе
 *
 * @example
 * ```typescript
 * const documentType = DocumentType.Contract;
 * ```
 */
export enum DocumentType {
  /** Договор */
  Contract = 'contract',
  /** Счет */
  Invoice = 'invoice',
  /** Квитанция */
  Receipt = 'receipt',
  /** Отчет */
  Report = 'report',
  /** Сертификат */
  Certificate = 'certificate',
  /** Удостоверение личности */
  ID = 'id',
  /** Другой тип документа */
  Other = 'other',
}

/**
 * Статусы документов в системе
 *
 * @example
 * ```typescript
 * const documentStatus = DocumentStatus.Active;
 * ```
 */
export enum DocumentStatus {
  /** Активный документ */
  Active = 'active',
  /** Архивированный документ */
  Archived = 'archived',
  /** Ожидающий документ */
  Pending = 'pending',
  /** Отклоненный документ */
  Rejected = 'rejected',
  /** Просроченный документ */
  Expired = 'expired',
}

/**
 * Интерфейс документа в системе
 *
 * @example
 * ```typescript
 * const document: Document = {
 *   id: '1',
 *   userId: 'user1',
 *   title: 'Договор кредита',
 *   description: 'Кредитный договор №123-456',
 *   type: DocumentType.Contract,
 *   status: DocumentStatus.Active,
 *   fileUrl: 'https://example.com/files/contract.pdf',
 *   fileSize: 1024000,
 *   fileType: 'application/pdf',
 *   fileName: 'contract.pdf',
 *   tags: ['кредит', 'договор', 'банк'],
 *   entityId: 'loan1',
 *   entityType: 'loan',
 *   validFrom: '2023-01-01',
 *   validUntil: '2025-01-01',
 *   issuedBy: 'Сбербанк',
 *   issuedTo: 'Иванов Иван Иванович',
 *   createdAt: '2023-01-01T00:00:00Z',
 *   updatedAt: '2023-01-01T00:00:00Z',
 * };
 * ```
 */
export interface Document {
  /** Уникальный идентификатор документа */
  id: string;
  /** Идентификатор владельца документа */
  userId: string;
  /** Название документа */
  title: string;
  /** Описание документа */
  description: string;
  /** Тип документа */
  type: DocumentType | string;
  /** Статус документа */
  status: DocumentStatus | string;
  /** URL файла документа */
  fileUrl: string;
  /** Размер файла в байтах */
  fileSize: number;
  /** MIME-тип файла */
  fileType: string;
  /** Имя файла */
  fileName: string;
  /** Теги документа (опционально) */
  tags?: string[];
  /** Идентификатор связанной сущности (опционально) */
  entityId?: string;
  /** Тип связанной сущности (опционально) */
  entityType?: string;
  /** Дата начала действия документа (опционально) */
  validFrom?: string;
  /** Дата окончания действия документа (опционально) */
  validUntil?: string;
  /** Кем выдан документ (опционально) */
  issuedBy?: string;
  /** Кому выдан документ (опционально) */
  issuedTo?: string;
  /** Дата и время создания документа */
  createdAt: string;
  /** Дата и время последнего обновления документа */
  updatedAt: string;
}

/**
 * DTO для создания нового документа
 *
 * @example
 * ```typescript
 * const createDocumentDto: CreateDocumentDto = {
 *   userId: 'user1',
 *   title: 'Договор кредита',
 *   description: 'Кредитный договор №123-456',
 *   type: DocumentType.Contract,
 *   status: DocumentStatus.Active,
 *   fileUrl: 'https://example.com/files/contract.pdf',
 *   fileSize: 1024000,
 *   fileType: 'application/pdf',
 *   fileName: 'contract.pdf',
 *   tags: ['кредит', 'договор', 'банк'],
 *   entityId: 'loan1',
 *   entityType: 'loan',
 *   validFrom: '2023-01-01',
 *   validUntil: '2025-01-01',
 *   issuedBy: 'Сбербанк',
 *   issuedTo: 'Иванов Иван Иванович',
 * };
 * ```
 */
export interface CreateDocumentDto {
  /** Идентификатор владельца документа */
  userId: string;
  /** Название документа */
  title: string;
  /** Описание документа */
  description: string;
  /** Тип документа */
  type: DocumentType | string;
  /** Статус документа */
  status: DocumentStatus | string;
  /** URL файла документа */
  fileUrl: string;
  /** Размер файла в байтах */
  fileSize: number;
  /** MIME-тип файла */
  fileType: string;
  /** Имя файла */
  fileName: string;
  /** Теги документа (опционально) */
  tags?: string[];
  /** Идентификатор связанной сущности (опционально) */
  entityId?: string;
  /** Тип связанной сущности (опционально) */
  entityType?: string;
  /** Дата начала действия документа (опционально) */
  validFrom?: string;
  /** Дата окончания действия документа (опционально) */
  validUntil?: string;
  /** Кем выдан документ (опционально) */
  issuedBy?: string;
  /** Кому выдан документ (опционально) */
  issuedTo?: string;
}

/**
 * DTO для обновления существующего документа
 *
 * @example
 * ```typescript
 * const updateDocumentDto: UpdateDocumentDto = {
 *   status: DocumentStatus.Archived,
 *   tags: ['кредит', 'договор', 'банк', 'архив'],
 * };
 * ```
 */
export interface UpdateDocumentDto {
  /** Название документа */
  title?: string;
  /** Описание документа */
  description?: string;
  /** Тип документа */
  type?: DocumentType | string;
  /** Статус документа */
  status?: DocumentStatus | string;
  /** URL файла документа */
  fileUrl?: string;
  /** Размер файла в байтах */
  fileSize?: number;
  /** MIME-тип файла */
  fileType?: string;
  /** Имя файла */
  fileName?: string;
  /** Теги документа */
  tags?: string[];
  /** Идентификатор связанной сущности */
  entityId?: string;
  /** Тип связанной сущности */
  entityType?: string;
  /** Дата начала действия документа */
  validFrom?: string;
  /** Дата окончания действия документа */
  validUntil?: string;
  /** Кем выдан документ */
  issuedBy?: string;
  /** Кому выдан документ */
  issuedTo?: string;
}

/**
 * DTO для ответа с данными документа
 *
 * @example
 * ```typescript
 * const documentResponseDto: DocumentResponseDto = {
 *   id: '1',
 *   userId: 'user1',
 *   title: 'Договор кредита',
 *   description: 'Кредитный договор №123-456',
 *   type: DocumentType.Contract,
 *   status: DocumentStatus.Active,
 *   fileUrl: 'https://example.com/files/contract.pdf',
 *   fileSize: 1024000,
 *   fileType: 'application/pdf',
 *   fileName: 'contract.pdf',
 *   tags: ['кредит', 'договор', 'банк'],
 *   entityId: 'loan1',
 *   entityType: 'loan',
 *   validFrom: '2023-01-01',
 *   validUntil: '2025-01-01',
 *   issuedBy: 'Сбербанк',
 *   issuedTo: 'Иванов Иван Иванович',
 *   createdAt: '2023-01-01T00:00:00Z',
 *   updatedAt: '2023-01-01T00:00:00Z',
 * };
 * ```
 */
export interface DocumentResponseDto extends Document {
  // Добавляем служебное поле для отличия от базового интерфейса
  _responseType?: 'document';
}

/**
 * JSON-схема для документа
 *
 * Используется для валидации данных и документации API
 */
export const documentSchema = createBaseJsonSchema({
  title: 'Document',
  description: 'Документ в системе',
  required: [
    'id',
    'userId',
    'title',
    'description',
    'type',
    'status',
    'fileUrl',
    'fileSize',
    'fileType',
    'fileName',
    'createdAt',
    'updatedAt',
  ],
  properties: {
    id: {
      type: 'string',
      description: 'Уникальный идентификатор документа',
      examples: ['1', 'a1b2c3d4'],
    },
    userId: {
      type: 'string',
      description: 'Идентификатор владельца документа',
      examples: ['user1'],
    },
    title: {
      type: 'string',
      description: 'Название документа',
      examples: ['Договор кредита'],
    },
    description: {
      type: 'string',
      description: 'Описание документа',
      examples: ['Кредитный договор №123-456'],
    },
    type: {
      type: 'string',
      enum: Object.values(DocumentType),
      description: 'Тип документа',
      examples: ['contract', 'invoice', 'receipt'],
    },
    status: {
      type: 'string',
      enum: Object.values(DocumentStatus),
      description: 'Статус документа',
      examples: ['active', 'archived', 'pending'],
    },
    fileUrl: {
      type: 'string',
      description: 'URL файла документа',
      examples: ['https://example.com/files/contract.pdf'],
    },
    fileSize: {
      type: 'number',
      description: 'Размер файла в байтах',
      examples: [1024000],
    },
    fileType: {
      type: 'string',
      description: 'MIME-тип файла',
      examples: ['application/pdf', 'image/jpeg'],
    },
    fileName: {
      type: 'string',
      description: 'Имя файла',
      examples: ['contract.pdf'],
    },
    tags: {
      type: 'array',
      items: {
        type: 'string',
      },
      description: 'Теги документа',
      examples: [['кредит', 'договор', 'банк']],
    },
    entityId: {
      type: 'string',
      description: 'Идентификатор связанной сущности',
      examples: ['loan1'],
    },
    entityType: {
      type: 'string',
      description: 'Тип связанной сущности',
      examples: ['loan', 'account', 'transaction'],
    },
    validFrom: {
      type: 'string',
      description: 'Дата начала действия документа',
      examples: ['2023-01-01'],
    },
    validUntil: {
      type: 'string',
      description: 'Дата окончания действия документа',
      examples: ['2025-01-01'],
    },
    issuedBy: {
      type: 'string',
      description: 'Кем выдан документ',
      examples: ['Сбербанк'],
    },
    issuedTo: {
      type: 'string',
      description: 'Кому выдан документ',
      examples: ['Иванов Иван Иванович'],
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Дата и время создания документа',
      examples: ['2023-01-01T00:00:00Z'],
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Дата и время последнего обновления документа',
      examples: ['2023-01-01T00:00:00Z'],
    },
  },
});
