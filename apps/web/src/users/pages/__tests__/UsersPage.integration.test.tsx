/**
 * Интеграционные тесты для страницы пользователей
 *
 * Этот файл содержит тесты для проверки интеграции компонентов на странице пользователей,
 * включая фильтрацию, сортировку, пагинацию и действия с пользователями.
 */

// Импортируем методы из @testing-library/jest-dom
// Они уже должны быть доступны через vitest-setup.ts

// Используем глобальные объекты из Vitest, которые доступны через vitest-setup.ts
// Это позволяет избежать проблем с импортом в CommonJS модулях

// Явно импортируем только vi для мокирования
import { vi } from 'vitest';

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { UsersPage } from '../UsersPage';
// Удаляем статический импорт API, т.к. используем динамический импорт

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

// Мокируем API с правильной структурой RTK Query
vi.mock('../../../api', () => {
  // Создаем моки функций для каждого эндпоинта
  const mockGetUsersQuery = vi.fn();
  const mockCreateUserMutation = vi.fn();
  const mockUpdateUserMutation = vi.fn();
  const mockDeleteUserMutation = vi.fn();
  
  // Настраиваем возвращаемые значения для запроса пользователей
  mockGetUsersQuery.mockReturnValue({
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
  });
  
  // Настраиваем возвращаемые значения для мутаций
  const createUserFn = vi.fn().mockResolvedValue({ 
    id: '4', 
    name: 'Новый Пользователь', 
    email: 'new@example.com', 
    role: 'user' 
  });
  
  mockCreateUserMutation.mockReturnValue([
    createUserFn,
    { isLoading: false, error: null }
  ]);
  
  const updateUserFn = vi.fn().mockResolvedValue({ 
    id: '1', 
    name: 'Обновленный Иванов', 
    email: 'ivan@example.com', 
    role: 'admin' 
  });
  
  mockUpdateUserMutation.mockReturnValue([
    updateUserFn,
    { isLoading: false, error: null }
  ]);
  
  const deleteUserFn = vi.fn().mockResolvedValue({});
  
  mockDeleteUserMutation.mockReturnValue([
    deleteUserFn,
    { isLoading: false, error: null }
  ]);
  
  // Создаем мок API с правильной структурой RTK Query
  return {
    api: {
      reducerPath: 'api',
      reducer: {},
      middleware: vi.fn(() => vi.fn()),
      endpoints: {
        getUsers: {
          useQuery: mockGetUsersQuery
        },
        createUser: {
          useMutation: mockCreateUserMutation
        },
        updateUser: {
          useMutation: mockUpdateUserMutation
        },
        deleteUser: {
          useMutation: mockDeleteUserMutation
        }
      }
    }
  };
});

// Создаем тестовый стор
const createTestStore = () => {
  // Получаем мокированный API через динамический импорт
  const { api } = require('../../../api');
  
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
        <BrowserRouter>
          {ui}
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

describe('UsersPage - Интеграционные тесты', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('должна корректно отображать страницу пользователей', async () => {
    renderWithProviders(<UsersPage />);

    // Проверяем, что заголовок страницы отображается
    expect(screen.getByText('Управление пользователями')).toBeTruthy();
    
    // Проверяем, что кнопка создания пользователя отображается
    expect(screen.getByText('Создать пользователя')).toBeTruthy();
    
    // Проверяем, что кнопка фильтров отображается
    expect(screen.getByText('Фильтры')).toBeTruthy();
    
    // Проверяем, что таблица пользователей отображается
    expect(screen.getByText('Имя')).toBeTruthy();
    expect(screen.getByText('Email')).toBeTruthy();
    expect(screen.getByText('Роль')).toBeTruthy();
    
    // Проверяем, что данные пользователей отображаются
    expect(screen.getByText('Иван Иванов')).toBeTruthy();
    expect(screen.getByText('ivan@example.com')).toBeTruthy();
    expect(screen.getByText('admin')).toBeTruthy();
  });

  it('должна открывать форму создания пользователя при нажатии на кнопку', async () => {
    renderWithProviders(<UsersPage />);

    // Нажимаем на кнопку создания пользователя
    const createButton = screen.getByText('Создать пользователя') as HTMLElement;
    fireEvent.click(createButton);

    // Проверяем, что диалог открылся
    await waitFor(() => {
      expect(screen.getByText('Создание пользователя')).toBeTruthy();
    });

    // Проверяем, что форма содержит все необходимые поля
    expect(screen.getByLabelText('Имя')).toBeTruthy();
    expect(screen.getByLabelText('Email')).toBeTruthy();
    expect(screen.getByLabelText('Роль')).toBeTruthy();
    expect(screen.getByLabelText('Пароль')).toBeTruthy();
  });

  it('должна открывать форму редактирования при нажатии на кнопку редактирования', async () => {
    renderWithProviders(<UsersPage />);

    // Находим кнопку редактирования для первого пользователя
    const editButtons = screen.getAllByLabelText('Редактировать пользователя') as HTMLElement[];
    fireEvent.click(editButtons[0]);

    // Проверяем, что диалог открылся
    await waitFor(() => {
      expect(screen.getByText('Редактирование пользователя')).toBeTruthy();
    });

    // Проверяем, что форма содержит данные пользователя
    const nameInput = screen.getByLabelText('Имя') as HTMLInputElement;
    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    expect(nameInput.value).toBe('Иван Иванов');
    expect(emailInput.value).toBe('ivan@example.com');
  });

  it('должна открывать диалог подтверждения при нажатии на кнопку удаления', async () => {
    renderWithProviders(<UsersPage />);

    // Находим кнопку удаления для первого пользователя
    const deleteButtons = screen.getAllByLabelText('Удалить пользователя') as HTMLElement[];
    fireEvent.click(deleteButtons[0]);

    // Проверяем, что диалог открылся
    await waitFor(() => {
      expect(screen.getByText('Подтверждение удаления')).toBeTruthy();
    });

    // Проверяем, что диалог содержит имя пользователя
    expect(screen.getByText(/Иван Иванов/)).toBeTruthy();
  });

  it('должна отображать фильтры при нажатии на кнопку фильтров', async () => {
    renderWithProviders(<UsersPage />);

    // Нажимаем на кнопку фильтров
    const filterButton = screen.getByText('Фильтры') as HTMLElement;
    fireEvent.click(filterButton);

    // Проверяем, что компоненты формы фильтрации отображаются
    await waitFor(() => {
      expect(screen.getByLabelText('Имя пользователя')).toBeTruthy();
      expect(screen.getByLabelText('Email')).toBeTruthy();
      expect(screen.getByLabelText('Роль')).toBeTruthy();
    });
  });

  it('должна применять фильтры при заполнении формы фильтрации', async () => {
    renderWithProviders(<UsersPage />);

    // Нажимаем на кнопку фильтров
    const filterButton = screen.getByText('Фильтры') as HTMLElement;
    fireEvent.click(filterButton);

    // Заполняем форму фильтрации
    const nameInput = await screen.findByLabelText('Имя пользователя') as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'Иван' } });

    // Нажимаем на кнопку применения фильтров
    const applyButton = screen.getByText('Применить') as HTMLElement;
    fireEvent.click(applyButton);

    // Проверяем, что хук useGetUsersQuery был вызван с правильными параметрами
    await waitFor(() => {
      const { api } = require('../../../api');
      const mockGetUsers = api.endpoints.getUsers.useQuery;
      expect(mockGetUsers).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Иван'
        })
      );
    });
  });

  it('должна создавать нового пользователя при заполнении формы создания', async () => {
    renderWithProviders(<UsersPage />);

    // Нажимаем на кнопку создания пользователя
    const createButton = screen.getByText('Создать пользователя') as HTMLElement;
    fireEvent.click(createButton);

    // Заполняем форму создания пользователя
    const nameInput = await screen.findByLabelText('Имя') as HTMLInputElement;
    const emailInput = await screen.findByLabelText('Email') as HTMLInputElement;
    const passwordInput = await screen.findByLabelText('Пароль') as HTMLInputElement;
    const roleSelect = await screen.findByLabelText('Роль') as HTMLElement;

    fireEvent.change(nameInput, { target: { value: 'Новый Пользователь' } });
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Открываем выпадающий список ролей
    fireEvent.mouseDown(roleSelect);
    
    // Выбираем роль "Пользователь"
    const userOption = screen.getByText('Пользователь') as HTMLElement;
    fireEvent.click(userOption);

    // Нажимаем на кнопку сохранения
    const saveButton = screen.getByText('Сохранить') as HTMLElement;
    fireEvent.click(saveButton);

    // Проверяем, что функция создания пользователя была вызвана с правильными параметрами
    await waitFor(() => {
      const { api } = require('../../../api');
      const createUserMutation = api.endpoints.createUser.useMutation[0];
      expect(createUserMutation).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Новый Пользователь',
          email: 'new@example.com',
          password: 'password123',
          role: 'user'
        })
      );
      expect(screen.queryByText('Создание нового пользователя')).toBeNull();
      expect(screen.getByText('Пользователь успешно создан')).toBeTruthy();
    });
  });

  it('должна обновлять пользователя при редактировании', async () => {
    renderWithProviders(<UsersPage />);

    // Находим кнопку редактирования для первого пользователя
    const editButtons = screen.getAllByLabelText('Редактировать пользователя') as HTMLElement[];
    fireEvent.click(editButtons[0]);

    // Изменяем имя пользователя
    const nameInput = await screen.findByLabelText('Имя') as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'Обновленный Иванов' } });

    // Нажимаем на кнопку сохранения
    const saveButton = screen.getByText('Сохранить') as HTMLElement;
    fireEvent.click(saveButton);

    // Проверяем, что функция обновления пользователя была вызвана с правильными параметрами
    await waitFor(() => {
      const { api } = require('../../../api');
      const updateUserMutation = api.endpoints.updateUser.useMutation[0];
      expect(updateUserMutation).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '1',
          name: 'Обновленный Иванов',
        })
      );
    });

    // Проверяем, что отображается уведомление об успешном обновлении
    await waitFor(() => {
      expect(screen.getByText('Пользователь успешно обновлен')).toBeTruthy();
    });
  });

  it('должна удалять пользователя при подтверждении', async () => {
    renderWithProviders(<UsersPage />);

    // Находим кнопку удаления для первого пользователя
    const deleteButtons = screen.getAllByLabelText('Удалить пользователя') as HTMLElement[];
    fireEvent.click(deleteButtons[0]);

    // Проверяем, что диалог открылся
    await waitFor(() => {
      expect(screen.getByText('Подтверждение удаления')).toBeTruthy();
    });

    // Нажимаем на кнопку подтверждения
    const confirmButton = screen.getByText('Удалить') as HTMLElement;
    fireEvent.click(confirmButton);

    // Проверяем, что функция удаления пользователя была вызвана с правильным ID
    await waitFor(() => {
      const { api } = require('../../../api');
      const deleteUserMutation = api.endpoints.deleteUser.useMutation[0];
      expect(deleteUserMutation).toHaveBeenCalledWith('1');
    });

    // Проверяем, что диалог закрылся
    expect(screen.queryByText('Подтверждение удаления')).toBeNull();
  });

  it('должна отображать ошибки при неудачном создании пользователя', async () => {
    const { api } = require('../../../api');
    const mockCreateUser = vi.fn().mockRejectedValue({
      status: 400,
      data: {
        message: 'Ошибка валидации',
        errors: {
          email: 'Некорректный email'
        }
      }
    });
    
    api.endpoints.createUser.useMutation[0] = mockCreateUser;
    api.endpoints.createUser.useMutation[1] = { 
      isLoading: false, 
      error: {
        status: 400,
        data: {
          message: 'Ошибка валидации',
          errors: {
            email: 'Некорректный email'
          }
        }
      }
    };

    renderWithProviders(<UsersPage />);

    // Нажимаем на кнопку создания пользователя
    const createButton = screen.getByText('Создать пользователя') as HTMLElement;
    fireEvent.click(createButton);

    // Заполняем форму создания пользователя с некорректным email
    const nameInput = await screen.findByLabelText('Имя') as HTMLInputElement;
    const emailInput = await screen.findByLabelText('Email') as HTMLInputElement;
    const passwordInput = await screen.findByLabelText('Пароль') as HTMLInputElement;
    const roleSelect = await screen.findByLabelText('Роль') as HTMLElement;

    fireEvent.change(nameInput, { target: { value: 'Тестовый Пользователь' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Открываем выпадающий список ролей
    fireEvent.mouseDown(roleSelect);
    
    // Выбираем роль "Пользователь"
    const userOption = screen.getByText('Пользователь') as HTMLElement;
    fireEvent.click(userOption);

    // Нажимаем на кнопку сохранения
    const saveButton = screen.getByText('Сохранить') as HTMLElement;
    fireEvent.click(saveButton);

    // Проверяем, что функция создания пользователя была вызвана
    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalled();
    });

    // Проверяем, что отображается сообщение об ошибке
    await waitFor(() => {
      expect(screen.getByText('Некорректный email')).toBeTruthy();
    });
  });
});
