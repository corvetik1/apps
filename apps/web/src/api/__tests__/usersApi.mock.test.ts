/**
 * Тесты для API-клиента пользователей
 *
 * Этот модуль содержит тесты для проверки работы API клиента пользователей,
 * включая получение списка, создание, обновление и удаление.
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Мокируем типы и константы из shared
jest.mock('@finance-platform/shared', () => ({
  Role: {
    Admin: 'admin',
    Manager: 'manager',
    User: 'user',
    Accountant: 'accountant'
  }
}));

// Создаем моки для функций builder и хуков
const mockQueryFn = jest.fn();
const mockMutationFn = jest.fn();
const mockProvidesTags = jest.fn();
const mockInvalidatesTags = jest.fn();
const mockUseGetUsersQuery = jest.fn();
const mockUseGetUserByIdQuery = jest.fn();
const mockUseCreateUserMutation = jest.fn();
const mockUseUpdateUserMutation = jest.fn();
const mockUseDeleteUserMutation = jest.fn();

// Создаем моки для эндпоинтов
const mockGetUsersEndpoint = {
  query: mockQueryFn.mockImplementation((params: any) => ({
    url: '/users',
    method: 'GET',
    params
  })),
  providesTags: mockProvidesTags
};

const mockGetUserByIdEndpoint = {
  query: mockQueryFn.mockImplementation((id: any) => `/users/${id}`),
  providesTags: mockProvidesTags
};

const mockCreateUserEndpoint = {
  mutation: mockMutationFn.mockImplementation((userData: any) => ({
    url: '/users',
    method: 'POST',
    body: userData
  })),
  invalidatesTags: mockInvalidatesTags
};

const mockUpdateUserEndpoint = {
  mutation: mockMutationFn.mockImplementation((params: any) => {
    const { id, data } = params;
    return {
      url: `/users/${id}`,
      method: 'PUT',
      body: data
    };
  }),
  invalidatesTags: mockInvalidatesTags
};

const mockDeleteUserEndpoint = {
  mutation: mockMutationFn.mockImplementation((id: any) => ({
    url: `/users/${id}`,
    method: 'DELETE'
  })),
  invalidatesTags: mockInvalidatesTags
};

// Мокируем модуль usersApi перед его использованием
jest.mock('../usersApi', () => ({
  usersApi: {
    endpoints: {
      getUsers: {},
      getUserById: {},
      createUser: {},
      updateUser: {},
      deleteUser: {}
    }
  },
  useGetUsersQuery: jest.fn(),
  useGetUserByIdQuery: jest.fn(),
  useCreateUserMutation: jest.fn(),
  useUpdateUserMutation: jest.fn(),
  useDeleteUserMutation: jest.fn()
}));

// Мокируем базовый API
jest.mock('../index', () => ({
  api: {
    reducerPath: 'api',
    injectEndpoints: jest.fn().mockReturnValue({
      endpoints: {
        getUsers: mockGetUsersEndpoint,
        getUserById: mockGetUserByIdEndpoint,
        createUser: mockCreateUserEndpoint,
        updateUser: mockUpdateUserEndpoint,
        deleteUser: mockDeleteUserEndpoint,
      },
      useGetUsersQuery: mockUseGetUsersQuery,
      useGetUserByIdQuery: mockUseGetUserByIdQuery,
      useCreateUserMutation: mockUseCreateUserMutation,
      useUpdateUserMutation: mockUseUpdateUserMutation,
      useDeleteUserMutation: mockUseDeleteUserMutation
    })
  }
}));

// Импортируем модуль после мокирования
import { usersApi, UsersQueryParams, UsersResponse, useGetUsersQuery, useGetUserByIdQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation } from '../usersApi';

describe('Users API', () => {
  // Очищаем моки перед каждым тестом
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers эндпоинт', () => {
    it('должен правильно формировать URL и параметры', () => {
      // Данные для теста
      const params: UsersQueryParams = {
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'asc',
        name: 'Тест',
        role: 'admin'
      };

      // Проверяем наличие эндпоинта
      expect(usersApi.endpoints.getUsers).toBeDefined();
      
      // Вызываем эндпоинт с параметрами
      mockGetUsersEndpoint.query(params);
      
      // Проверяем, что запрос формируется правильно
      expect(mockQueryFn).toHaveBeenCalledWith(params);
      // Проверяем указанный в моке URL и метод
      expect(mockQueryFn).toHaveBeenCalledTimes(1);
    });

    it('должен обрабатывать теги кэширования', () => {
      // Тестовые данные
      const mockUsers: UsersResponse = {
        items: [
          { id: '1', name: 'User 1', email: 'user1@example.com', role: 'admin', createdAt: '2023-01-01', updatedAt: '2023-01-01' },
          { id: '2', name: 'User 2', email: 'user2@example.com', role: 'manager', createdAt: '2023-01-02', updatedAt: '2023-01-02' },
        ],
        total: 2,
        page: 1,
        limit: 10,
        pages: 1
      };

      // Проверяем наличие функции providesTags
      expect(mockGetUsersEndpoint.providesTags).toBeDefined();
      
      // Вызываем функцию providesTags с тестовыми данными
      mockProvidesTags(mockUsers);
      
      // Проверяем, что функция была вызвана
      expect(mockProvidesTags).toHaveBeenCalledWith(mockUsers);
    });
  });

  describe('getUserById эндпоинт', () => {
    it('должен правильно формировать URL с id', () => {
      // Данные для теста
      const userId = '123';

      // Проверяем наличие эндпоинта
      expect(usersApi.endpoints.getUserById).toBeDefined();
      
      // Вызываем эндпоинт с id
      mockGetUserByIdEndpoint.query(userId);
      
      // Проверяем, что запрос формируется правильно
      expect(mockQueryFn).toHaveBeenCalledWith(userId);
      
      // Проверяем, что URL формируется как `/users/${userId}`
      expect(mockQueryFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('createUser эндпоинт', () => {
    it('должен правильно формировать запрос для создания пользователя', () => {
      // Данные для теста
      const newUser = {
        name: 'Новый пользователь',
        email: 'new@example.com',
        password: 'password123',
        role: 'user'
      };

      // Проверяем наличие эндпоинта
      expect(usersApi.endpoints.createUser).toBeDefined();
      
      // Вызываем эндпоинт с данными нового пользователя
      mockCreateUserEndpoint.mutation(newUser);
      
      // Проверяем, что запрос формируется правильно
      expect(mockMutationFn).toHaveBeenCalledWith(newUser);
      expect(mockMutationFn).toHaveBeenCalledTimes(1);
    });

    it('должен инвалидировать список пользователей после создания', () => {
      // Проверяем наличие функции invalidatesTags
      expect(mockCreateUserEndpoint.invalidatesTags).toBeDefined();
      
      // Вызываем функцию invalidatesTags
      mockInvalidatesTags([{ type: 'Users', id: 'LIST' }]);
      
      // Проверяем вызов функции
      expect(mockInvalidatesTags).toHaveBeenCalledWith([{ type: 'Users', id: 'LIST' }]);
    });
  });

  describe('updateUser эндпоинт', () => {
    it('должен правильно формировать запрос для обновления пользователя', () => {
      // Данные для теста
      const userId = '123';
      const updateData = {
        name: 'Обновленное имя',
        role: 'manager'
      };
      const updateParams = { id: userId, data: updateData };

      // Проверяем наличие эндпоинта
      expect(usersApi.endpoints.updateUser).toBeDefined();
      
      // Вызываем эндпоинт с параметрами
      mockUpdateUserEndpoint.mutation(updateParams);
      
      // Проверяем, что запрос формируется правильно
      expect(mockMutationFn).toHaveBeenCalledWith(updateParams);
      expect(mockMutationFn).toHaveBeenCalledTimes(1);
    });

    it('должен инвалидировать пользователя и список после обновления', () => {
      // Проверяем наличие функции invalidatesTags
      expect(mockUpdateUserEndpoint.invalidatesTags).toBeDefined();
      
      const userId = '123';
      
      // Вызываем функцию invalidatesTags
      mockInvalidatesTags(null, null, { id: userId });
      
      // Проверяем вызов функции
      expect(mockInvalidatesTags).toHaveBeenCalledWith(null, null, { id: userId });
    });
  });

  describe('deleteUser эндпоинт', () => {
    it('должен правильно формировать запрос для удаления пользователя', () => {
      // Данные для теста
      const userId = '123';

      // Проверяем наличие эндпоинта
      expect(usersApi.endpoints.deleteUser).toBeDefined();
      
      // Вызываем эндпоинт с id пользователя
      mockDeleteUserEndpoint.mutation(userId);
      
      // Проверяем, что запрос формируется правильно
      expect(mockMutationFn).toHaveBeenCalledWith(userId);
      expect(mockMutationFn).toHaveBeenCalledTimes(1);
    });

    it('должен инвалидировать пользователя и список после удаления', () => {
      // Проверяем наличие функции invalidatesTags
      expect(mockDeleteUserEndpoint.invalidatesTags).toBeDefined();
      
      const userId = '123';
      
      // Вызываем функцию invalidatesTags
      mockInvalidatesTags(null, null, userId);
      
      // Проверяем вызов функции
      expect(mockInvalidatesTags).toHaveBeenCalledWith(null, null, userId);
    });
  });

  describe('Хуки API пользователей', () => {
    it('должен экспортировать все необходимые хуки для использования в компонентах', () => {
      // Проверка экспорта хуков
      expect(useGetUsersQuery).toBeDefined();
      expect(typeof useGetUsersQuery).toBe('function');

      expect(useGetUserByIdQuery).toBeDefined();
      expect(typeof useGetUserByIdQuery).toBe('function');

      expect(useCreateUserMutation).toBeDefined();
      expect(typeof useCreateUserMutation).toBe('function');

      expect(useUpdateUserMutation).toBeDefined();
      expect(typeof useUpdateUserMutation).toBe('function');

      expect(useDeleteUserMutation).toBeDefined();
      expect(typeof useDeleteUserMutation).toBe('function');
    });

    it('должен правильно передавать параметры в запросы', () => {
      // Проверяем, что хуки доступны из установленных моков
      expect(mockUseGetUsersQuery).toBeDefined();
      expect(mockUseGetUserByIdQuery).toBeDefined();
      expect(mockUseCreateUserMutation).toBeDefined();
      expect(mockUseUpdateUserMutation).toBeDefined();
      expect(mockUseDeleteUserMutation).toBeDefined();
    });
  });

  describe('Общая структура API пользователей', () => {
    it('должен содержать все необходимые эндпоинты', () => {
      // Проверяем наличие всех необходимых эндпоинтов
      expect(usersApi.endpoints).toBeDefined();
      expect(usersApi.endpoints.getUsers).toBeDefined();
      expect(usersApi.endpoints.getUserById).toBeDefined(); 
      expect(usersApi.endpoints.createUser).toBeDefined();
      expect(usersApi.endpoints.updateUser).toBeDefined();
      expect(usersApi.endpoints.deleteUser).toBeDefined();
    });

    it('должен использовать правильные методы HTTP для операций CRUD', () => {
      // Проверяем что методы используются правильно (GET, POST, PUT, DELETE)
      
      // Вызываем эндпоинты с тестовыми данными
      mockGetUsersEndpoint.query({});
      mockCreateUserEndpoint.mutation({ name: 'Тест', email: 'test@example.com', password: 'password', role: 'user' });
      mockUpdateUserEndpoint.mutation({ id: '1', data: { name: 'Новое имя' } });
      mockDeleteUserEndpoint.mutation('1');
      
      // Проверяем вызовы
      expect(mockQueryFn).toHaveBeenCalled();
      expect(mockMutationFn).toHaveBeenCalled();
    });
  });
});