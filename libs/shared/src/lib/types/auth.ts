/**
 * Типы и DTO для аутентификации
 *
 * Этот модуль содержит все типы, связанные с аутентификацией пользователей,
 * включая запросы на вход, ответы с токенами и информацию о сессии.
 */

import { User, Role } from './user';

/**
 * Запрос на вход в систему
 *
 * @example
 * ```typescript
 * const loginRequest: LoginRequest = {
 *   email: 'user@example.com',
 *   password: 'securePassword123',
 *   rememberMe: true
 * };
 * ```
 */
export interface LoginRequest {
  /** Email пользователя */
  email: string;
  /** Пароль пользователя */
  password: string;
  /** Флаг "запомнить меня" для продления сессии */
  rememberMe?: boolean;
}

/**
 * Ответ на успешную аутентификацию
 *
 * @example
 * ```typescript
 * const authResponse: AuthResponse = {
 *   user: {
 *     id: '1',
 *     email: 'user@example.com',
 *     name: 'John Doe',
 *     role: Role.User
 *   },
 *   accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
 *   refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
 *   expiresIn: 3600
 * };
 * ```
 */
export interface AuthResponse {
  /** Информация о пользователе */
  user: Omit<User, 'createdAt' | 'updatedAt'>;
  /** JWT токен доступа */
  accessToken: string;
  /** Токен для обновления сессии */
  refreshToken: string;
  /** Время жизни токена в секундах */
  expiresIn: number;
}

/**
 * Запрос на обновление токена
 *
 * @example
 * ```typescript
 * const refreshTokenRequest: RefreshTokenRequest = {
 *   refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 * };
 * ```
 */
export interface RefreshTokenRequest {
  /** Токен для обновления сессии */
  refreshToken: string;
}

/**
 * Информация о текущей сессии пользователя
 *
 * @example
 * ```typescript
 * const sessionInfo: SessionInfo = {
 *   userId: '1',
 *   role: Role.User,
 *   permissions: ['read:users', 'write:own-profile']
 * };
 * ```
 */
export interface SessionInfo {
  /** Идентификатор пользователя */
  userId: string;
  /** Роль пользователя */
  role: Role;
  /** Список разрешений пользователя */
  permissions: string[];
  /** Время истечения сессии */
  expiresAt: number;
}

/**
 * DTO для ответа с данными аутентификации
 *
 * @example
 * ```typescript
 * const authResponseDto: AuthResponseDto = {
 *   _responseType: 'auth',
 *   user: {
 *     id: '1',
 *     email: 'user@example.com',
 *     name: 'John Doe',
 *     role: Role.User
 *   },
 *   accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
 *   refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
 *   expiresIn: 3600
 * };
 * ```
 */
export interface AuthResponseDto extends AuthResponse {
  /** Тип ответа для сериализации */
  _responseType?: 'auth';
}

/**
 * DTO для ответа с информацией о сессии
 *
 * @example
 * ```typescript
 * const sessionResponseDto: SessionResponseDto = {
 *   _responseType: 'session',
 *   userId: '1',
 *   role: Role.User,
 *   permissions: ['read:users', 'write:own-profile'],
 *   expiresAt: 1672531200000
 * };
 * ```
 */
export interface SessionResponseDto extends SessionInfo {
  /** Тип ответа для сериализации */
  _responseType?: 'session';
}
