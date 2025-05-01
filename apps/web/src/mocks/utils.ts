/**
 * Утилиты для моков
 *
 * Этот модуль содержит вспомогательные функции для работы с моками,
 * включая генерацию токенов и имитацию задержки сети.
 */

import { API_DELAY } from './constants';

/**
 * Генерирует JWT-подобный токен
 *
 * @param payload - Данные для включения в токен
 * @param expiresIn - Время жизни токена (по умолчанию '1h')
 * @returns Строка токена
 */
export const generateToken = (payload: Record<string, any>, expiresIn = '1h'): string => {
  // В реальном приложении здесь будет использоваться библиотека jsonwebtoken
  // Для мока просто создаем строку, похожую на JWT
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const encodedPayload = btoa(
    JSON.stringify({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + (expiresIn === '1h' ? 3600 : 7 * 24 * 3600),
      iat: Math.floor(Date.now() / 1000),
    }),
  );
  const signature = btoa('signature');

  return `${header}.${encodedPayload}.${signature}`;
};

/**
 * Имитирует задержку сети
 *
 * @param ms - Время задержки в миллисекундах (по умолчанию API_DELAY)
 * @returns Promise, который разрешается через указанное время
 */
export const delay = (ms = API_DELAY): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Генерирует случайный идентификатор
 *
 * @returns Строка идентификатора
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
