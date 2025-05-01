/**
 * API-клиент для аутентификации
 *
 * Этот модуль содержит конечные точки API для аутентификации пользователей,
 * включая вход, выход и обновление токена.
 */

import {
  LoginRequest,
  AuthResponse,
  RefreshTokenRequest,
  SessionInfo,
} from '@finance-platform/shared';
import { api } from './index';

/**
 * API-клиент для аутентификации
 */
export const authApi = api.injectEndpoints({
  endpoints: (builder: any) => ({
    /**
     * Вход в систему
     */
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials: LoginRequest) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),

    /**
     * Выход из системы
     */
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),

    /**
     * Обновление токена
     */
    refreshToken: builder.mutation<AuthResponse, RefreshTokenRequest>({
      query: (refreshData: RefreshTokenRequest) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: refreshData,
      }),
      invalidatesTags: ['Auth'],
    }),

    /**
     * Получение информации о текущей сессии
     */
    getSession: builder.query<SessionInfo, void>({
      query: () => '/auth/session',
      providesTags: ['Auth'],
    }),
  }),
});

// Экспортируем хуки для использования в компонентах
export const { useLoginMutation, useLogoutMutation, useRefreshTokenMutation, useGetSessionQuery } =
  authApi;
