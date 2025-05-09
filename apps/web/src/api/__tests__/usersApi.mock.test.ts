import { vi, describe, it, expect, beforeEach } from 'vitest';

/**
 * Тесты для API-клиента пользователей
 *
 * Этот модуль содержит тесты для проверки работы API клиента пользователей,
 * включая получение списка, создание, обновление и удаление.
 */

import { store } from '../../store';
// User type is used in usersApi.ts, ensure it's available or adjust if User is not directly used in tests
// import { User } from '../usersApi'; 

// Мокируем типы и константы из shared
vi.mock('@finance-platform/shared', () => ({
  Role: {
    Admin: 'admin',
    Manager: 'manager',
    User: 'user',
    Accountant: 'accountant'
  }
}));

// Используем vi.hoisted для переменных, которые должны быть доступны в vi.mock фабрике
const { mockBuilder, mockApiInstance, mockBuilderQuery, mockBuilderMutation } = vi.hoisted(() => {
  const mockBuilderQuery = vi.fn(config => config);
  const mockBuilderMutation = vi.fn(config => config);
  const mockBuilder = {
    query: mockBuilderQuery,
    mutation: mockBuilderMutation,
  };
  const mockApiInstance = {
    reducerPath: 'api' as const, 
    tagTypes: ['Users'] as const,
    endpoints: {},
    enhanceEndpoints: vi.fn(),
    injectEndpoints: vi.fn(function (this: any, { endpoints: endpointsCallback }: any) {
      const definedEndpoints = endpointsCallback(mockBuilder);
      this.endpoints = { ...this.endpoints, ...definedEndpoints };

      Object.keys(definedEndpoints).forEach(key => {
        const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
        const endpointConfig = definedEndpoints[key];
        if (typeof endpointConfig.query === 'function') {
          (this as any)[`use${capitalizedKey}Query`] = vi.fn(() => ({ data: undefined, error: undefined, isLoading: false }));
        }
        if (typeof endpointConfig.mutation === 'function') { 
          (this as any)[`use${capitalizedKey}Mutation`] = vi.fn(() => [vi.fn(), { data: undefined, error: undefined, isLoading: false }]);
        }
      });
      return this;
    }),
  };
  return { mockBuilder, mockApiInstance, mockBuilderQuery, mockBuilderMutation };
});

// Мокируем '../index' чтобы предоставить наш mockApiInstance.
// Фабрика vi.mock теперь может безопасно использовать mockApiInstance благодаря vi.hoisted
vi.mock('../index', () => ({
  api: mockApiInstance,
}));

// Импортируем usersApi ПОСЛЕ того, как все моки настроены.
// Когда usersApi.ts импортируется, его вызов api.injectEndpoints будет использовать наш мок.
import { 
  usersApi, 
  UsersQueryParams, 
  UsersResponse 
} from '../usersApi';


describe('Users API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Сбрасываем endpoints на mockApiInstance для изоляции тестов
    mockApiInstance.endpoints = {}; 
    // Также очищаем вызовы mockBuilder методов, если они проверяются в разных describe блоках
    mockBuilderQuery.mockClear();
    mockBuilderMutation.mockClear();
  });

  const getEndpointConfig = (endpointName: keyof typeof usersApi.endpoints) => {
    return (usersApi.endpoints as any)[endpointName];
  };

  describe('getUsers эндпоинт', () => {
    const params: UsersQueryParams = {
      page: 1,
      limit: 10,
      sortBy: 'name' as any, 
      sortOrder: 'asc',
      name: 'Тест',
      role: 'admin'
    };
    const mockUsers: UsersResponse = {
      items: [
        { id: '1', name: 'User 1', email: 'user1@example.com', role: 'admin' as any, createdAt: '2023-01-01', updatedAt: '2023-01-01' },
        { id: '2', name: 'User 2', email: 'user2@example.com', role: 'manager' as any, createdAt: '2023-01-02', updatedAt: '2023-01-02' },
      ],
      total: 2,
      page: 1,
      limit: 10,
      pages: 1
    };

    it('должен быть определен с правильной функцией query', () => {
      const endpointConfig = getEndpointConfig('getUsers');
      expect(endpointConfig).toBeDefined();
      expect(typeof endpointConfig.query).toBe('function');
      
      const queryArgs = endpointConfig.query(params);
      expect(queryArgs).toEqual({
        url: '/users',
        method: 'GET',
        params
      });
    });

    it('должен быть определен с правильной функцией providesTags', () => {
      const endpointConfig = getEndpointConfig('getUsers');
      expect(endpointConfig).toBeDefined();
      expect(typeof endpointConfig.providesTags).toBe('function');

      const tags = endpointConfig.providesTags(mockUsers, undefined, params);
      expect(tags).toEqual([
        { type: 'Users', id: '1' },
        { type: 'Users', id: '2' },
        { type: 'Users', id: 'LIST' },
      ]);
    });
  });

  describe('getUserById эндпоинт', () => {
    const userId = '123';
    it('должен быть определен с правильной функцией query', () => {
      const endpointConfig = getEndpointConfig('getUserById');
      expect(endpointConfig).toBeDefined();
      expect(typeof endpointConfig.query).toBe('function');
      const queryArg = endpointConfig.query(userId);
      expect(queryArg).toBe(`/users/${userId}`);
    });

    it('должен быть определен с правильной функцией providesTags', () => {
      const endpointConfig = getEndpointConfig('getUserById');
      expect(endpointConfig).toBeDefined();
      expect(typeof endpointConfig.providesTags).toBe('function');
      const tags = endpointConfig.providesTags(undefined, undefined, userId);
      expect(tags).toEqual([{ type: 'Users', id: userId }]);
    });
  });

  describe('createUser эндпоинт', () => {
    const newUser = {
      name: 'Новый пользователь',
      email: 'new@example.com',
      password: 'password123',
      role: 'user' as any
    };
    it('должен быть определен с правильной функцией mutation (query в RTK)', () => {
      const endpointConfig = getEndpointConfig('createUser');
      expect(endpointConfig).toBeDefined();
      // Для мутаций, 'query' содержит функцию мутации
      expect(typeof endpointConfig.query).toBe('function'); 
      const mutationArgs = endpointConfig.query(newUser);
      expect(mutationArgs).toEqual({
        url: '/users',
        method: 'POST',
        body: newUser
      });
    });
    it('должен быть определен с правильной функцией invalidatesTags', () => {
      const endpointConfig = getEndpointConfig('createUser');
      expect(endpointConfig).toBeDefined();
      expect(typeof endpointConfig.invalidatesTags).toBe('function');
      const tags = endpointConfig.invalidatesTags();
      expect(tags).toEqual([{ type: 'Users', id: 'LIST' }]);
    });
  });

  describe('updateUser эндпоинт', () => {
    const userId = '123';
    const updateData = {
      name: 'Обновленный пользователь',
      role: 'manager' as any
    };
    it('должен быть определен с правильной функцией mutation (query в RTK)', () => {
      const endpointConfig = getEndpointConfig('updateUser');
      expect(endpointConfig).toBeDefined();
      expect(typeof endpointConfig.query).toBe('function');
      const mutationArgs = endpointConfig.query({ id: userId, data: updateData });
      expect(mutationArgs).toEqual({
        url: `/users/${userId}`,
        method: 'PUT',
        body: updateData
      });
    });
    it('должен быть определен с правильной функцией invalidatesTags', () => {
      const endpointConfig = getEndpointConfig('updateUser');
      expect(endpointConfig).toBeDefined();
      expect(typeof endpointConfig.invalidatesTags).toBe('function');
      const tags = endpointConfig.invalidatesTags(undefined, undefined, { id: userId, data: updateData });
      expect(tags).toEqual([{ type: 'Users', id: userId }, { type: 'Users', id: 'LIST' }]);
    });
  });

  describe('deleteUser эндпоинт', () => {
    const userId = '123';
    it('должен быть определен с правильной функцией mutation (query в RTK)', () => {
      const endpointConfig = getEndpointConfig('deleteUser');
      expect(endpointConfig).toBeDefined();
      expect(typeof endpointConfig.query).toBe('function');
      const mutationArgs = endpointConfig.query(userId);
      expect(mutationArgs).toEqual({
        url: `/users/${userId}`,
        method: 'DELETE'
      });
    });
    it('должен быть определен с правильной функцией invalidatesTags', () => {
      const endpointConfig = getEndpointConfig('deleteUser');
      expect(endpointConfig).toBeDefined();
      expect(typeof endpointConfig.invalidatesTags).toBe('function');
      const tags = endpointConfig.invalidatesTags(undefined, undefined, userId);
      expect(tags).toEqual([{ type: 'Users', id: userId }, { type: 'Users', id: 'LIST' }]);
    });
  });

  describe('Экспортируемые хуки', () => {
    it('должен экспортировать useGetUsersQuery', () => {
      expect(usersApi.useGetUsersQuery).toBeDefined();
      expect(typeof usersApi.useGetUsersQuery).toBe('function');
    });
    it('должен экспортировать useGetUserByIdQuery', () => {
      expect(usersApi.useGetUserByIdQuery).toBeDefined();
      expect(typeof usersApi.useGetUserByIdQuery).toBe('function');
    });
    it('должен экспортировать useCreateUserMutation', () => {
      expect(usersApi.useCreateUserMutation).toBeDefined();
      expect(typeof usersApi.useCreateUserMutation).toBe('function');
    });
    it('должен экспортировать useUpdateUserMutation', () => {
      expect(usersApi.useUpdateUserMutation).toBeDefined();
      expect(typeof usersApi.useUpdateUserMutation).toBe('function');
    });
    it('должен экспортировать useDeleteUserMutation', () => {
      expect(usersApi.useDeleteUserMutation).toBeDefined();
      expect(typeof usersApi.useDeleteUserMutation).toBe('function');
    });
  });
});