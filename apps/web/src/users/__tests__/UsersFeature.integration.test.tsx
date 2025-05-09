/**
 * Интеграционные тесты для модуля пользователей
 *
 * Этот файл содержит тесты для проверки полного цикла работы с пользователями,
 * включая маршрутизацию, доступ на основе ролей, и взаимодействие с API.
 */

// Используем глобальные объекты из Vitest, которые доступны через vitest-setup.ts
// Это позволяет избежать проблем с импортом в CommonJS модулях

// Явно импортируем только vi для мокирования
import { vi } from 'vitest';
import type { Mock } from 'vitest';

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
// Импорт API удален, так как мы используем динамический импорт в тестах
import { authReducer, AuthState } from '../../store/slices/authSlice';

// Мокируем shared модуль
vi.mock('@finance-platform/shared', () => {
  const mockRole = {
    Admin: 'admin',
    Manager: 'manager',
    User: 'user',
    Accountant: 'accountant',
    Guest: 'guest'
  };
  
  return {
    Role: mockRole,
    __esModule: true
  };
});

import { UsersPage } from '../pages/UsersPage';
import { App } from '../../app/app';

const mockRole = {
  Admin: 'admin',
  Manager: 'manager',
  User: 'user',
  Accountant: 'accountant',
  Guest: 'guest'
};

// Мокируем хук useAbility
vi.mock('../../permissions/abilities', () => ({
  useAbility: vi.fn().mockReturnValue({
    can: vi.fn().mockReturnValue(true)
  }),
  __esModule: true,
  default: {}
}));

// Мокируем хук useAuth
vi.mock('../../auth/hooks/useAuth', () => ({
  useAuth: vi.fn().mockReturnValue({
    isAuthenticated: true,
    user: {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin'
    },
    login: vi.fn(),
    logout: vi.fn(),
    refreshToken: vi.fn()
  }),
  __esModule: true,
  default: {}
}));

// Мокируем API
vi.mock('../../api', () => {
  const mockGetUsers = vi.fn();
  const mockCreateUser = vi.fn();
  const mockUpdateUser = vi.fn();
  const mockDeleteUser = vi.fn();
  
  const mockApi = {
    api: {
      reducerPath: 'api',
      reducer: {},
      middleware: vi.fn(() => vi.fn()),
      endpoints: {
        getUsers: {
          useQuery: mockGetUsers.mockReturnValue({
            data: {
              items: [
                {
                  id: '1',
                  name: 'Иван Иванов',
                  email: 'ivan@example.com',
                  role: 'admin',
                  createdAt: '2023-01-01T00:00:00.000Z',
                  updatedAt: '2023-01-01T00:00:00.000Z'
                },
                {
                  id: '2',
                  name: 'Петр Петров',
                  email: 'petr@example.com',
                  role: 'manager',
                  createdAt: '2023-01-02T00:00:00.000Z',
                  updatedAt: '2023-01-02T00:00:00.000Z'
                },
                {
                  id: '3',
                  name: 'Анна Сидорова',
                  email: 'anna@example.com',
                  role: 'user',
                  createdAt: '2023-01-03T00:00:00.000Z',
                  updatedAt: '2023-01-03T00:00:00.000Z'
                }
              ],
              total: 3,
              page: 1,
              limit: 10,
              pages: 1
            },
            isLoading: false,
            error: null,
            refetch: vi.fn()
          })
        },
        createUser: {
          useMutation: mockCreateUser.mockReturnValue([
            vi.fn().mockResolvedValue({ id: '4', name: 'Новый Пользователь', email: 'new@example.com', role: 'user' }),
            { isLoading: false, error: null }
          ])
        },
        updateUser: {
          useMutation: mockUpdateUser.mockReturnValue([
            vi.fn().mockResolvedValue({ id: '1', name: 'Обновленный Иванов', email: 'ivan@example.com', role: 'admin' }),
            { isLoading: false, error: null }
          ])
        },
        deleteUser: {
          useMutation: mockDeleteUser.mockReturnValue([
            vi.fn().mockResolvedValue({}),
            { isLoading: false }
          ])
        }
      }
    }
  };
  
  return mockApi;
});

// Создаем тестовый стор
const createTestStore = () => {
  // Получаем мокированный API через динамический импорт
  const { api } = require('../../api');
  
  return configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      auth: authReducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
    preloadedState: {
      auth: {
        userId: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        accessToken: 'fake-token',
        refreshToken: 'fake-refresh-token',
        expiresAt: Date.now() + 3600000, // Токен истекает через час
        isAuthenticated: true,
        permissions: ['users:read', 'users:write', 'users:delete'],
        isLoading: false,
        error: null
      }
    }
  });
};

// Создаем тестовую тему
const theme = createTheme();

// Функция для рендеринга компонента с необходимыми провайдерами
const renderWithProviders = (ui: React.ReactElement, { route = '/users' } = {}) => {
  const store = createTestStore();
  window.history.pushState({}, 'Test page', route);
  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          {ui}
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

// Функция для рендеринга приложения с маршрутизацией
const renderWithRouting = (initialRoute = '/users') => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={[initialRoute]}>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    </Provider>
  );
};

describe('Модуль пользователей - Интеграционные тесты', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('должен отображать страницу пользователей при переходе по маршруту /users', async () => {
    renderWithRouting('/users');

    // Проверяем, что заголовок страницы отображается
    await waitFor(() => {
      expect(screen.getByText('Управление пользователями')).toBeTruthy();
    });
    
    // Проверяем, что таблица пользователей отображается
    expect(screen.getByText('Иван Иванов')).toBeTruthy();
    expect(screen.getByText('Петр Петров')).toBeTruthy();
    expect(screen.getByText('Анна Сидорова')).toBeTruthy();
  });

  it('должен фильтровать пользователей при вводе в поле поиска', async () => {
    renderWithProviders(<UsersPage />);

    // Находим поле поиска и вводим текст
    const searchInput = screen.getByPlaceholderText('Поиск по имени или email');
    fireEvent.change(searchInput, { target: { value: 'Иван' } });
    
    // Нажимаем кнопку поиска
    const searchButton = screen.getByText('Искать');
    fireEvent.click(searchButton);
    
    // Проверяем, что хук API был вызван с правильными параметрами
    await waitFor(() => {
      // Получаем доступ к моку через импортированный модуль
      const { api } = require('../../api');
      const mockGetUsers = api.endpoints.getUsers.useQuery;
      expect(mockGetUsers).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'Иван' })
      );
    });
  });

  it('должен открывать диалог создания пользователя при нажатии на кнопку', async () => {
    renderWithProviders(<UsersPage />);

    // Находим кнопку "Добавить пользователя" и нажимаем на нее
    const addButton = screen.getByText('Добавить пользователя');
    fireEvent.click(addButton);
    
    // Проверяем, что диалог открылся
    expect(screen.getByText('Создание нового пользователя')).toBeTruthy();
    
    // Заполняем форму
    fireEvent.change(screen.getByLabelText('Имя'), { target: { value: 'Новый Пользователь' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByLabelText('Пароль'), { target: { value: 'password123' } });
    
    // Выбираем роль
    const roleSelect = screen.getByLabelText('Роль');
    fireEvent.mouseDown(roleSelect);
    const userRoleOption = screen.getByText('user');
    fireEvent.click(userRoleOption);
    
    // Нажимаем кнопку "Сохранить"
    const saveButton = screen.getByText('Сохранить');
    fireEvent.click(saveButton);
    
    // Проверяем, что мутация создания пользователя была вызвана с правильными данными
    await waitFor(() => {
      // Получаем доступ к моку через импортированный модуль
      const { api } = require('../../api');
      const createUserMutation = api.endpoints.createUser.useMutation[0];
      expect(createUserMutation).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Новый Пользователь',
          email: 'new@example.com',
          password: 'password123',
          role: 'user'
        })
      );
    });
  });

  it('должен удалять пользователя при подтверждении', async () => {
    renderWithProviders(<UsersPage />);

    // Находим кнопку удаления для первого пользователя и нажимаем на нее
    const deleteButtons = screen.getAllByLabelText('Удалить пользователя');
    fireEvent.click(deleteButtons[0]);
    
    // Проверяем, что появился диалог подтверждения
    expect(screen.getByText('Подтверждение удаления')).toBeTruthy();
    
    // Нажимаем кнопку "Удалить" в диалоге подтверждения
    const confirmButton = screen.getByText('Удалить');
    fireEvent.click(confirmButton);
    
    // Проверяем, что мутация удаления пользователя была вызвана с правильным ID
    await waitFor(() => {
      // Получаем доступ к моку через импортированный модуль
      const { api } = require('../../api');
      const deleteUserMutation = api.endpoints.deleteUser.useMutation[0];
      expect(deleteUserMutation).toHaveBeenCalledWith('1');
    });
  });
});
