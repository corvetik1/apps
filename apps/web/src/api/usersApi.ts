/**
 * API-клиент для работы с пользователями
 *
 * Этот модуль содержит конечные точки API для управления пользователями,
 * включая получение списка, создание, обновление и удаление.
 */

import {
  User,
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
  Role,
} from '@finance-platform/shared';
import { api } from './index';

/**
 * Параметры запроса для получения списка пользователей
 */
export interface UsersQueryParams {
  /** Номер страницы (начиная с 1) */
  page?: number;
  /** Количество элементов на странице */
  limit?: number;
  /** Поле для сортировки */
  sortBy?: keyof User;
  /** Направление сортировки */
  sortOrder?: 'asc' | 'desc';
  /** Фильтр по имени */
  name?: string;
  /** Фильтр по email */
  email?: string;
  /** Фильтр по роли */
  role?: Role | string;
}

/**
 * Ответ API со списком пользователей и метаданными
 */
export interface UsersResponse {
  /** Список пользователей */
  items: UserResponseDto[];
  /** Общее количество пользователей */
  total: number;
  /** Текущая страница */
  page: number;
  /** Количество элементов на странице */
  limit: number;
  /** Общее количество страниц */
  pages: number;
}

/**
 * API-клиент для работы с пользователями
 */
export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Получение списка пользователей с пагинацией и фильтрацией
     */
    getUsers: builder.query<UsersResponse, UsersQueryParams>({
      query: (params) => ({
        url: '/users',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Users' as const, id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    /**
     * Получение пользователя по ID
     */
    getUserById: builder.query<UserResponseDto, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),

    /**
     * Создание нового пользователя
     */
    createUser: builder.mutation<UserResponseDto, CreateUserDto>({
      query: (userData) => ({
        url: '/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),

    /**
     * Обновление существующего пользователя
     */
    updateUser: builder.mutation<UserResponseDto, { id: string; data: UpdateUserDto }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' },
      ],
    }),

    /**
     * Удаление пользователя
     */
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' },
      ],
    }),
  }),
});

// Экспортируем хуки для использования в компонентах
export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
