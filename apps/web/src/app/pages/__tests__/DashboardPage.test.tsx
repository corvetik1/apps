/**
 * Тесты для страницы дашборда
 *
 * Этот модуль содержит тесты для компонента страницы дашборда.
 */

import { vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { DashboardPage } from '../DashboardPage';
import * as useAuthModule from '../../../auth/hooks/useAuth';
import { LogoutButton } from '../../../auth/components/LogoutButton';

// Определяем локальные типы для тестов
enum Role {
  Admin = 'admin',
  Manager = 'manager',
  User = 'user',
  Guest = 'guest'
}

interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface AuthResponse {
  token: string;
  refreshToken: string;
  accessToken: string;
  expiresIn: number;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

// Мокируем компоненты и хуки
vi.mock('../../../auth/components/LogoutButton', () => ({
  LogoutButton: vi.fn(() => <button data-testid="logout-button">Выйти</button>),
}));

describe('DashboardPage', () => {
  // Подготовка мока useAuth перед каждым тестом
  beforeEach(() => {
    // Мокируем useAuth согласно прагматичному подходу
    vi.spyOn(useAuthModule, 'useAuth').mockImplementation(() => ({
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
      },
      isAuthenticated: true,
      isAdmin: false,
      isManager: false,
      // Добавляем недостающие поля
      role: Role.User,
      permissions: ['read:dashboard', 'read:transactions'],
      isLoading: false,
      error: null,
      hasRole: vi.fn((requiredRole) => requiredRole === Role.User),
      hasPermission: vi.fn(() => true),
      
      // Правильно типизируем мок-функции с приведением к unknown
      login: vi.fn(() => Promise.resolve({ 
        token: 'token', 
        refreshToken: 'refresh-token',
        accessToken: 'access-token',
        expiresIn: 3600,
        user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'user' } 
      })) as unknown as (credentials: LoginRequest) => Promise<AuthResponse>,
      
      logout: vi.fn(() => Promise.resolve()) as unknown as () => Promise<void>,
      
      refreshToken: vi.fn(() => Promise.resolve({ 
        token: 'new-token', 
        refreshToken: 'new-refresh-token',
        accessToken: 'new-access-token',
        expiresIn: 3600, 
        user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'user' } 
      })) as unknown as () => Promise<AuthResponse>,
    }));

    // Очищаем моки после каждого теста
    vi.clearAllMocks();
  });

  it('должен отрендерить страницу дашборда с информацией о пользователе', () => {
    // Рендерим компонент
    render(<DashboardPage />);

    // Проверяем заголовок
    const header = screen.getByText('Дашборд');
    expect(header).toBeTruthy();

    // Проверяем имя пользователя
    const userName = screen.getByText('Test User');
    expect(userName).toBeTruthy();

    // Проверяем наличие кнопки выхода
    const logoutButton = screen.getByTestId('logout-button');
    expect(logoutButton).toBeTruthy();
    expect(LogoutButton).toHaveBeenCalled();
  });

  it('должен отрендерить разделы дашборда', () => {
    // Рендерим компонент
    render(<DashboardPage />);

    // Проверяем наличие разделов
    const analyticSection = screen.getByText('Аналитика');
    expect(analyticSection).toBeTruthy();

    const transactionsSection = screen.getByText('Последние транзакции');
    expect(transactionsSection).toBeTruthy();

    const tendersSection = screen.getByText('Активные тендеры');
    expect(tendersSection).toBeTruthy();

    // Проверяем наличие описаний для разделов
    expect(screen.getByText(/Здесь будет отображаться аналитика/)).toBeTruthy();
    expect(screen.getByText(/Здесь будет список последних транзакций/)).toBeTruthy();
    expect(screen.getByText(/Здесь будет список активных тендеров/)).toBeTruthy();
  });

  it('должен использовать хук useAuth для получения данных пользователя', () => {
    // Рендерим компонент
    render(<DashboardPage />);

    // Проверяем, что хук useAuth был вызван
    expect(useAuthModule.useAuth).toHaveBeenCalled();
  });
});
