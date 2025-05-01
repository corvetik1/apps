/**
 * Базовый API-клиент
 *
 * Этот модуль содержит базовую конфигурацию RTK Query API-клиента
 * для взаимодействия с бэкендом.
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Базовый URL API
const API_BASE_URL = process.env.NX_API_URL || 'http://localhost:3333/api/v1';

/**
 * Базовый API-клиент с RTK Query
 */
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Получаем токен из состояния Redux
      const token = (getState() as RootState).auth.accessToken;

      // Если токен существует, добавляем его в заголовки
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  // Определяем теги для кэширования
  tagTypes: [
    'Auth',
    'User',
    'Users',
    'Account',
    'Accounts',
    'Transaction',
    'Transactions',
    'Tender',
    'Tenders',
  ],
  // Конечные точки будут определены в отдельных файлах
  endpoints: () => ({}),
});

/**
 * Тип для ошибки API
 */
export interface ApiError {
  status: number;
  data: {
    message: string;
    errors?: Record<string, string[]>;
  };
}

/**
 * Функция для извлечения сообщения об ошибке из ответа API
 */
export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') return error;

  const apiError = error as ApiError;
  if (apiError?.data?.message) {
    return apiError.data.message;
  }

  return 'Произошла неизвестная ошибка';
};
