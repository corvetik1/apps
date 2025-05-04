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

// Используемый в тестах интерфейс запроса на вход
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Интерфейс для ответа аутентификации
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

describe('useAuth хук', () => {
  // Моки для API функций
  const mockLoginMutation = jest.fn();
  const mockLogoutMutation = jest.fn();
  const mockRefreshTokenMutation = jest.fn();

  // Моки для хуков RTK Query
  const mockLoginTrigger = jest.fn();
  const mockLogoutTrigger = jest.fn();
  const mockRefreshTrigger = jest.fn();

  // Моки для localStorage и sessionStorage
  let localStorageMock: Record<string, string> = {};
  let sessionStorageMock: Record<string, string> = {};

  // Тестовые данные
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

  // Настройка перед всеми тестами
  beforeAll(() => {
    // Мокируем хуки RTK Query с прагматичным подходом к типизации
    jest.spyOn(authApi, 'useLoginMutation').mockImplementation(() => [
      mockLoginTrigger,
      { isLoading: false, reset: jest.fn() },
    ] as any);
    jest.spyOn(authApi, 'useLogoutMutation').mockImplementation(() => [
      mockLogoutTrigger,
      { isLoading: false, reset: jest.fn() },
    ] as any);
    jest.spyOn(authApi, 'useRefreshTokenMutation').mockImplementation(() => [
      mockRefreshTrigger,
      { isLoading: false, reset: jest.fn() },
    ] as any);

    // Мокируем localStorage
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => localStorageMock[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          localStorageMock[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
          delete localStorageMock[key];
        }),
        clear: jest.fn(() => {
          localStorageMock = {};
        }),
      },
      writable: true,
    });

    // Мокируем sessionStorage
    Object.defineProperty(global, 'sessionStorage', {
      value: {
        getItem: jest.fn((key: string) => sessionStorageMock[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          sessionStorageMock[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
          delete sessionStorageMock[key];
        }),
        clear: jest.fn(() => {
          sessionStorageMock = {};
        }),
      },
      writable: true,
    });
  });

  // Очистка перед каждым тестом
  beforeEach(() => {
    // Сбрасываем состояние моков
    mockLoginMutation.mockReset();
    mockLogoutMutation.mockReset();
    mockRefreshTokenMutation.mockReset();
    mockLoginTrigger.mockReset();
    mockLogoutTrigger.mockReset();
    mockRefreshTrigger.mockReset();

    // Настраиваем результаты вызовов моков
    mockLoginTrigger.mockImplementation((credentials) => {
      mockLoginMutation(credentials);
      return {
        unwrap: () => Promise.resolve(mockAuthResponse),
      };
    });

    mockLogoutTrigger.mockImplementation((args) => {
      mockLogoutMutation(args);
      return {
        unwrap: () => Promise.resolve({}),
      };
    });

    mockRefreshTrigger.mockImplementation((args) => {
      mockRefreshTokenMutation(args);
      return {
        unwrap: () => Promise.resolve(mockAuthResponse),
      };
    });

    // Очищаем хранилища
    localStorageMock = {};
    sessionStorageMock = {};
  });

  // Функция для создания тестового хранилища Redux
  const createTestStore = (initialState = {}) => {
    return configureStore({
      reducer: {
        auth: authReducer,
        [api.reducerPath]: api.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
      preloadedState: initialState,
    });
  };

  // Функция для рендеринга хука с Redux Provider
  const renderAuthHook = (initialState = {}) => {
    const store = createTestStore(initialState);
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );
    return renderHook(() => useAuth(), { wrapper });
  };

  // ТЕСТЫ

  it('должен возвращать правильное начальное состояние неаутентифицированного пользователя', () => {
    const { result } = renderAuthHook();

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

  it('должен успешно выполнять вход с rememberMe=true', async () => {
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

    // Проверяем, что API вызвана с правильными параметрами
    expect(mockLoginMutation).toHaveBeenCalledWith(credentials);

    // Проверяем, что токен сохранен в localStorage
    expect(localStorage.getItem('refreshToken')).toBe(mockAuthResponse.refreshToken);
    expect(sessionStorage.getItem('refreshToken')).toBe(null);
  });

  it('должен успешно выполнять вход с rememberMe=false', async () => {
    const { result } = renderAuthHook();

    // Данные для входа
    const credentials = {
      email: 'test@example.com',
      password: 'password123',
      rememberMe: false,
    };

    // Выполняем вход
    await act(async () => {
      await result.current.login(credentials);
    });

    // Проверяем, что API вызвана с правильными параметрами
    expect(mockLoginMutation).toHaveBeenCalledWith(credentials);

    // Проверяем, что токен сохранен в sessionStorage
    expect(localStorage.getItem('refreshToken')).toBe(null);
    expect(sessionStorage.getItem('refreshToken')).toBe(mockAuthResponse.refreshToken);
  });

  it('должен обрабатывать ошибки при входе', async () => {
    const errorMessage = 'Неверные учетные данные';
    
    // Переопределяем мок для симуляции ошибки
    mockLoginTrigger.mockImplementation((credentials) => {
      mockLoginMutation(credentials);
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

    // Пытаемся выполнить вход с ожиданием ошибки
    await act(async () => {
      try {
        await result.current.login(credentials);
      } catch {
        // Ожидаем ошибку, но не делаем с ней ничего в тесте
      }
    });

    // Проверяем, что API была вызвана
    expect(mockLoginMutation).toHaveBeenCalledWith(credentials);
    
    // Проверяем, что ошибка установлена
    expect(result.current.error).toBeTruthy();
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

    // Устанавливаем токен в localStorage
    localStorage.setItem('refreshToken', mockAuthResponse.refreshToken);

    const { result } = renderAuthHook(initialState);

    // Проверяем начальное состояние
    expect(result.current.isAuthenticated).toBe(true);

    // Выполняем выход
    await act(async () => {
      await result.current.logout();
    });

    // Проверяем, что API была вызвана
    expect(mockLogoutMutation).toHaveBeenCalled();

    // Проверяем, что токен был удален из хранилищ
    expect(localStorage.getItem('refreshToken')).toBe(null);
    expect(sessionStorage.getItem('refreshToken')).toBe(null);

    // Проверяем, что пользователь разлогинен
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('должен обрабатывать ошибки при выходе', async () => {
    // Имитируем ошибку при выходе
    mockLogoutTrigger.mockImplementation(() => {
      mockLogoutMutation();
      return {
        unwrap: () => Promise.reject(new Error('Ошибка выхода')),
      };
    });

    // Мокируем console.error чтобы избежать вывода ошибки в тестах
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(jest.fn());

    // Настраиваем состояние с аутентифицированным пользователем
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

    const { result } = renderAuthHook(initialState);

    // Выполняем выход
    await act(async () => {
      await result.current.logout();
    });

    // Проверяем, что console.error был вызван
    expect(consoleErrorSpy).toHaveBeenCalled();

    // Восстанавливаем оригинальный console.error
    consoleErrorSpy.mockRestore();
  });

  it('должен успешно обновлять токен из localStorage', async () => {
    // Устанавливаем токен в localStorage
    localStorage.setItem('refreshToken', 'old-refresh-token');

    const { result } = renderAuthHook();

    // Выполняем обновление токена
    await act(async () => {
      await result.current.refreshToken();
    });

    // Проверяем, что API была вызвана с правильными параметрами
    expect(mockRefreshTokenMutation).toHaveBeenCalledWith({
      refreshToken: 'old-refresh-token',
    });

    // Проверяем, что новый токен сохранен в localStorage
    expect(localStorage.getItem('refreshToken')).toBe(mockAuthResponse.refreshToken);
  });

  it('должен успешно обновлять токен из sessionStorage', async () => {
    // Устанавливаем токен в sessionStorage
    sessionStorage.setItem('refreshToken', 'old-refresh-token');

    const { result } = renderAuthHook();

    // Выполняем обновление токена
    await act(async () => {
      await result.current.refreshToken();
    });

    // Проверяем, что API была вызвана с правильными параметрами
    expect(mockRefreshTokenMutation).toHaveBeenCalledWith({
      refreshToken: 'old-refresh-token',
    });

    // Проверяем, что новый токен сохранен в sessionStorage, а не в localStorage
    expect(sessionStorage.getItem('refreshToken')).toBe(mockAuthResponse.refreshToken);
    expect(localStorage.getItem('refreshToken')).toBe(null);
  });

  it('должен выбрасывать ошибку при отсутствии refreshToken', async () => {
    const { result } = renderAuthHook();
    let capturedError = null as unknown as Error;

    // Выполняем обновление токена и ожидаем ошибку
    await act(async () => {
      try {
        await result.current.refreshToken();
        // Если мы дошли до этой строки, тест должен провалиться
        expect(true).toBe(false);
      } catch (error: unknown) {
        capturedError = error instanceof Error ? error : new Error(String(error));
      }
    });

    // Проверяем, что ошибка была получена и имеет правильное сообщение
    expect(capturedError).not.toBeNull();
    expect(capturedError.message).toBe('Отсутствует refreshToken');
    
    // Проверяем, что API не была вызвана
    expect(mockRefreshTokenMutation).not.toHaveBeenCalled();
  });

  it('должен правильно определять роль администратора', () => {
    // Настраиваем состояние с ролью администратора
    const adminState = {
      auth: {
        isAuthenticated: true,
        userId: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: Role.Admin,
        permissions: [],
        isLoading: false,
        error: null,
      },
    };

    const { result } = renderAuthHook(adminState);

    // Администратор имеет доступ ко всем ролям
    expect(result.current.hasRole(Role.Admin)).toBe(true);
    expect(result.current.hasRole(Role.Manager)).toBe(true);
    expect(result.current.hasRole(Role.User)).toBe(true);
  });

  it('должен правильно определять роль менеджера', () => {
    // Настраиваем состояние с ролью менеджера
    const managerState = {
      auth: {
        isAuthenticated: true,
        userId: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: Role.Manager,
        permissions: [],
        isLoading: false,
        error: null,
      },
    };

    const { result } = renderAuthHook(managerState);

    // Менеджер имеет доступ ко всем ролям, кроме admin
    expect(result.current.hasRole(Role.Admin)).toBe(false);
    expect(result.current.hasRole(Role.Manager)).toBe(true);
    expect(result.current.hasRole(Role.User)).toBe(true);
  });

  it('должен правильно проверять разрешения', () => {
    // Настраиваем состояние с разрешениями
    const stateWithPermissions = {
      auth: {
        isAuthenticated: true,
        userId: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: Role.User,
        permissions: ['read:posts', 'write:comments'],
        isLoading: false,
        error: null,
      },
    };

    const { result } = renderAuthHook(stateWithPermissions);

    // Проверяем наличие разрешений
    expect(result.current.hasPermission('read:posts')).toBe(true);
    expect(result.current.hasPermission('write:comments')).toBe(true);
    expect(result.current.hasPermission('delete:posts')).toBe(false);
  });

  it('должен возвращать false для hasPermission у неаутентифицированного пользователя', () => {
    const { result } = renderAuthHook(); // Пустое состояние = неаутентифицирован

    expect(result.current.hasPermission('any-permission')).toBe(false);
  });

  it('должен обрабатывать ошибки при обновлении токена', async () => {
    const errorMessage = 'Недействительный токен';
    let capturedError = null as unknown as Error;
    
    // Устанавливаем токен в localStorage
    localStorage.setItem('refreshToken', 'invalid-token');
    
    // Мокируем ошибку при обновлении токена
    mockRefreshTrigger.mockImplementation((args) => {
      mockRefreshTokenMutation(args);
      return {
        unwrap: () => Promise.reject(new Error(errorMessage)),
      };
    });

    const { result } = renderAuthHook();

    // Выполняем обновление токена и ожидаем ошибку
    await act(async () => {
      try {
        await result.current.refreshToken();
        // Если мы дошли до этой строки, тест должен провалиться
        expect(true).toBe(false);
      } catch (error: unknown) {
        capturedError = error instanceof Error ? error : new Error(String(error));
      }
    });

    // Проверяем, что ошибка была получена и имеет правильное сообщение
    expect(capturedError).not.toBeNull();
    expect(capturedError.message).toBe(errorMessage);
    
    // Проверяем, что API была вызвана
    expect(mockRefreshTokenMutation).toHaveBeenCalled();
    
    // Проверяем, что error установлен в состоянии
    expect(result.current.error).toBeTruthy();
  });
});

