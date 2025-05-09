/**
 * Тесты для компонента UsersTable
 *
 * Этот файл содержит тесты для проверки функциональности таблицы пользователей,
 * включая отображение данных, сортировку, пагинацию и действия с пользователями.
 */

// Используем глобальные объекты из Vitest, которые доступны через vitest-setup.ts
// Это позволяет избежать проблем с импортом в CommonJS модулях

import { vi, describe, it, expect, beforeEach, afterEach, type Mock } from 'vitest';

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { UsersTable } from '../UsersTable';
import { api } from '../../../api';
import { useGetUsersQuery } from '../../../api/usersApi';

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

const mockRole = {
  Admin: 'admin',
  Manager: 'manager',
  User: 'user',
  Accountant: 'accountant',
  Guest: 'guest'
};

// Мокируем хук useAbility
vi.mock('../../../permissions/abilities', () => ({
  useAbility: vi.fn().mockReturnValue({
    can: vi.fn().mockReturnValue(true)
  }),
  __esModule: true,
  default: {}
}));

// Мокируем хук useGetUsersQuery
vi.mock('../../../api/usersApi', () => ({
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
  })
}));

// Создаем тестовый стор
const createTestStore = () => {
  return configureStore({
    reducer: {
      [api.reducerPath]: api.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware)
  });
};

// Создаем тестовую тему
const theme = createTheme();

// Функция для рендеринга компонента с необходимыми провайдерами
const renderWithProviders = (ui: React.ReactElement) => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        {ui}
      </ThemeProvider>
    </Provider>
  );
};

describe('UsersTable', () => {
  // Мокируем обработчики событий
  const mockOnViewUser = vi.fn();
  const mockOnEditUser = vi.fn();
  const mockOnDeleteUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('должен корректно отображать таблицу с пользователями', () => {
    renderWithProviders(
      <UsersTable
        onViewUser={mockOnViewUser}
        onEditUser={mockOnEditUser}
        onDeleteUser={mockOnDeleteUser}
      />
    );

    // Проверяем, что заголовки таблицы отображаются
    expect(screen.getByText('Имя')).toBeTruthy();
    expect(screen.getByText('Email')).toBeTruthy();
    expect(screen.getByText('Роль')).toBeTruthy();
    expect(screen.getByText('Действия')).toBeTruthy();

    // Проверяем, что данные пользователей отображаются
    expect(screen.getByText('Иван Иванов')).toBeTruthy();
    expect(screen.getByText('ivan@example.com')).toBeTruthy();
    expect(screen.getByText('admin')).toBeTruthy();

    expect(screen.getByText('Петр Петров')).toBeTruthy();
    expect(screen.getByText('petr@example.com')).toBeTruthy();
    expect(screen.getByText('manager')).toBeTruthy();

    expect(screen.getByText('Анна Сидорова')).toBeTruthy();
    expect(screen.getByText('anna@example.com')).toBeTruthy();
    expect(screen.getByText('user')).toBeTruthy();
  });

  it('должен вызывать обработчики действий при нажатии на кнопки', async () => {
    renderWithProviders(
      <UsersTable
        onViewUser={mockOnViewUser}
        onEditUser={mockOnEditUser}
        onDeleteUser={mockOnDeleteUser}
      />
    );

    // Находим кнопки действий для первого пользователя
    const viewButtons = screen.getAllByLabelText('Просмотреть пользователя');
    const editButtons = screen.getAllByLabelText('Редактировать пользователя');
    const deleteButtons = screen.getAllByLabelText('Удалить пользователя');

    // Нажимаем на кнопки действий для первого пользователя
    fireEvent.click(viewButtons[0]);
    fireEvent.click(editButtons[0]);
    fireEvent.click(deleteButtons[0]);

    // Проверяем, что обработчики были вызваны с правильными аргументами
    expect(mockOnViewUser).toHaveBeenCalledWith(expect.objectContaining({
      id: '1',
      name: 'Иван Иванов',
      email: 'ivan@example.com',
      role: 'admin'
    }));

    expect(mockOnEditUser).toHaveBeenCalledWith(expect.objectContaining({
      id: '1',
      name: 'Иван Иванов',
      email: 'ivan@example.com',
      role: 'admin'
    }));

    expect(mockOnDeleteUser).toHaveBeenCalledWith(expect.objectContaining({
      id: '1',
      name: 'Иван Иванов',
      email: 'ivan@example.com',
      role: 'admin'
    }));
  });

  it('должен отображать сообщение, если нет данных', () => {
    // Переопределяем мок для пустого списка пользователей
    (useGetUsersQuery as Mock).mockReturnValue({
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

    renderWithProviders(
      <UsersTable
        onViewUser={mockOnViewUser}
        onEditUser={mockOnEditUser}
        onDeleteUser={mockOnDeleteUser}
      />
    );

    // Проверяем, что отображается сообщение о пустом списке
    expect(screen.getByText('Пользователи не найдены')).toBeTruthy();
    expect(screen.getByText('Попробуйте изменить параметры фильтрации')).toBeTruthy();
  });

  it('должен отображать состояние загрузки', () => {
    // Переопределяем мок для состояния загрузки
    (useGetUsersQuery as Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null
    });

    renderWithProviders(
      <UsersTable
        onViewUser={mockOnViewUser}
        onEditUser={mockOnEditUser}
        onDeleteUser={mockOnDeleteUser}
      />
    );

    // Проверяем, что отображаются скелетоны загрузки
    const skeletons = screen.getAllByRole('row');
    // Первая строка - заголовок, остальные - скелетоны
    expect(skeletons.length).toBeGreaterThan(1);
  });

  it('должен отображать сообщение об ошибке', () => {
    // Переопределяем мок для состояния ошибки
    (useGetUsersQuery as Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: { status: 500, data: { message: 'Ошибка сервера' } }
    });

    renderWithProviders(
      <UsersTable
        onViewUser={mockOnViewUser}
        onEditUser={mockOnEditUser}
        onDeleteUser={mockOnDeleteUser}
      />
    );

    // Проверяем, что отображается сообщение об ошибке
    expect(screen.getByText('Ошибка загрузки данных')).toBeTruthy();
    expect(screen.getByText('Попробуйте обновить страницу')).toBeTruthy();
  });

  it('должен корректно работать с фильтрами', () => {
    const filterParams = {
      name: 'Иван',
      role: mockRole.Admin
    };

    renderWithProviders(
      <UsersTable
        filterParams={filterParams}
        onViewUser={mockOnViewUser}
        onEditUser={mockOnEditUser}
        onDeleteUser={mockOnDeleteUser}
      />
    );

    // Проверяем, что хук useGetUsersQuery был вызван с правильными параметрами
    expect(useGetUsersQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Иван',
        email: '',
        role: mockRole.Admin,
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'asc'
      })
    );
  });

  it('должен корректно обрабатывать сортировку', async () => {
    renderWithProviders(
      <UsersTable
        onViewUser={mockOnViewUser}
        onEditUser={mockOnEditUser}
        onDeleteUser={mockOnDeleteUser}
      />
    );

    // Находим заголовок столбца "Имя"
    const nameHeader = screen.getByText('Имя').closest('th');
    
    // Нажимаем на заголовок для сортировки
    if (nameHeader) {
      const sortButton = nameHeader.querySelector('.MuiTableSortLabel-root');
      if (sortButton) {
        fireEvent.click(sortButton);
      }
    }

    // Проверяем, что хук useGetUsersQuery был вызван с обновленными параметрами сортировки
    expect(useGetUsersQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        sortBy: 'name',
        sortOrder: 'desc'
      })
    );

    // Кликаем еще раз для сортировки по возрастанию
    if (nameHeader) {
      const sortButton = nameHeader.querySelector('.MuiTableSortLabel-root');
      if (sortButton) {
        fireEvent.click(sortButton);
      }
    }

    // Проверяем, что хук useGetUsersQuery был вызван с обновленными параметрами сортировки
    expect(useGetUsersQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        sortBy: 'name',
        sortOrder: 'asc'
      })
    );
  });

  it('должен корректно обрабатывать пагинацию', () => {
    // Переопределяем мок для большего количества пользователей
    (useGetUsersQuery as Mock).mockReturnValue({
      data: {
        items: [
          { id: '1', name: 'User 1', email: 'user1@example.com', role: 'user', createdAt: '', updatedAt: '' },
          { id: '2', name: 'User 2', email: 'user2@example.com', role: 'user', createdAt: '', updatedAt: '' },
          { id: '3', name: 'User 3', email: 'user3@example.com', role: 'user', createdAt: '', updatedAt: '' },
          { id: '4', name: 'User 4', email: 'user4@example.com', role: 'user', createdAt: '', updatedAt: '' },
          { id: '5', name: 'User 5', email: 'user5@example.com', role: 'user', createdAt: '', updatedAt: '' },
          { id: '6', name: 'User 6', email: 'user6@example.com', role: 'user', createdAt: '', updatedAt: '' },
          { id: '7', name: 'User 7', email: 'user7@example.com', role: 'user', createdAt: '', updatedAt: '' },
          { id: '8', name: 'User 8', email: 'user8@example.com', role: 'user', createdAt: '', updatedAt: '' },
          { id: '9', name: 'User 9', email: 'user9@example.com', role: 'user', createdAt: '', updatedAt: '' },
          { id: '10', name: 'User 10', email: 'user10@example.com', role: 'user', createdAt: '', updatedAt: '' },
          { id: '11', name: 'User 11', email: 'user11@example.com', role: 'user', createdAt: '', updatedAt: '' },
        ],
        total: 11,
        page: 1,
        limit: 10,
        pages: 2
      },
      isLoading: false,
      error: null
    });

    renderWithProviders(
      <UsersTable
        onViewUser={mockOnViewUser}
        onEditUser={mockOnEditUser}
        onDeleteUser={mockOnDeleteUser}
      />
    );

    // Находим кнопку "Следующая страница"
    const nextPageButton = screen.getByLabelText('Go to next page');
    
    // Нажимаем на кнопку
    fireEvent.click(nextPageButton);

    // Проверяем, что хук useGetUsersQuery был вызван с параметрами для второй страницы
    expect(useGetUsersQuery).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2, limit: 10 })
    );
  });
});
