/**
 * Типы и DTO для заметок
 *
 * Этот модуль содержит все типы, связанные с заметками в системе,
 * включая типы заметок, приоритеты, основной интерфейс заметки и DTO для API.
 */

import { createBaseJsonSchema } from '../utils/json-schema';

/**
 * Типы заметок в системе
 *
 * @example
 * ```typescript
 * const noteType = NoteType.Reminder;
 * ```
 */
export enum NoteType {
  /** Общая заметка */
  General = 'general',
  /** Задача */
  Task = 'task',
  /** Напоминание */
  Reminder = 'reminder',
  /** Идея */
  Idea = 'idea',
  /** Финансовая заметка */
  Financial = 'financial',
}

/**
 * Приоритеты заметок в системе
 *
 * @example
 * ```typescript
 * const notePriority = NotePriority.High;
 * ```
 */
export enum NotePriority {
  /** Низкий приоритет */
  Low = 'low',
  /** Средний приоритет */
  Medium = 'medium',
  /** Высокий приоритет */
  High = 'high',
  /** Срочный приоритет */
  Urgent = 'urgent',
}

/**
 * Интерфейс заметки в системе
 *
 * @example
 * ```typescript
 * const note: Note = {
 *   id: '1',
 *   userId: 'user1',
 *   title: 'Важная встреча',
 *   content: 'Встреча с банком по вопросу кредита',
 *   type: NoteType.Reminder,
 *   priority: NotePriority.High,
 *   isCompleted: false,
 *   dueDate: '2023-02-15T10:00:00Z',
 *   color: '#FF5733',
 *   entityId: 'loan1',
 *   entityType: 'loan',
 *   tags: ['встреча', 'банк', 'кредит'],
 *   createdAt: '2023-01-01T00:00:00Z',
 *   updatedAt: '2023-01-01T00:00:00Z',
 * };
 * ```
 */
export interface Note {
  /** Уникальный идентификатор заметки */
  id: string;
  /** Идентификатор владельца заметки */
  userId: string;
  /** Заголовок заметки */
  title: string;
  /** Содержимое заметки */
  content: string;
  /** Тип заметки */
  type: NoteType | string;
  /** Приоритет заметки */
  priority: NotePriority | string;
  /** Флаг завершенности заметки */
  isCompleted: boolean;
  /** Срок выполнения (опционально) */
  dueDate?: string;
  /** Цвет заметки (опционально) */
  color?: string;
  /** Идентификатор связанной сущности (опционально) */
  entityId?: string;
  /** Тип связанной сущности (опционально) */
  entityType?: string;
  /** Теги заметки (опционально) */
  tags?: string[];
  /** Дата и время создания заметки */
  createdAt: string;
  /** Дата и время последнего обновления заметки */
  updatedAt: string;
}

/**
 * DTO для создания новой заметки
 *
 * @example
 * ```typescript
 * const createNoteDto: CreateNoteDto = {
 *   userId: 'user1',
 *   title: 'Важная встреча',
 *   content: 'Встреча с банком по вопросу кредита',
 *   type: NoteType.Reminder,
 *   priority: NotePriority.High,
 *   isCompleted: false,
 *   dueDate: '2023-02-15T10:00:00Z',
 *   color: '#FF5733',
 *   entityId: 'loan1',
 *   entityType: 'loan',
 *   tags: ['встреча', 'банк', 'кредит'],
 * };
 * ```
 */
export interface CreateNoteDto {
  /** Идентификатор владельца заметки */
  userId: string;
  /** Заголовок заметки */
  title: string;
  /** Содержимое заметки */
  content: string;
  /** Тип заметки */
  type: NoteType | string;
  /** Приоритет заметки */
  priority: NotePriority | string;
  /** Флаг завершенности заметки */
  isCompleted: boolean;
  /** Срок выполнения (опционально) */
  dueDate?: string;
  /** Цвет заметки (опционально) */
  color?: string;
  /** Идентификатор связанной сущности (опционально) */
  entityId?: string;
  /** Тип связанной сущности (опционально) */
  entityType?: string;
  /** Теги заметки (опционально) */
  tags?: string[];
}

/**
 * DTO для обновления существующей заметки
 *
 * @example
 * ```typescript
 * const updateNoteDto: UpdateNoteDto = {
 *   title: 'Обновленная встреча',
 *   isCompleted: true,
 *   priority: NotePriority.Urgent,
 * };
 * ```
 */
export interface UpdateNoteDto {
  /** Заголовок заметки */
  title?: string;
  /** Содержимое заметки */
  content?: string;
  /** Тип заметки */
  type?: NoteType | string;
  /** Приоритет заметки */
  priority?: NotePriority | string;
  /** Флаг завершенности заметки */
  isCompleted?: boolean;
  /** Срок выполнения */
  dueDate?: string;
  /** Цвет заметки */
  color?: string;
  /** Идентификатор связанной сущности */
  entityId?: string;
  /** Тип связанной сущности */
  entityType?: string;
  /** Теги заметки */
  tags?: string[];
}

/**
 * DTO для ответа с данными заметки
 *
 * @example
 * ```typescript
 * const noteResponseDto: NoteResponseDto = {
 *   id: '1',
 *   userId: 'user1',
 *   title: 'Важная встреча',
 *   content: 'Встреча с банком по вопросу кредита',
 *   type: NoteType.Reminder,
 *   priority: NotePriority.High,
 *   isCompleted: false,
 *   dueDate: '2023-02-15T10:00:00Z',
 *   color: '#FF5733',
 *   entityId: 'loan1',
 *   entityType: 'loan',
 *   tags: ['встреча', 'банк', 'кредит'],
 *   createdAt: '2023-01-01T00:00:00Z',
 *   updatedAt: '2023-01-01T00:00:00Z',
 * };
 * ```
 */
export interface NoteResponseDto extends Note {
  // Добавляем служебное поле для отличия от базового интерфейса
  _responseType?: 'note';
}

/**
 * JSON-схема для заметки
 *
 * Используется для валидации данных и документации API
 */
export const noteSchema = createBaseJsonSchema({
  title: 'Note',
  description: 'Заметка в системе',
  required: [
    'id',
    'userId',
    'title',
    'content',
    'type',
    'priority',
    'isCompleted',
    'createdAt',
    'updatedAt',
  ],
  properties: {
    id: {
      type: 'string',
      description: 'Уникальный идентификатор заметки',
      examples: ['1', 'a1b2c3d4'],
    },
    userId: {
      type: 'string',
      description: 'Идентификатор владельца заметки',
      examples: ['user1'],
    },
    title: {
      type: 'string',
      description: 'Заголовок заметки',
      examples: ['Важная встреча'],
    },
    content: {
      type: 'string',
      description: 'Содержимое заметки',
      examples: ['Встреча с банком по вопросу кредита'],
    },
    type: {
      type: 'string',
      enum: Object.values(NoteType),
      description: 'Тип заметки',
      examples: ['general', 'task', 'reminder'],
    },
    priority: {
      type: 'string',
      enum: Object.values(NotePriority),
      description: 'Приоритет заметки',
      examples: ['low', 'medium', 'high', 'urgent'],
    },
    isCompleted: {
      type: 'boolean',
      description: 'Флаг завершенности заметки',
      examples: [false, true],
    },
    dueDate: {
      type: 'string',
      format: 'date-time',
      description: 'Срок выполнения',
      examples: ['2023-02-15T10:00:00Z'],
    },
    color: {
      type: 'string',
      description: 'Цвет заметки',
      examples: ['#FF5733', '#33FF57', '#3357FF'],
    },
    entityId: {
      type: 'string',
      description: 'Идентификатор связанной сущности',
      examples: ['loan1', 'account1', 'transaction1'],
    },
    entityType: {
      type: 'string',
      description: 'Тип связанной сущности',
      examples: ['loan', 'account', 'transaction'],
    },
    tags: {
      type: 'array',
      items: {
        type: 'string',
      },
      description: 'Теги заметки',
      examples: [['встреча', 'банк', 'кредит']],
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Дата и время создания заметки',
      examples: ['2023-01-01T00:00:00Z'],
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Дата и время последнего обновления заметки',
      examples: ['2023-01-01T00:00:00Z'],
    },
  },
});
