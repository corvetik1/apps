/**
 * Утилиты для тестирования
 *
 * Этот файл содержит общие функции и утилиты для тестирования компонентов
 */

import { vi } from 'vitest';
import { Role } from '@finance-platform/shared';

/**
 * Мокирование модуля @finance-platform/shared
 */
export function mockSharedModule() {
  const mockRole = {
    Admin: 'admin',
    Manager: 'manager',
    User: 'user',
    Accountant: 'accountant',
    Guest: 'guest'
  };

  vi.mock('@finance-platform/shared', () => ({
    Role: mockRole,
    __esModule: true
  }));

  return { mockRole };
}

/**
 * Мокирование хука useAbility
 */
export function mockAbilities() {
  vi.mock('../permissions/abilities', () => ({
    useAbility: vi.fn().mockReturnValue({
      can: vi.fn().mockReturnValue(true)
    }),
    __esModule: true,
    default: {}
  }));
}

/**
 * Мокирование хука useAuth
 */
export function mockAuth(role: string = 'admin') {
  vi.mock('../auth/hooks/useAuth', () => ({
    useAuth: vi.fn().mockReturnValue({
      isAuthenticated: true,
      user: {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role
      },
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn()
    }),
    __esModule: true,
    default: {}
  }));
}

/**
 * Мокирование API пользователей
 */
export function mockUsersApi() {
  vi.mock('../api/usersApi', () => ({
    __esModule: true,
    useGetUsersQuery: vi.fn().mockReturnValue({
      data: {
        items: [
          {
            id: '1',
            name: 'Иван Иванов',
            email: 'ivan@example.com',
            role: 'admin',
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-10T00:00:00.000Z'
          },
          {
            id: '2',
            name: 'Петр Петров',
            email: 'petr@example.com',
            role: 'manager',
            createdAt: '2023-02-01T00:00:00.000Z',
            updatedAt: '2023-02-10T00:00:00.000Z'
          },
          {
            id: '3',
            name: 'Алексей Сидоров',
            email: 'alex@example.com',
            role: 'user',
            createdAt: '2023-03-01T00:00:00.000Z',
            updatedAt: '2023-03-10T00:00:00.000Z'
          }
        ],
        total: 3,
        page: 0,
        limit: 10
      },
      isLoading: false,
      error: null
    }),
    useCreateUserMutation: vi.fn().mockReturnValue([
      vi.fn().mockResolvedValue({ id: '4', name: 'Новый Пользователь', email: 'new@example.com', role: 'user' }),
      { isLoading: false, error: null }
    ]),
    useUpdateUserMutation: vi.fn().mockReturnValue([
      vi.fn().mockResolvedValue({ id: '1', name: 'Обновленный Иванов', email: 'ivan@example.com', role: 'admin' }),
      { isLoading: false, error: null }
    ]),
    useDeleteUserMutation: vi.fn().mockReturnValue([
      vi.fn().mockResolvedValue({}),
      { isLoading: false }
    ])
  }));
}

/**
 * Создание тестового хранилища Redux
 */
export function createTestStore() {
  return {
    getState: vi.fn(),
    subscribe: vi.fn(),
    dispatch: vi.fn()
  };
}

/**
 * Очистка всех моков
 */
export function clearAllMocks() {
  vi.clearAllMocks();
}
