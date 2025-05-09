/**
 * Интеграционные тесты для страницы пользователей
 *
 * Этот файл содержит тесты для проверки интеграции компонентов на странице пользователей,
 * включая фильтрацию, сортировку, пагинацию и действия с пользователями.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { UsersPage } from '../UsersPage';
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

// Мокируем хуки API
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
    jest.clearAllMocks();
  });

  it('должна корректно отображать страницу пользователей', async () => {
    renderWithProviders(<UsersPage />);

    // Проверяем, что заголовок страницы отображается
    expect(screen.getByText('Управление пользователями')).toBeInTheDocument();
    
    // Проверяем, что кнопка создания пользователя отображается
    expect(screen.getByText('Создать пользователя')).toBeInTheDocument();
    
    // Проверяем, что кнопка фильтров отображается
    expect(screen.getByText('Фильтры')).toBeInTheDocument();
    
    // Проверяем, что таблица пользователей отображается
    expect(screen.getByText('Имя')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Роль')).toBeInTheDocument();
    
    // Проверяем, что данные пользователей отображаются
    expect(screen.getByText('Иван Иванов')).toBeInTheDocument();
    expect(screen.getByText('ivan@example.com')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  it('должна открывать форму создания пользователя при нажатии на кнопку', async () => {
    renderWithProviders(<UsersPage />);

    // Нажимаем на кнопку создания пользователя
    const createButton = screen.getByText('Создать пользователя');
    fireEvent.click(createButton);

    // Проверяем, что диалог открылся
    await waitFor(() => {
      expect(screen.getByText('Создание пользователя')).toBeInTheDocument();
    });

    // Проверяем, что форма содержит все необходимые поля
    expect(screen.getByLabelText('Имя')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Роль')).toBeInTheDocument();
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
  });

  it('должна открывать форму редактирования при нажатии на кнопку редактирования', async () => {
    renderWithProviders(<UsersPage />);

    // Находим кнопку редактирования для первого пользователя
    const editButtons = screen.getAllByLabelText('Редактировать пользователя');
    fireEvent.click(editButtons[0]);

    // Проверяем, что диалог открылся
    await waitFor(() => {
      expect(screen.getByText('Редактирование пользователя')).toBeInTheDocument();
    });

    // Проверяем, что форма содержит данные пользователя
    expect(screen.getByLabelText('Имя')).toHaveValue('Иван Иванов');
    expect(screen.getByLabelText('Email')).toHaveValue('ivan@example.com');
  });

  it('должна открывать диалог подтверждения при нажатии на кнопку удаления', async () => {
    renderWithProviders(<UsersPage />);

    // Находим кнопку удаления для первого пользователя
    const deleteButtons = screen.getAllByLabelText('Удалить пользователя');
    fireEvent.click(deleteButtons[0]);

    // Проверяем, что диалог открылся
    await waitFor(() => {
      expect(screen.getByText('Подтверждение удаления')).toBeInTheDocument();
    });

    // Проверяем, что диалог содержит имя пользователя
    expect(screen.getByText(/Иван Иванов/)).toBeInTheDocument();
  });

  it('должна отображать фильтры при нажатии на кнопку фильтров', async () => {
    renderWithProviders(<UsersPage />);

    // Нажимаем на кнопку фильтров
    const filterButton = screen.getByText('Фильтры');
    fireEvent.click(filterButton);

    // Проверяем, что форма фильтрации отображается
    await waitFor(() => {
      expect(screen.getByLabelText('Имя пользователя')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Роль')).toBeInTheDocument();
    });
  });

  it('должна применять фильтры при заполнении формы фильтрации', async () => {
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
    expect(jest.requireMock('../../../api/usersApi').useGetUsersQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Иван'
      })
    );
  });

  it('должна создавать нового пользователя при заполнении формы создания', async () => {
    renderWithProviders(<UsersPage />);

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
      expect(jest.requireMock('../../../api/usersApi').useCreateUserMutation()[0]).toHaveBeenCalledWith(
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
  });

  it('должна обновлять пользователя при редактировании', async () => {
    renderWithProviders(<UsersPage />);

    // Находим кнопку редактирования для первого пользователя
    const editButtons = screen.getAllByLabelText('Редактировать пользователя');
    fireEvent.click(editButtons[0]);

    // Изменяем имя пользователя
    const nameInput = await screen.findByLabelText('Имя');
    fireEvent.change(nameInput, { target: { value: 'Обновленный Иванов' } });

    // Нажимаем на кнопку сохранения
    const saveButton = screen.getByText('Сохранить');
    fireEvent.click(saveButton);

    // Проверяем, что функция обновления пользователя была вызвана с правильными параметрами
    await waitFor(() => {
      expect(jest.requireMock('../../../api/usersApi').useUpdateUserMutation()[0]).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '1',
          data: expect.objectContaining({
            name: 'Обновленный Иванов'
          })
        })
      );
    });

    // Проверяем, что отображается уведомление об успешном обновлении
    await waitFor(() => {
      expect(screen.getByText('Пользователь успешно обновлен')).toBeInTheDocument();
    });
  });

  it('должна удалять пользователя при подтверждении', async () => {
    renderWithProviders(<UsersPage />);

    // Находим кнопку удаления для первого пользователя
    const deleteButtons = screen.getAllByLabelText('Удалить пользователя');
    fireEvent.click(deleteButtons[0]);

    // Нажимаем на кнопку подтверждения удаления
    const confirmButton = await screen.findByText('Удалить');
    fireEvent.click(confirmButton);

    // Проверяем, что функция удаления пользователя была вызвана с правильным ID
    await waitFor(() => {
      expect(jest.requireMock('../../../api/usersApi').useDeleteUserMutation()[0]).toHaveBeenCalledWith('1');
    });

    // Проверяем, что отображается уведомление об успешном удалении
    await waitFor(() => {
      expect(screen.getByText('Пользователь успешно удален')).toBeInTheDocument();
    });
  });

  it('должна отображать ошибки при неудачном создании пользователя', async () => {
    // Переопределяем мок для ошибки создания
    jest.requireMock('../../../api/usersApi').useCreateUserMutation.mockReturnValue([
      jest.fn().mockRejectedValue({
        status: 400,
        data: {
          message: 'Ошибка валидации',
          errors: {
            email: ['Email уже занят']
          }
        }
      }),
      { isLoading: false, error: {
        status: 400,
        data: {
          message: 'Ошибка валидации',
          errors: {
            email: ['Email уже занят']
          }
        }
      } }
    ]);

    renderWithProviders(<UsersPage />);

    // Нажимаем на кнопку создания пользователя
    const createButton = screen.getByText('Создать пользователя');
    fireEvent.click(createButton);

    // Заполняем форму создания пользователя
    const nameInput = await screen.findByLabelText('Имя');
    const emailInput = await screen.findByLabelText('Email');
    const passwordInput = await screen.findByLabelText('Пароль');
    const roleSelect = await screen.findByLabelText('Роль');

    fireEvent.change(nameInput, { target: { value: 'Новый Пользователь' } });
    fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Открываем выпадающий список ролей
    fireEvent.mouseDown(roleSelect);
    
    // Выбираем роль "Пользователь"
    const userOption = screen.getByText('Пользователь');
    fireEvent.click(userOption);

    // Нажимаем на кнопку сохранения
    const saveButton = screen.getByText('Сохранить');
    fireEvent.click(saveButton);

    // Проверяем, что отображается сообщение об ошибке
    await waitFor(() => {
      expect(screen.getByText('Ошибка валидации')).toBeInTheDocument();
      expect(screen.getByText('Email уже занят')).toBeInTheDocument();
    });
  });
});
