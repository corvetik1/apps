/**
 * Полный мок для API клиента в тестовой среде
 * Избегаем импорта utils/env.ts, чтобы решить проблему с import.meta
 */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// Типы импортируются при необходимости в конкретных моках
import type {} from '@finance-platform/shared';

// Используем фиксированный URL для тестов
const API_BASE_URL = 'http://localhost:3333/api/v1';

// Базовый API клиент
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }: { getState: () => unknown }) => {
      // Получаем токен из стейта
      const token = (getState() as any).auth?.accessToken;
      
      // Если токен есть, добавляем его в заголовки
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ['User', 'Account', 'Transaction', 'Tender'],
  endpoints: () => ({}),
});

// Экспортируем для использования в других файлах
export const {
  reducerPath,
  reducer,
  middleware,
} = api;
