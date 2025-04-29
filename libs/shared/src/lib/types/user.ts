/**
 * Типы и DTO для пользователей
 *
 * Этот модуль содержит все типы, связанные с пользователями системы,
 * включая роли, основной интерфейс пользователя и DTO для API.
 */

import { createBaseJsonSchema } from '../utils/json-schema';

/**
 * Роли пользователей в системе
 *
 * @example
 * ```typescript
 * const userRole = Role.User;
 * ```
 */
export enum Role {
  /** Администратор системы с полным доступом */
  Admin = 'admin',
  /** Менеджер с расширенными правами */
  Manager = 'manager',
  /** Обычный пользователь */
  User = 'user',
  /** Гость с ограниченным доступом */
  Guest = 'guest',
}

/**
 * Интерфейс пользователя системы
 *
 * @example
 * ```typescript
 * const user: User = {
 *   id: '1',
 *   email: 'user@example.com',
 *   name: 'John Doe',
 *   role: Role.User,
 *   createdAt: '2023-01-01T00:00:00Z',
 *   updatedAt: '2023-01-01T00:00:00Z',
 * };
 * ```
 */
export interface User {
  /** Уникальный идентификатор пользователя */
  id: string;
  /** Email пользователя, используется для входа */
  email: string;
  /** Имя пользователя */
  name: string;
  /** Роль пользователя в системе */
  role: Role | string;
  /** Дата и время создания пользователя */
  createdAt: string;
  /** Дата и время последнего обновления пользователя */
  updatedAt: string;
}

/**
 * DTO для создания нового пользователя
 *
 * @example
 * ```typescript
 * const createUserDto: CreateUserDto = {
 *   email: 'user@example.com',
 *   name: 'John Doe',
 *   role: Role.User,
 *   password: 'securePassword123',
 * };
 * ```
 */
export interface CreateUserDto {
  /** Email пользователя, должен быть уникальным */
  email: string;
  /** Имя пользователя */
  name: string;
  /** Роль пользователя в системе */
  role: Role | string;
  /** Пароль пользователя */
  password: string;
}

/**
 * DTO для обновления существующего пользователя
 *
 * @example
 * ```typescript
 * const updateUserDto: UpdateUserDto = {
 *   name: 'New Name',
 *   role: Role.Manager,
 * };
 * ```
 */
export interface UpdateUserDto {
  /** Email пользователя */
  email?: string;
  /** Имя пользователя */
  name?: string;
  /** Роль пользователя в системе */
  role?: Role | string;
  /** Новый пароль пользователя */
  password?: string;
}

/**
 * DTO для ответа с данными пользователя
 *
 * @example
 * ```typescript
 * const userResponseDto: UserResponseDto = {
 *   id: '1',
 *   email: 'user@example.com',
 *   name: 'John Doe',
 *   role: Role.User,
 *   createdAt: '2023-01-01T00:00:00Z',
 *   updatedAt: '2023-01-01T00:00:00Z',
 * };
 * ```
 */
export interface UserResponseDto extends Omit<User, 'password'> {
  // Добавляем служебное поле для отличия от базового интерфейса
  _responseType?: 'user';
}

/**
 * JSON-схема для пользователя
 *
 * Используется для валидации данных и документации API
 */
export const userSchema = createBaseJsonSchema({
  title: 'User',
  description: 'Пользователь системы',
  required: ['id', 'email', 'name', 'role', 'createdAt', 'updatedAt'],
  properties: {
    id: {
      type: 'string',
      description: 'Уникальный идентификатор пользователя',
      examples: ['1', 'a1b2c3d4'],
    },
    email: {
      type: 'string',
      format: 'email',
      description: 'Email пользователя, используется для входа',
      examples: ['user@example.com'],
    },
    name: {
      type: 'string',
      description: 'Имя пользователя',
      examples: ['John Doe'],
    },
    role: {
      type: 'string',
      enum: Object.values(Role),
      description: 'Роль пользователя в системе',
      examples: ['user', 'admin'],
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Дата и время создания пользователя',
      examples: ['2023-01-01T00:00:00Z'],
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Дата и время последнего обновления пользователя',
      examples: ['2023-01-01T00:00:00Z'],
    },
  },
});
