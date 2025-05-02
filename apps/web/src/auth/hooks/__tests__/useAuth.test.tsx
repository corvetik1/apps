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

// Примечание: в реальном коде используется функция getErrorMessage из модуля authApi
// В тестах мы не мокируем эту функцию, так как она вызывается внутри хука useAuth

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
  });

  // Сбрасываем моки перед каждым тестом
  beforeEach(() => {
    // Очищаем моки перед каждым тестом
    jest.clearAllMocks();
    // Очищаем localStorage и sessionStorage
    localStorage.clear();
    sessionStorage.clear();
  });

  it('должен возвращать правильное начальное состояние для неаутентифицированного пользователя', () => {
    const { result } = renderAuthHook();

    // Проверяем начальное состояние
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toEqual({
      id: null,
      email: null,
      name: null,
      role: null,
    });
    expect(result.current.permissions).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('должен успешно выполнять вход', async () => {
    const { result } = renderAuthHook();

    // Данные для входа
    const credentials = {
      email: 'test@example.com',
      password: 'password123',
      rememberMe: true,
    };

    // Выполняем вход
    await act(async () => {
      await result.current.login(credentials);
    });

    // Проверяем, что метод API был вызван с правильными параметрами
    expect(mockLoginMutation).toHaveBeenCalledWith(credentials);

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

  it('должен обрабатывать ошибки при входе', async () => {
    const errorMessage = 'Неверные учетные данные';
    
    // Переопределяем мок для этого теста
    mockLoginTrigger.mockImplementation((...args) => {
      mockLoginMutation(...args);
      return {
        unwrap: () => Promise.reject(new Error(errorMessage)),
      };
    });

    const { result } = renderAuthHook();

    // Данные для входа
    const credentials = {
      email: 'test@example.com',
      password: 'wrong-password',
      rememberMe: false,
    };

    // Пытаемся выполнить вход и ожидаем ошибку
    await act(async () => {
      try {
        await result.current.login(credentials);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        // Ожидаем ошибку, но не делаем ничего с ней
        // Это предотвращает предупреждение об неперехваченном исключении
      }
    });

    // Проверяем, что метод API был вызван с правильными параметрами
    expect(mockLoginMutation).toHaveBeenCalledWith(credentials);

    // Проверяем, что состояние содержит ошибку
    expect(result.current.error).toBe(errorMessage);
    
    // Проверяем, что пользователь не аутентифицирован
    expect(result.current.isAuthenticated).toBe(false);
    
    // Проверяем, что флаг загрузки сброшен
    expect(result.current.isLoading).toBe(false);
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

    // Проверяем, что токен действительно сохранен перед тестом
    expect(localStorage.getItem('refreshToken')).toBe(mockAuthResponse.refreshToken);

    const { result } = renderAuthHook(initialState);

    // Проверяем начальное состояние
    expect(result.current.isAuthenticated).toBe(true);

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
    // Используем toBeFalsy() вместо toBe(null), так как getItem возвращает null или string
    expect(localStorage.getItem('refreshToken')).toBeFalsy();
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
        role: mockUser.role,
        accessToken: mockAuthResponse.accessToken,
        refreshToken: mockAuthResponse.refreshToken,
        expiresAt: Date.now() + 3600000,
        permissions: ['read:users', 'write:posts'],
        isLoading: false,
        error: null,
      },
    };

    const { result } = renderAuthHook(initialState);

    // Проверяем разрешения
    expect(result.current.hasPermission('read:users')).toBe(true);
    expect(result.current.hasPermission('write:posts')).toBe(true);
    expect(result.current.hasPermission('delete:users')).toBe(false);
  });

  it('должен успешно обновлять токен', async () => {
    // Настраиваем начальное состояние с аутентифицированным пользователем
    const initialState = {
      auth: {
        isAuthenticated: true,
        userId: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        accessToken: 'old-access-token',
        refreshToken: 'old-refresh-token',
        expiresAt: Date.now() - 1000, // Токен уже истек
        permissions: [],
        isLoading: false,
        error: null,
      },
    };

    // Сохраняем токен в localStorage
    localStorage.setItem('refreshToken', 'old-refresh-token');

    const { result } = renderAuthHook(initialState);

    // Выполняем обновление токена
    await act(async () => {
      await result.current.refreshToken();
    });

    // Проверяем, что метод API был вызван с правильными параметрами
    expect(mockRefreshTokenMutation).toHaveBeenCalledWith({
      refreshToken: 'old-refresh-token',
    });

    // Проверяем, что состояние было обновлено
    expect(result.current.user).toEqual({
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
      role: mockUser.role,
    });

    // Проверяем, что токен был обновлен в localStorage
    expect(localStorage.getItem('refreshToken')).toBe(mockAuthResponse.refreshToken);
  });

  it('должен обрабатывать ошибки при обновлении токена', async () => {
    const errorMessage = 'Недействительный токен обновления';
    
    // Переопределяем мок для этого теста
    mockRefreshTrigger.mockImplementation((...args) => {
      mockRefreshTokenMutation(...args);
      return {
        unwrap: () => Promise.reject(new Error(errorMessage)),
      };
    });

    // Настраиваем начальное состояние с аутентифицированным пользователем
    const initialState = {
      auth: {
        isAuthenticated: true,
        userId: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        accessToken: 'old-access-token',
        refreshToken: 'invalid-refresh-token',
        expiresAt: Date.now() - 1000, // Токен уже истек
        permissions: [],
        isLoading: false,
        error: null,
      },
    };

    // Сохраняем токен в localStorage
    localStorage.setItem('refreshToken', 'invalid-refresh-token');

    const { result } = renderAuthHook(initialState);

    // Пытаемся обновить токен и ожидаем ошибку
    await act(async () => {
      try {
        await result.current.refreshToken();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        // Ожидаем ошибку, но не делаем ничего с ней
        // Это предотвращает предупреждение об неперехваченном исключении
      }
    });

    // Проверяем, что метод API был вызван с правильными параметрами
    expect(mockRefreshTokenMutation).toHaveBeenCalledWith({
      refreshToken: 'invalid-refresh-token',
    });

    // TODO: Добавить проверку на наличие ошибки в состоянии
  });
});
