/**
 * Тесты для компонента LogoutButton
 *
 * Этот модуль содержит тесты для компонента кнопки выхода из системы,
 * проверяя корректность отображения и взаимодействия.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '../../../store/slices/authSlice';
import { api } from '../../../api';
import { LogoutButton } from '../LogoutButton';
import * as authHooks from '../../hooks/useAuth';
import '@testing-library/jest-dom'; // Базовые матчеры Jest

// Типы для моков
type Role = 'admin' | 'user' | 'manager';

interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

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

// Мок для хука useAuth
// Типизированные моки функций
const mockLogout = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);
const mockLogin = jest.fn<(loginRequest: LoginRequest) => Promise<AuthResponse>>().mockResolvedValue({} as AuthResponse);
const mockRefreshToken = jest.fn<() => Promise<AuthResponse>>().mockResolvedValue({} as AuthResponse);
const mockHasPermission = jest.fn<(permission: string) => boolean>().mockReturnValue(true);
const mockHasRole = jest.fn<(role: Role) => boolean>().mockReturnValue(true);

const mockAuthHook = {
  isAuthenticated: true,
  isLoading: false,
  user: { id: '1', email: 'test@example.com', name: 'Test User', role: 'user' as Role },
  role: 'user' as Role,
  permissions: ['read', 'write'],
  error: null,
  login: mockLogin as unknown as (credentials: LoginRequest) => Promise<AuthResponse>,
  logout: mockLogout as unknown as () => Promise<void>,
  refreshToken: mockRefreshToken as unknown as () => Promise<AuthResponse>,
  hasPermission: mockHasPermission as unknown as (permission: string) => boolean,
  hasRole: mockHasRole as unknown as (requiredRole: Role) => boolean,
};

jest.spyOn(authHooks, 'useAuth').mockImplementation(() => mockAuthHook);

describe('LogoutButton', () => {
  // Настройка хранилища Redux для тестов
  const store = configureStore({
    reducer: {
      auth: authReducer,
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });

  beforeEach(() => {
    // Сбрасываем моки перед каждым тестом
    jest.clearAllMocks();
  });

  it('должен отображаться корректно', () => {
    render(
      <Provider store={store}>
        <LogoutButton />
      </Provider>
    );

    // Проверяем, что кнопка отображается
    const logoutButton = screen.getByRole('button');
    expect(logoutButton).toBeTruthy();
    expect(logoutButton.textContent).toBe('Выйти');
  });

  it('должен вызывать метод logout при клике', async () => {
    // Перед каждым тестом сбрасываем вызовы моков
    mockLogout.mockClear();
    
    render(
      <Provider store={store}>
        <LogoutButton />
      </Provider>
    );

    // Находим кнопку и кликаем по ней
    const logoutButton = screen.getByRole('button');
    await fireEvent.click(logoutButton);

    // Проверяем, что метод logout был вызван
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
  
  it('должен вызывать onSuccess после успешного выхода', async () => {
    // Мок функции onSuccess
    const mockOnSuccess = jest.fn<() => void>();
    mockLogout.mockResolvedValueOnce(undefined);
    
    render(
      <Provider store={store}>
        <LogoutButton onSuccess={mockOnSuccess} />
      </Provider>
    );

    // Находим кнопку и кликаем по ней
    const logoutButton = screen.getByRole('button');
    await fireEvent.click(logoutButton);

    // Проверяем, что метод onSuccess был вызван
    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
  });
  
  it('должен обрабатывать ошибки при выходе', async () => {
    // Мокируем ошибку при выходе
    const mockError = new Error('Ошибка при выходе');
    mockLogout.mockRejectedValueOnce(mockError as unknown as void);
    
    // Мокируем console.error для проверки вызова
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {/* пустая реализация */});
    
    render(
      <Provider store={store}>
        <LogoutButton />
      </Provider>
    );

    // Находим кнопку и кликаем по ней
    const logoutButton = screen.getByRole('button');
    await fireEvent.click(logoutButton);

    // Проверяем, что ошибка была обработана
    expect(consoleErrorSpy).toHaveBeenCalledWith('Ошибка выхода:', mockError);
    
    // Восстанавливаем оригинальный console.error
    consoleErrorSpy.mockRestore();
  });

  it('должен быть отключен во время загрузки', () => {
    // Переопределяем мок для имитации состояния загрузки
    const loadingMockAuthHook = {
      ...mockAuthHook,
      isLoading: true
    };
    
    jest.spyOn(authHooks, 'useAuth').mockImplementationOnce(() => loadingMockAuthHook);

    render(
      <Provider store={store}>
        <LogoutButton />
      </Provider>
    );

    // Проверяем, что кнопка отключена
    const logoutButton = screen.getByRole('button');
    expect(logoutButton.hasAttribute('disabled')).toBe(true);
  });

  it('должен отображать текст "Выход..." во время загрузки', () => {
    // Переопределяем мок для имитации состояния загрузки
    const loadingMockAuthHook = {
      ...mockAuthHook,
      isLoading: true
    };
    
    jest.spyOn(authHooks, 'useAuth').mockImplementationOnce(() => loadingMockAuthHook);

    render(
      <Provider store={store}>
        <LogoutButton />
      </Provider>
    );

    // Проверяем, что текст кнопки изменился
    const logoutButton = screen.getByRole('button');
    expect(logoutButton.textContent).toBe('Выход...');
  });
  
  it('должен принимать пользовательский текст кнопки', () => {
    const customText = 'Завершить сессию';
    
    render(
      <Provider store={store}>
        <LogoutButton text={customText} />
      </Provider>
    );

    // Проверяем, что кнопка отображает пользовательский текст
    const logoutButton = screen.getByRole('button');
    expect(logoutButton.innerHTML).toBe(customText);
  });
  
  it('должен применять пользовательский класс стилей', () => {
    const customClassName = 'custom-logout-button';
    
    render(
      <Provider store={store}>
        <LogoutButton className={customClassName} />
      </Provider>
    );

    // Проверяем, что кнопка имеет пользовательский класс
    const logoutButton = screen.getByRole('button');
    expect(logoutButton.className.includes(customClassName)).toBe(true);
  });
});
