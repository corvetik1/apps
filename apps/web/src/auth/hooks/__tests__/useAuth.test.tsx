/**
 * Тесты для хука useAuth
 *
 * Этот модуль содержит тесты для хука аутентификации,
 * проверяя корректность работы методов входа, выхода и проверки прав.
 */

import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, beforeEach, beforeAll, jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { authReducer } from '../../../store/slices/authSlice';
import { api } from '../../../api';
import * as authApi from '../../../api/authApi';

// Определение типа Role для тестов
enum Role {
  Admin = 'admin',
  User = 'user',
  Manager = 'manager',
  Guest = 'guest',
}

// Типы для моков и результатов
interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: Role;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Не определяем интерфейс LoginArgs, так как он не используется в тестах

// Тестовые данные - определяем до использования
const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: Role.User,
};

const mockAuthResponse: AuthResponse = {
  user: mockUser,
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  expiresIn: 3600,
};

/**
 * Прагматичный подход к тестированию RTK Query
 * Используем простые моки и any для обхода сложной типизации RTK Query
 */

/**
 * Прагматичный подход к тестированию RTK Query
 * Создаем локальные и глобальные моки, используя прагматичный подход с any
 */

// Локальные моки для использования в тестах
// Используем прагматичный подход с any для мок-функций
const mockLoginMutation: jest.Mock = jest.fn();
const mockLogoutMutation: jest.Mock = jest.fn();
const mockRefreshTokenMutation: jest.Mock = jest.fn();

// Глобальные моки для RTK Query API
const mockLoginTrigger: any = jest.fn();
const mockLogoutTrigger: any = jest.fn();
const mockRefreshTrigger: any = jest.fn();

// Связываем глобальные моки с локальными для возможности проверки вызовов
mockLoginTrigger.mockImplementation((...args) => {
  // Записываем вызов в локальный мок для проверки в тестах
  mockLoginMutation(...args);
  // Возвращаем объект с методом unwrap для совместимости с реальным кодом
  return {
    unwrap: () => Promise.resolve(mockAuthResponse),
  };
});

mockLogoutTrigger.mockImplementation((...args) => {
  mockLogoutMutation(...args);
  return {
    unwrap: () => Promise.resolve({}),
  };
});

mockRefreshTrigger.mockImplementation((...args) => {
  mockRefreshTokenMutation(...args);
  return {
    unwrap: () => Promise.resolve(mockAuthResponse),
  };
});

// Моки для хуков RTK Query
const mockLoginHook: any = [mockLoginTrigger, { isLoading: false, reset: jest.fn() }];
const mockLogoutHook: any = [mockLogoutTrigger, { isLoading: false, reset: jest.fn() }];
const mockRefreshHook: any = [mockRefreshTrigger, { isLoading: false, reset: jest.fn() }];

// Мокируем хуки RTK Query с помощью jest.spyOn
jest.spyOn(authApi, 'useLoginMutation').mockImplementation(() => mockLoginHook);
jest.spyOn(authApi, 'useLogoutMutation').mockImplementation(() => mockLogoutHook);
jest.spyOn(authApi, 'useRefreshTokenMutation').mockImplementation(() => mockRefreshHook);

// Мокируем вспомогательную функцию
// Мок для вспомогательной функции
const mockGetErrorMessage = jest.fn(
  (error: any) => (error && error.message) || 'Неизвестная ошибка',
);
// Это позволит избежать проблем с jest.mock на уровне модуля

describe('useAuth', () => {
  // Используем локальные моки, определенные в глобальном контексте

  // Настройка хранилища Redux
  const createTestStore = (initialState = {}) => {
    return configureStore({
      reducer: {
        auth: authReducer,
        [api.reducerPath]: api.reducer,
      },
      middleware: getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware),
      preloadedState: initialState,
    });
  };

  // Функция для рендеринга хука с провайдером Redux
  const renderAuthHook = (initialState = {}) => {
    const store = createTestStore(initialState);

    const Wrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    return renderHook(() => useAuth(), {
      wrapper: Wrapper,
    });
  };

  // Настраиваем моки для тестирования
  beforeAll(() => {
    // Связываем локальные моки с глобальными - это позволит нам проверять вызовы в тестах
    mockLoginTrigger.mockImplementation((...args) => {
      // Перенаправляем вызов на локальный мок, чтобы тесты могли проверить его вызов
      mockLoginMutation(...args);
      return Promise.resolve({ data: mockAuthResponse });
    });

    mockLogoutTrigger.mockImplementation((...args) => {
      mockLogoutMutation(...args);
      return Promise.resolve({ data: undefined });
    });

    mockRefreshTrigger.mockImplementation((...args) => {
      mockRefreshTokenMutation(...args);
      return Promise.resolve({ data: mockAuthResponse });
    });

    // Мокируем хуки RTK Query
    jest.spyOn(authApi, 'useLoginMutation').mockImplementation(() => mockLoginHook);
    jest.spyOn(authApi, 'useLogoutMutation').mockImplementation(() => mockLogoutHook);
    jest.spyOn(authApi, 'useRefreshTokenMutation').mockImplementation(() => mockRefreshHook);

    // Мокируем вспомогательную функцию
    Object.defineProperty(authApi, 'getErrorMessage', {
      value: mockGetErrorMessage,
    });
  });

  beforeEach(() => {
    // Сбрасываем моки перед каждым тестом
    jest.clearAllMocks();

    // Очищаем localStorage и sessionStorage
    localStorage.clear();
    sessionStorage.clear();
  });

  it('должен возвращать начальное состояние', () => {
    const { result } = renderAuthHook();

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toEqual({
      id: null,
      email: null,
      name: null,
      role: null,
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('должен успешно выполнять вход', async () => {
    // Настраиваем моки для успешного входа, используя прагматичный подход
    mockLoginMutation.mockClear();
    // Настраиваем unwrap метод для возврата нужных данных
    mockLoginTrigger.mockImplementation((...args) => {
      mockLoginMutation(...args);
      return {
        unwrap: () => Promise.resolve(mockAuthResponse),
      };
    });

    const { result } = renderAuthHook();

    // Выполняем вход
    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true,
      });
    });

    // Проверяем, что метод API был вызван с правильными параметрами
    expect(mockLoginMutation).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      rememberMe: true,
    });

    // Проверяем, что состояние было обновлено
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual({
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
      role: mockUser.role,
    });

    // Проверяем, что токен был сохранен в localStorage
    expect(localStorage.getItem('refreshToken')).toBe(mockAuthResponse.refreshToken);
  });

  it('должен сохранять токен в sessionStorage, если rememberMe=false', async () => {
    // Настраиваем моки для успешного входа
    mockLoginMutation.mockClear();
    mockLoginTrigger.mockImplementation((...args) => {
      mockLoginMutation(...args);
      return {
        unwrap: () => Promise.resolve(mockAuthResponse),
      };
    });

    const { result } = renderAuthHook();

    // Выполняем вход с rememberMe=false
    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123',
        rememberMe: false,
      });
    });

    // Проверяем, что токен был сохранен в sessionStorage, а не в localStorage
    expect(localStorage.getItem('refreshToken')).toBe(null);
    expect(sessionStorage.getItem('refreshToken')).toBe(mockAuthResponse.refreshToken);
  });

  it('должен обрабатывать ошибки входа', async () => {
    // Настраиваем мок для ошибки входа
    const errorMessage = 'Неверный email или пароль';
    mockLoginMutation.mockClear();
    mockLoginTrigger.mockImplementation((...args) => {
      mockLoginMutation(...args);
      return {
        unwrap: () => Promise.reject(new Error(errorMessage)),
      };
    });

    const { result } = renderAuthHook();

    // Выполняем вход и ожидаем ошибку
    await expect(
      act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'wrong-password',
          rememberMe: true,
        });
      }),
    ).rejects.toThrow(errorMessage);

    // Проверяем, что состояние содержит ошибку
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('должен успешно выполнять выход', async () => {
    // Настраиваем начальное состояние с аутентифицированным пользователем
    const initialState = {
      auth: {
        isAuthenticated: true,
        userId: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        accessToken: mockAuthResponse.accessToken,
        refreshToken: mockAuthResponse.refreshToken,
        expiresAt: Date.now() + 3600000,
        permissions: [],
        isLoading: false,
        error: null,
      },
    };

    // Сохраняем токен в localStorage
    localStorage.setItem('refreshToken', mockAuthResponse.refreshToken);

    const { result } = renderAuthHook(initialState);

    // Выполняем выход
    await act(async () => {
      await result.current.logout();
    });

    // Проверяем, что метод API был вызван
    expect(mockLogoutMutation).toHaveBeenCalled();

    // Проверяем, что состояние было сброшено
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toEqual({
      id: null,
      email: null,
      name: null,
      role: null,
    });

    // Проверяем, что токен был удален из localStorage
    expect(localStorage.getItem('refreshToken')).toBe(null);
  });

  it('должен корректно проверять роли', () => {
    // Настраиваем начальное состояние с аутентифицированным пользователем
    const initialState = {
      auth: {
        isAuthenticated: true,
        userId: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: Role.User,
        accessToken: mockAuthResponse.accessToken,
        refreshToken: mockAuthResponse.refreshToken,
        expiresAt: Date.now() + 3600000,
        permissions: [],
        isLoading: false,
        error: null,
      },
    };

    const { result } = renderAuthHook(initialState);

    // Проверяем роли
    expect(result.current.hasRole(Role.User)).toBe(true);
    expect(result.current.hasRole(Role.Admin)).toBe(false);
    expect(result.current.hasRole(Role.Manager)).toBe(false);
    expect(result.current.hasRole(Role.Guest)).toBe(false);
  });

  it('должен корректно проверять разрешения', () => {
    // Настраиваем начальное состояние с аутентифицированным пользователем и разрешениями
    const initialState = {
      auth: {
        isAuthenticated: true,
        userId: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: Role.User,
        accessToken: mockAuthResponse.accessToken,
        refreshToken: mockAuthResponse.refreshToken,
        expiresAt: Date.now() + 3600000,
        permissions: ['users:read:own', 'users:update:own'],
        isLoading: false,
        error: null,
      },
    };

    const { result } = renderAuthHook(initialState);

    // Проверяем разрешения
    expect(result.current.hasPermission('users:read:own')).toBe(true);
    expect(result.current.hasPermission('users:update:own')).toBe(true);
    expect(result.current.hasPermission('users:delete:own')).toBe(false);
    expect(result.current.hasPermission('admin:all')).toBe(false);
  });

  it('должен успешно обновлять токен', async () => {
    // Настраиваем мок для успешного обновления токена
    mockRefreshTokenMutation.mockClear();
    mockRefreshTrigger.mockImplementation((...args) => {
      mockRefreshTokenMutation(...args);
      return {
        unwrap: () => Promise.resolve(mockAuthResponse),
      };
    });

    // Сохраняем токен в localStorage
    localStorage.setItem('refreshToken', 'old-refresh-token');

    const { result } = renderAuthHook();

    // Выполняем обновление токена
    await act(async () => {
      await result.current.refreshToken();
    });

    // Проверяем, что метод API был вызван с правильными параметрами
    expect(mockRefreshTokenMutation).toHaveBeenCalledWith({
      refreshToken: 'old-refresh-token',
    });

    // Проверяем, что токен был обновлен в localStorage
    expect(localStorage.getItem('refreshToken')).toBe(mockAuthResponse.refreshToken);
  });

  it('должен обрабатывать ошибки обновления токена', async () => {
    // Настраиваем мок для ошибки обновления токена
    const errorMessage = 'Недействительный токен обновления';
    mockRefreshTokenMutation.mockClear();
    mockRefreshTrigger.mockImplementation((...args) => {
      mockRefreshTokenMutation(...args);
      return {
        unwrap: () => Promise.reject(new Error(errorMessage)),
      };
    });

    // Сохраняем токен в localStorage
    localStorage.setItem('refreshToken', 'invalid-refresh-token');

    const { result } = renderAuthHook();

    // Выполняем обновление токена и ожидаем ошибку
    await expect(
      act(async () => {
        await result.current.refreshToken();
      }),
    ).rejects.toThrow(errorMessage);

    // Проверяем, что токен был удален из localStorage
    expect(localStorage.getItem('refreshToken')).toBe(null);
  });
});
