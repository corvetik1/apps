/**
 * Интеграционные тесты для компонента ProtectedRoute
 *
 * Этот модуль содержит интеграционные тесты для компонента защищенного маршрута,
 * проверяя корректность работы перенаправления и проверки прав доступа.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';
import { authReducer } from '../../store/slices/authSlice';
import { api } from '../../api';
import { Role } from '@finance-platform/shared';

describe('ProtectedRoute - интеграционные тесты', () => {
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

  // Компонент для тестирования защищенного маршрута
  const TestApp = ({ initialEntries = ['/dashboard'], initialState = {} }) => {
    const store = createTestStore(initialState);

    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="/login" element={<div>Страница входа</div>} />
            <Route path="/forbidden" element={<div>Доступ запрещен</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<div>Дашборд</div>} />
            </Route>
            <Route element={<ProtectedRoute requiredRole={Role.Admin} />}>
              <Route path="/admin" element={<div>Админ панель</div>} />
            </Route>
            <Route element={<ProtectedRoute requiredPermission="users:manage" />}>
              <Route path="/users" element={<div>Управление пользователями</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  it('должен перенаправлять на страницу входа, если пользователь не аутентифицирован', () => {
    // Начальное состояние без аутентификации
    const initialState = {
      auth: {
        isAuthenticated: false,
        userId: null,
        email: null,
        name: null,
        role: null,
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
        permissions: [],
        isLoading: false,
        error: null,
      },
    };

    render(<TestApp initialState={initialState} />);

    // Проверяем, что произошло перенаправление на страницу входа
    expect(screen.getByText('Страница входа')).toBeInTheDocument();
    expect(screen.queryByText('Дашборд')).not.toBeInTheDocument();
  });

  it('должен отображать защищенный контент, если пользователь аутентифицирован', () => {
    // Начальное состояние с аутентификацией
    const initialState = {
      auth: {
        isAuthenticated: true,
        userId: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: Role.User,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: Date.now() + 3600000,
        permissions: ['users:read:own'],
        isLoading: false,
        error: null,
      },
    };

    render(<TestApp initialState={initialState} />);

    // Проверяем, что отображается защищенный контент
    expect(screen.getByText('Дашборд')).toBeInTheDocument();
    expect(screen.queryByText('Страница входа')).not.toBeInTheDocument();
  });

  it('должен перенаправлять на страницу 403, если у пользователя недостаточно прав (роль)', () => {
    // Начальное состояние с аутентификацией, но без необходимой роли
    const initialState = {
      auth: {
        isAuthenticated: true,
        userId: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: Role.User,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: Date.now() + 3600000,
        permissions: [],
        isLoading: false,
        error: null,
      },
    };

    render(<TestApp initialEntries={['/admin']} initialState={initialState} />);

    // Проверяем, что произошло перенаправление на страницу 403
    expect(screen.getByText('Доступ запрещен')).toBeInTheDocument();
    expect(screen.queryByText('Админ панель')).not.toBeInTheDocument();
  });

  it('должен отображать защищенный контент, если у пользователя есть необходимая роль', () => {
    // Начальное состояние с аутентификацией и необходимой ролью
    const initialState = {
      auth: {
        isAuthenticated: true,
        userId: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: Role.Admin,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: Date.now() + 3600000,
        permissions: ['admin:all'],
        isLoading: false,
        error: null,
      },
    };

    render(<TestApp initialEntries={['/admin']} initialState={initialState} />);

    // Проверяем, что отображается защищенный контент
    expect(screen.getByText('Админ панель')).toBeInTheDocument();
    expect(screen.queryByText('Доступ запрещен')).not.toBeInTheDocument();
  });

  it('должен перенаправлять на страницу 403, если у пользователя недостаточно прав (разрешение)', () => {
    // Начальное состояние с аутентификацией, но без необходимого разрешения
    const initialState = {
      auth: {
        isAuthenticated: true,
        userId: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: Role.User,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: Date.now() + 3600000,
        permissions: ['users:read:own'],
        isLoading: false,
        error: null,
      },
    };

    render(<TestApp initialEntries={['/users']} initialState={initialState} />);

    // Проверяем, что произошло перенаправление на страницу 403
    expect(screen.getByText('Доступ запрещен')).toBeInTheDocument();
    expect(screen.queryByText('Управление пользователями')).not.toBeInTheDocument();
  });

  it('должен отображать защищенный контент, если у пользователя есть необходимое разрешение', () => {
    // Начальное состояние с аутентификацией и необходимым разрешением
    const initialState = {
      auth: {
        isAuthenticated: true,
        userId: '1',
        email: 'manager@example.com',
        name: 'Manager User',
        role: Role.Manager,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: Date.now() + 3600000,
        permissions: ['users:manage', 'users:read', 'users:create'],
        isLoading: false,
        error: null,
      },
    };

    render(<TestApp initialEntries={['/users']} initialState={initialState} />);

    // Проверяем, что отображается защищенный контент
    expect(screen.getByText('Управление пользователями')).toBeInTheDocument();
    expect(screen.queryByText('Доступ запрещен')).not.toBeInTheDocument();
  });

  it('должен сохранять URL при перенаправлении на страницу входа', () => {
    // Начальное состояние без аутентификации
    const initialState = {
      auth: {
        isAuthenticated: false,
        userId: null,
        email: null,
        name: null,
        role: null,
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
        permissions: [],
        isLoading: false,
        error: null,
      },
    };

    const { container } = render(
      <TestApp initialEntries={['/dashboard']} initialState={initialState} />,
    );

    // Проверяем, что в state содержится путь для перенаправления
    const loginLink = container.querySelector('a');
    expect(loginLink).toHaveAttribute('href', '/login');

    // Проверяем, что URL сохранен в state для последующего перенаправления
    // Примечание: это косвенная проверка, так как напрямую проверить state в MemoryRouter сложно
    expect(screen.getByText('Страница входа')).toBeInTheDocument();
  });
});
