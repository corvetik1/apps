/**
 * Тесты для хука useAuth
 *
 * Этот модуль содержит тесты для хука аутентификации,
 * проверяя корректность работы методов входа, выхода и проверки прав.
 */

import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { useAuth } from '../useAuth';
import { authReducer, logout, loginSuccess } from '../../../store/slices/authSlice';
import { authApi } from '../../../api/authApi';
import { RootState, store } from '../../../store';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { api } from '../../../api';

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
  const mockLoginTrigger = vi.fn();
  const mockLogoutTrigger = vi.fn();
  const mockRefreshTrigger = vi.fn();

  // Моки для localStorage и sessionStorage
  let localStorageMock: Record<string, string>;
  let sessionStorageMock: Record<string, string>;

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
    vi.spyOn(authApi, 'useLoginMutation').mockImplementation(() => [
      mockLoginTrigger,
      { isLoading: false, reset: vi.fn() },
    ] as any);
    vi.spyOn(authApi, 'useLogoutMutation').mockImplementation(() => [
      mockLogoutTrigger,
      { isLoading: false, reset: vi.fn() },
    ] as any);
    vi.spyOn(authApi, 'useRefreshTokenMutation').mockImplementation(() => [
      mockRefreshTrigger,
      { isLoading: false, reset: vi.fn() },
    ] as any);

    // Мокируем localStorage
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: vi.fn((key: string) => localStorageMock[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          localStorageMock[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
          delete localStorageMock[key];
        }),
        clear: vi.fn(() => {
          localStorageMock = {};
        }),
      },
      writable: true,
    });

    // Мокируем sessionStorage
    Object.defineProperty(global, 'sessionStorage', {
      value: {
        getItem: vi.fn((key: string) => sessionStorageMock[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          sessionStorageMock[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
          delete sessionStorageMock[key];
        }),
        clear: vi.fn(() => {
          sessionStorageMock = {};
        }),
      },
      writable: true,
    });
  });

  // Очистка перед каждым тестом
  beforeEach(() => {
    // Сбрасываем моки перед каждым тестом
    vi.clearAllMocks();

    // Очищаем localStorage и sessionStorage перед каждым тестом
    localStorage.clear();
    sessionStorage.clear();

    // Настраиваем возвращаемые значения для триггеров мутаций
    mockLoginTrigger.mockImplementation((_args) => {
      return Promise.resolve<AuthResponse>({
        user: { id: 'test-user-id', email: 'test@example.com', name: 'Test User', role: Role.User },
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        expiresIn: 3600,
      });
    });

    mockLogoutTrigger.mockImplementation((_args) => {
      return Promise.resolve({}); // Успешный выход обычно не возвращает тело
    });

    mockRefreshTrigger.mockImplementation((_args) => {
      return Promise.resolve<AuthResponse>({
        user: { id: 'test-user-id', email: 'test@example.com', name: 'Test User', role: Role.User },
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresIn: 3600,
      });
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

    const credentials = {
      email: 'test@example.com',
      password: 'password123',
      rememberMe: true,
    };

    await act(async () => {
      await result.current.login(credentials);
    });

    expect(mockLoginTrigger).toHaveBeenCalledWith(credentials);
  });

  it('должен успешно выполнять вход с rememberMe=false', async () => {
    const { result } = renderAuthHook();

    const credentials = {
      email: 'test@example.com',
      password: 'password123',
      rememberMe: false,
    };

    await act(async () => {
      await result.current.login(credentials);
    });

    expect(mockLoginTrigger).toHaveBeenCalledWith(credentials);
  });

  it('должен обрабатывать ошибки при входе', async () => {
    const errorMessage = 'Неверные учетные данные';
    mockLoginTrigger.mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));

    const { result } = renderAuthHook();
    const credentials = { email: 'test@example.com', password: 'wrong-password', rememberMe: false };
    let capturedError: Error | null = null;

    await act(async () => {
      try {
        await result.current.login(credentials);
      } catch (e) {
        capturedError = e as Error;
      }
    });

    expect(mockLoginTrigger).toHaveBeenCalledWith(credentials);
    expect(result.current.error).toBe(errorMessage);
  });

  it('должен успешно выполнять выход', async () => {
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

    localStorage.setItem('refreshToken', mockAuthResponse.refreshToken);

    const { result } = renderAuthHook(initialState);

    expect(result.current.isAuthenticated).toBe(true);

    await act(async () => {
      await result.current.logout();
    });

    expect(mockLogoutTrigger).toHaveBeenCalled();
    expect(localStorage.getItem('refreshToken')).toBe(null);
    expect(sessionStorage.getItem('refreshToken')).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('должен обрабатывать ошибки при выходе', async () => {
    mockLogoutTrigger.mockImplementationOnce(() => Promise.reject(new Error('Logout failed')));

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

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());

    const { result } = renderAuthHook(initialState);

    await act(async () => {
      await result.current.logout();
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('должен успешно обновлять токен из localStorage', async () => {
    localStorage.setItem('refreshToken', 'old-refresh-token');
    const { result } = renderAuthHook();

    await act(async () => {
      await result.current.refreshToken();
    });

    expect(mockRefreshTrigger).toHaveBeenCalledWith({
      refreshToken: 'old-refresh-token',
    });
    expect(localStorage.getItem('refreshToken')).toBe('new-refresh-token');
  });

  it('должен успешно обновлять токен из sessionStorage', async () => {
    sessionStorage.setItem('refreshToken', 'old-refresh-token');
    const { result } = renderAuthHook();

    await act(async () => {
      await result.current.refreshToken();
    });

    expect(mockRefreshTrigger).toHaveBeenCalledWith({
      refreshToken: 'old-refresh-token',
    });
    expect(sessionStorage.getItem('refreshToken')).toBe('new-refresh-token');
  });

  it('должен выбрасывать ошибку при отсутствии refreshToken', async () => {
    const { result } = renderAuthHook();
    let capturedError: Error | null = null;

    await act(async () => {
      try {
        await result.current.refreshToken();
      } catch (e) {
        capturedError = e as Error;
      }
    });

    expect(capturedError).not.toBeNull();
    expect(capturedError?.message).toBe('Отсутствует refreshToken');
    expect(mockRefreshTrigger).not.toHaveBeenCalled();
  });

  it('должен правильно определять роль администратора', () => {
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

    expect(result.current.hasRole(Role.Admin)).toBe(true);
    expect(result.current.hasRole(Role.Manager)).toBe(true);
    expect(result.current.hasRole(Role.User)).toBe(true);
  });

  it('должен правильно определять роль менеджера', () => {
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

    expect(result.current.hasRole(Role.Admin)).toBe(false);
    expect(result.current.hasRole(Role.Manager)).toBe(true);
    expect(result.current.hasRole(Role.User)).toBe(true);
  });

  it('должен правильно проверять разрешения', () => {
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

    expect(result.current.hasPermission('read:posts')).toBe(true);
    expect(result.current.hasPermission('write:comments')).toBe(true);
    expect(result.current.hasPermission('delete:posts')).toBe(false);
  });

  it('должен возвращать false для hasPermission у неаутентифицированного пользователя', () => {
    const { result } = renderAuthHook();

    expect(result.current.hasPermission('any-permission')).toBe(false);
  });

  it('должен обрабатывать ошибки при обновлении токена', async () => {
    const errorMessage = 'Недействительный токен';
    mockRefreshTrigger.mockImplementationOnce(() =>
      Promise.reject(new Error(errorMessage)),
    );

    const { result } = renderAuthHook();
    let capturedError: Error | null = null;

    localStorage.setItem('refreshToken', 'fake-token-to-trigger-api-call');

    await act(async () => {
      try {
        await result.current.refreshToken();
      } catch (e) {
        capturedError = e as Error;
      }
    });

    expect(capturedError).not.toBeNull();
    expect(capturedError?.message).toBe(errorMessage);
    expect(mockRefreshTrigger).toHaveBeenCalledWith({ refreshToken: 'fake-token-to-trigger-api-call' });
    expect(result.current.error).toBe(errorMessage);
  });
});
