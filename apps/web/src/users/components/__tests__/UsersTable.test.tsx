/**
 * Тесты для компонента UsersTable
 *
 * Этот файл содержит тесты для проверки функциональности таблицы пользователей,
 * включая сортировку, пагинацию и действия с пользователями.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { UsersTable } from '../UsersTable';
import { api } from '../../../api';

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

const mockRole = {
  Admin: 'admin',
  Manager: 'manager',
  User: 'user',
  Accountant: 'accountant',
  Guest: 'guest'
};

// Мокируем хук useAbility
jest.mock('../../../permissions/abilities', () => ({
  useAbility: jest.fn().mockReturnValue({
    can: jest.fn().mockReturnValue(true)
  }),
  __esModule: true,
  default: {}
}));

// Мокируем хук useGetUsersQuery
jest.mock('../../../api/usersApi', () => ({
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
  const mockOnViewUser = jest.fn();
  const mockOnEditUser = jest.fn();
  const mockOnDeleteUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
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
    expect(screen.getByText('Имя')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Роль')).toBeInTheDocument();
    expect(screen.getByText('Действия')).toBeInTheDocument();

    // Проверяем, что данные пользователей отображаются
    expect(screen.getByText('Иван Иванов')).toBeInTheDocument();
    expect(screen.getByText('ivan@example.com')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();

    expect(screen.getByText('Петр Петров')).toBeInTheDocument();
    expect(screen.getByText('petr@example.com')).toBeInTheDocument();
    expect(screen.getByText('manager')).toBeInTheDocument();

    expect(screen.getByText('Анна Сидорова')).toBeInTheDocument();
    expect(screen.getByText('anna@example.com')).toBeInTheDocument();
    expect(screen.getByText('user')).toBeInTheDocument();
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
    jest.requireMock('../../../api/usersApi').useGetUsersQuery.mockReturnValue({
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
    expect(screen.getByText('Пользователи не найдены')).toBeInTheDocument();
    expect(screen.getByText('Попробуйте изменить параметры фильтрации')).toBeInTheDocument();
  });

  it('должен отображать состояние загрузки', () => {
    // Переопределяем мок для состояния загрузки
    jest.requireMock('../../../api/usersApi').useGetUsersQuery.mockReturnValue({
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
    jest.requireMock('../../../api/usersApi').useGetUsersQuery.mockReturnValue({
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
    expect(screen.getByText('Ошибка загрузки данных')).toBeInTheDocument();
    expect(screen.getByText('Попробуйте обновить страницу')).toBeInTheDocument();
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
    expect(jest.requireMock('../../../api/usersApi').useGetUsersQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Иван',
        role: mockRole.Admin,
        page: 1,
        limit: 10
      })
    );
  });

  it('должен корректно обрабатывать сортировку', () => {
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
    expect(jest.requireMock('../../../api/usersApi').useGetUsersQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        sortBy: 'name',
        sortOrder: 'asc'
      })
    );
  });

  it('должен корректно обрабатывать пагинацию', () => {
    // Переопределяем мок для большего количества пользователей
    jest.requireMock('../../../api/usersApi').useGetUsersQuery.mockReturnValue({
      data: {
        items: [
          // ... первые 10 пользователей
        ],
        total: 25,
        page: 1,
        limit: 10,
        pages: 3
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

    // Проверяем, что хук useGetUsersQuery был вызван с обновленными параметрами пагинации
    expect(jest.requireMock('../../../api/usersApi').useGetUsersQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 2,
        limit: 10
      })
    );
  });
});
