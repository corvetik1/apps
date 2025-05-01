/**
 * JSON-схемы для пользователей
 *
 * Этот модуль содержит JSON-схемы для валидации данных пользователей,
 * используется в API для валидации запросов и ответов.
 */

import { Role } from '../types/user';

/**
 * Базовая JSON-схема для пользователя
 */
export const userSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    email: { type: 'string', format: 'email' },
    name: { type: 'string', minLength: 2, maxLength: 100 },
    role: {
      type: 'string',
      enum: Object.values(Role),
    },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  required: ['id', 'email', 'name', 'role', 'createdAt', 'updatedAt'],
  additionalProperties: false,
};

/**
 * JSON-схема для создания нового пользователя
 */
export const createUserSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    name: { type: 'string', minLength: 2, maxLength: 100 },
    role: {
      type: 'string',
      enum: Object.values(Role),
    },
    password: {
      type: 'string',
      minLength: 8,
      maxLength: 100,
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$', // Минимум 8 символов, как минимум 1 буква в верхнем регистре, 1 буква в нижнем регистре и 1 цифра
    },
  },
  required: ['email', 'name', 'role', 'password'],
  additionalProperties: false,
};

/**
 * JSON-схема для обновления существующего пользователя
 */
export const updateUserSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    name: { type: 'string', minLength: 2, maxLength: 100 },
    role: {
      type: 'string',
      enum: Object.values(Role),
    },
    password: {
      type: 'string',
      minLength: 8,
      maxLength: 100,
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$',
    },
  },
  additionalProperties: false,
};

/**
 * JSON-схема для запроса авторизации пользователя
 */
export const loginSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
  },
  required: ['email', 'password'],
  additionalProperties: false,
};
