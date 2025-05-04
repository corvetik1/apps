/**
 * Схемы для валидации данных аутентификации
 *
 * Этот модуль содержит JSON-схемы для валидации запросов и ответов
 * связанных с аутентификацией пользователей.
 */

import { createBaseJsonSchema } from '../utils/json-schema';
import { Role } from '../types/user';

/**
 * Схема для валидации запроса на вход в систему
 */
export const loginSchema = createBaseJsonSchema({
  title: 'Login Request Schema',
  description: 'Схема для валидации запроса на вход в систему',
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
      description: 'Email пользователя',
      examples: ['user@example.com'],
    },
    password: {
      type: 'string',
      minLength: 8,
      description: 'Пароль пользователя',
      examples: ['securePassword123'],
    },
    rememberMe: {
      type: 'boolean',
      description: 'Флаг "запомнить меня" для продления сессии',
      default: false,
      examples: [true],
    },
  },
  additionalProperties: false,
});

/**
 * Схема для валидации ответа на успешную аутентификацию
 */
export const authResponseSchema = createBaseJsonSchema({
  title: 'Authentication Response Schema',
  description: 'Схема для валидации ответа на запрос аутентификации',
  type: 'object',
  required: ['user', 'accessToken', 'refreshToken', 'expiresIn'],
  properties: {
    user: {
      type: 'object',
      required: ['id', 'email', 'name', 'role'],
      properties: {
        id: {
          type: 'string',
          description: 'Уникальный идентификатор пользователя',
          examples: ['1', 'a1b2c3d4'],
        },
        email: {
          type: 'string',
          format: 'email',
          description: 'Email пользователя',
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
          examples: [Role.User, Role.Admin],
        },
      },
      additionalProperties: false,
    },
    accessToken: {
      type: 'string',
      description: 'JWT токен доступа',
      examples: ['eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'],
    },
    refreshToken: {
      type: 'string',
      description: 'Токен для обновления сессии',
      examples: ['eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'],
    },
    expiresIn: {
      type: 'number',
      description: 'Время жизни токена в секундах',
      examples: [3600],
    },
    _responseType: {
      type: 'string',
      const: 'auth',
      description: 'Тип ответа для сериализации',
    },
  },
  additionalProperties: false,
});

/**
 * Схема для валидации запроса на обновление токена
 */
export const refreshTokenSchema = createBaseJsonSchema({
  title: 'Refresh Token Schema',
  description: 'Схема для валидации запроса на обновление токена',
  type: 'object',
  required: ['refreshToken'],
  properties: {
    refreshToken: {
      type: 'string',
      description: 'Токен для обновления сессии',
      examples: ['eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'],
    },
  },
  additionalProperties: false,
});

/**
 * Схема для валидации информации о сессии
 */
export const sessionInfoSchema = createBaseJsonSchema({
  title: 'Session Info Schema',
  description: 'Схема для валидации информации о сессии пользователя',
  type: 'object',
  required: ['userId', 'role', 'permissions', 'expiresAt'],
  properties: {
    userId: {
      type: 'string',
      description: 'Идентификатор пользователя',
      examples: ['1', 'a1b2c3d4'],
    },
    role: {
      type: 'string',
      enum: Object.values(Role),
      description: 'Роль пользователя',
      examples: [Role.User, Role.Admin],
    },
    permissions: {
      type: 'array',
      items: {
        type: 'string',
      },
      description: 'Список разрешений пользователя',
      examples: [['read:users', 'write:own-profile']],
    },
    expiresAt: {
      type: 'number',
      description: 'Время истечения сессии в миллисекундах (timestamp)',
      examples: [1672531200000],
    },
    _responseType: {
      type: 'string',
      const: 'session',
      description: 'Тип ответа для сериализации',
    },
  },
  additionalProperties: false,
});
