/**
 * Интеграционные тесты для модуля пользователей
 *
 * Этот файл содержит тесты для проверки полного цикла работы с пользователями,
 * включая маршрутизацию, доступ на основе ролей, и взаимодействие с API.
 */

import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import { api } from '../../api';
import { authReducer, AuthState } from '../../store/slices/authSlice';

// Мокируем shared модуль
jest.mock('@finance-platform/shared', () => {
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
jest.mock('../../permissions/abilities', () => ({
  useAbility: jest.fn().mockReturnValue({
    can: jest.fn().mockReturnValue(true)
  }),
  __esModule: true,
  default: {}
}));

// Мокируем хук useAuth
jest.mock('../../auth/hooks/useAuth', () => ({
  useAuth: jest.fn().mockReturnValue({
    isAuthenticated: true,
    user: {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin'
    },
    login: jest.fn(),
    logout: jest.fn(),
    refreshToken: jest.fn()
  }),
  __esModule: true,
  default: {}
}));

// Мокируем хуки API
jest.mock('../../api/usersApi', () => ({
  __esModule: true,
  useGetUsersQuery: jest.fn().mockReturnValue({
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
    error: null
  }),
  useCreateUserMutation: jest.fn().mockReturnValue([
    jest.fn().mockResolvedValue({ id: '4', name: 'Новый Пользователь', email: 'new@example.com', role: 'user' }),
    { isLoading: false, error: null }
  ]),
  useUpdateUserMutation: jest.fn().mockReturnValue([
    jest.fn().mockResolvedValue({ id: '1', name: 'Обновленный Иванов', email: 'ivan@example.com', role: 'admin' }),
    { isLoading: false, error: null }
  ]),
  useDeleteUserMutation: jest.fn().mockReturnValue([
    jest.fn().mockResolvedValue({}),
    { isLoading: false }
  ])
}));

// Создаем тестовый стор
const createTestStore = () => {
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
    jest.clearAllMocks();
  });

  it('должен отображать страницу пользователей при переходе по маршруту /users', async () => {
    renderWithRouting('/users');

    // Проверяем, что заголовок страницы отображается
    await waitFor(() => {
      expect(screen.getByText('Управление пользователями')).toBeInTheDocument();
    });
    
    // Проверяем, что таблица пользователей отображается
    expect(screen.getByText('Имя')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Роль')).toBeInTheDocument();
  });

  it('должен отображать пункт меню "Пользователи" для администратора', async () => {
    renderWithRouting('/');

    // Проверяем, что пункт меню "Пользователи" отображается
    await waitFor(() => {
      expect(screen.getByText('Пользователи')).toBeInTheDocument();
    });
  });

  it('должен перенаправлять на страницу пользователей при клике на пункт меню', async () => {
    renderWithRouting('/');

    // Находим и кликаем на пункт меню "Пользователи"
    const usersMenuItem = await screen.findByText('Пользователи');
    fireEvent.click(usersMenuItem);

    // Проверяем, что произошел переход на страницу пользователей
    await waitFor(() => {
      expect(screen.getByText('Управление пользователями')).toBeInTheDocument();
    });
  });

  it('должен выполнять полный цикл создания, редактирования и удаления пользователя', async () => {
    renderWithProviders(<UsersPage />);

    // 1. Создание пользователя
    // Нажимаем на кнопку создания пользователя
    const createButton = screen.getByText('Создать пользователя');
    fireEvent.click(createButton);

    // Заполняем форму создания пользователя
    const nameInput = await screen.findByLabelText('Имя');
    const emailInput = await screen.findByLabelText('Email');
    const passwordInput = await screen.findByLabelText('Пароль');
    const roleSelect = await screen.findByLabelText('Роль');

    fireEvent.change(nameInput, { target: { value: 'Новый Пользователь' } });
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Открываем выпадающий список ролей
    fireEvent.mouseDown(roleSelect);
    
    // Выбираем роль "Пользователь"
    const userOption = screen.getByText('Пользователь');
    fireEvent.click(userOption);

    // Нажимаем на кнопку сохранения
    const saveButton = screen.getByText('Сохранить');
    fireEvent.click(saveButton);

    // Проверяем, что функция создания пользователя была вызвана с правильными параметрами
    await waitFor(() => {
      expect(jest.requireMock('../../api/usersApi').useCreateUserMutation()[0]).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Новый Пользователь',
          email: 'new@example.com',
          password: 'password123',
          role: 'user'
        })
      );
    });

    // Проверяем, что отображается уведомление об успешном создании
    await waitFor(() => {
      expect(screen.getByText('Пользователь успешно создан')).toBeInTheDocument();
    });

    // 2. Редактирование пользователя
    // Обновляем мок для отображения созданного пользователя
    jest.requireMock('../../api/usersApi').useGetUsersQuery.mockReturnValue({
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
            id: '4',
            name: 'Новый Пользователь',
            email: 'new@example.com',
            role: 'user',
            createdAt: '2023-01-04T00:00:00.000Z',
            updatedAt: '2023-01-04T00:00:00.000Z'
          }
        ],
        total: 4,
        page: 1,
        limit: 10,
        pages: 1
      },
      isLoading: false,
      error: null
    });

    // Перерендериваем компонент для отображения обновленных данных
    renderWithProviders(<UsersPage />);

    // Находим кнопку редактирования для нового пользователя
    const editButtons = screen.getAllByLabelText('Редактировать пользователя');
    // Предполагаем, что новый пользователь находится в конце списка
    fireEvent.click(editButtons[editButtons.length - 1]);

    // Изменяем имя пользователя
    const editNameInput = await screen.findByLabelText('Имя');
    fireEvent.change(editNameInput, { target: { value: 'Обновленный Пользователь' } });

    // Нажимаем на кнопку сохранения
    const editSaveButton = screen.getByText('Сохранить');
    fireEvent.click(editSaveButton);

    // Проверяем, что функция обновления пользователя была вызвана с правильными параметрами
    await waitFor(() => {
      expect(jest.requireMock('../../api/usersApi').useUpdateUserMutation()[0]).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          data: expect.objectContaining({
            name: 'Обновленный Пользователь'
          })
        })
      );
    });

    // Проверяем, что отображается уведомление об успешном обновлении
    await waitFor(() => {
      expect(screen.getByText('Пользователь успешно обновлен')).toBeInTheDocument();
    });

    // 3. Удаление пользователя
    // Находим кнопку удаления для нового пользователя
    const deleteButtons = screen.getAllByLabelText('Удалить пользователя');
    // Предполагаем, что новый пользователь находится в конце списка
    fireEvent.click(deleteButtons[deleteButtons.length - 1]);

    // Нажимаем на кнопку подтверждения удаления
    const confirmButton = await screen.findByText('Удалить');
    fireEvent.click(confirmButton);

    // Проверяем, что функция удаления пользователя была вызвана
    await waitFor(() => {
      expect(jest.requireMock('../../api/usersApi').useDeleteUserMutation()[0]).toHaveBeenCalled();
    });

    // Проверяем, что отображается уведомление об успешном удалении
    await waitFor(() => {
      expect(screen.getByText('Пользователь успешно удален')).toBeInTheDocument();
    });
  });

  it('должен применять фильтры и отображать отфильтрованные результаты', async () => {
    renderWithProviders(<UsersPage />);

    // Нажимаем на кнопку фильтров
    const filterButton = screen.getByText('Фильтры');
    fireEvent.click(filterButton);

    // Заполняем форму фильтрации
    const nameInput = await screen.findByLabelText('Имя пользователя');
    fireEvent.change(nameInput, { target: { value: 'Иван' } });

    // Нажимаем на кнопку применения фильтров
    const applyButton = screen.getByText('Применить');
    fireEvent.click(applyButton);

    // Проверяем, что хук useGetUsersQuery был вызван с правильными параметрами
    expect(jest.requireMock('../../api/usersApi').useGetUsersQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Иван'
      })
    );

    // Обновляем мок для отображения отфильтрованных результатов
    jest.requireMock('../../api/usersApi').useGetUsersQuery.mockReturnValue({
      data: {
        items: [
          {
            id: '1',
            name: 'Иван Иванов',
            email: 'ivan@example.com',
            role: 'admin',
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z'
          }
        ],
        total: 1,
        page: 1,
        limit: 10,
        pages: 1
      },
      isLoading: false,
      error: null
    });

    // Перерендериваем компонент для отображения отфильтрованных данных
    renderWithProviders(<UsersPage />);

    // Проверяем, что отображается только один пользователь
    expect(screen.getByText('Иван Иванов')).toBeInTheDocument();
    expect(screen.queryByText('Петр Петров')).not.toBeInTheDocument();
    expect(screen.queryByText('Анна Сидорова')).not.toBeInTheDocument();
  });

  it('должен проверять доступ на основе ролей', async () => {
    // Переопределяем мок useAuth для пользователя с ролью "user"
    jest.requireMock('../../auth/hooks/useAuth').useAuth.mockReturnValue({
      isAuthenticated: true,
      user: {
        id: '3',
        name: 'Regular User',
        email: 'user@example.com',
        role: 'user'
      },
      login: jest.fn(),
      logout: jest.fn()
    });

    // Переопределяем мок useAbility для запрета действий
    jest.requireMock('../../permissions/abilities').useAbility.mockReturnValue({
      can: jest.fn().mockImplementation((action, subject) => {
        // Разрешаем только чтение для обычного пользователя
        if (action === 'read') return true;
        return false;
      })
    });

    renderWithProviders(<UsersPage />);

    // Проверяем, что кнопка создания пользователя не отображается
    expect(screen.queryByText('Создать пользователя')).not.toBeInTheDocument();

    // Проверяем, что кнопки редактирования и удаления не отображаются
    expect(screen.queryAllByLabelText('Редактировать пользователя')).toHaveLength(0);
    expect(screen.queryAllByLabelText('Удалить пользователя')).toHaveLength(0);

    // Проверяем, что кнопки просмотра отображаются
    expect(screen.getAllByLabelText('Просмотреть пользователя')).toHaveLength(3);
  });

  it('должен корректно обрабатывать ошибки API', async () => {
    // Переопределяем мок для ошибки API
    jest.requireMock('../../api/usersApi').useGetUsersQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: { status: 500, data: { message: 'Ошибка сервера' } }
    });

    renderWithProviders(<UsersPage />);

    // Проверяем, что отображается сообщение об ошибке
    expect(screen.getByText('Ошибка загрузки данных')).toBeInTheDocument();
    expect(screen.getByText('Попробуйте обновить страницу')).toBeInTheDocument();
  });

  it('должен корректно обрабатывать пустой список пользователей', async () => {
    // Переопределяем мок для пустого списка
    jest.requireMock('../../api/usersApi').useGetUsersQuery.mockReturnValue({
      data: {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        pages: 0
      },
      isLoading: false,
      error: null
    });

    renderWithProviders(<UsersPage />);

    // Проверяем, что отображается сообщение о пустом списке
    expect(screen.getByText('Пользователи не найдены')).toBeInTheDocument();
    expect(screen.getByText('Попробуйте изменить параметры фильтрации')).toBeInTheDocument();
  });
});
