/**
 * Интеграционные тесты для страницы входа
 *
 * Этот модуль содержит интеграционные тесты для страницы входа,
 * проверяя корректность работы формы входа и перенаправления.
 */

import '@testing-library/jest-dom'; // Импортируем базовый модуль

// Используем модульный синтаксис вместо namespace
// Для обхода ошибок типизации используем приведение типов (as any)
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach, beforeAll } from '@jest/globals';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from '../LoginPage';
import { authReducer } from '../../../store/slices/authSlice';
import { api } from '../../../api';
import * as authApi from '../../../api/authApi';

// Локальное определение ролей для тестов, чтобы не тянуть внешние типы
enum Role {
  Admin = 'admin',
  User = 'user',
  Manager = 'manager',
  Guest = 'guest',
}

// Тестовые данные - определяем до использования
const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: Role.User,
};

const mockAuthResponse = {
  user: mockUser,
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  expiresIn: 3600,
};

// Моки для функций RTK Query
// Прагматичный подход: используем any в тестах для упрощения

/**
 * Прагматичный подход к тестированию RTK Query
 * Работаем с простыми мок-функциями без сложной типизации
 */

// Создаем локальную мок-функцию для использования в тестах
const mockLoginMutation = jest.fn();

// Создаем глобальную мок-функцию для RTK Query с методом unwrap
const mockLoginTrigger: any = jest.fn();

// Связываем глобальный мок с локальным
mockLoginTrigger.mockImplementation((...args) => {
  // Вызываем локальную мок-функцию для записи вызовов
  mockLoginMutation(...args);

  // Возвращаем объект с методом unwrap
  return {
    unwrap: () => Promise.resolve(mockAuthResponse),
  };
});

// Мок для хука RTK Query
const mockLoginHook: any = [mockLoginTrigger, { isLoading: false, reset: jest.fn() }];

// Мок для вспомогательной функции
const mockGetErrorMessage = jest.fn(
  (error: any) => (error && error.message) || 'Неизвестная ошибка',
);

describe('LoginPage - интеграционные тесты', () => {
  // Настраиваем моки для тестирования
  beforeAll(() => {
    // Мокируем хуки RTK Query с использованием jest.spyOn
    jest.spyOn(authApi, 'useLoginMutation').mockImplementation(() => mockLoginHook);

    // Мокируем вспомогательную функцию с использованием Object.defineProperty
    // Это более надежно, чем jest.spyOn, для функций, которые не являются хуками
    Object.defineProperty(authApi, 'getErrorMessage', {
      value: mockGetErrorMessage,
    });
  });

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

  // Компонент для тестирования перенаправления
  const TestApp = ({ initialEntries = ['/login'] }) => {
    const store = createTestStore();

    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<div>Главная страница</div>} />
            <Route path="/dashboard" element={<div>Дашборд</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    // Сбрасываем моки перед каждым тестом
    jest.clearAllMocks();

    // Очищаем localStorage и sessionStorage
    localStorage.clear();
    sessionStorage.clear();
  });

  it('должен отображать форму входа', () => {
    render(<TestApp />);

    // Проверяем наличие элементов формы
    // Используем type assertion для обхода проблем с типами
    (expect(screen.getByText('Финансовая платформа')) as any).toBeInTheDocument();
    (expect(screen.getByText('Войдите в систему, чтобы продолжить')) as any).toBeInTheDocument();
    (expect(screen.getByLabelText('Email')) as any).toBeInTheDocument();
    (expect(screen.getByLabelText('Пароль')) as any).toBeInTheDocument();
    (expect(screen.getByLabelText('Запомнить меня')) as any).toBeInTheDocument();
    (expect(screen.getByRole('button', { name: 'Войти' })) as any).toBeInTheDocument();
  });

  it('должен отправлять форму с правильными данными', async () => {
    // Сбрасываем счетчик вызовов мока перед тестом
    mockLoginMutation.mockClear();

    // Не нужно переопределять mockLoginTrigger здесь, так как он уже настроен в глобальной настройке

    render(<TestApp />);

    // Заполняем форму
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByLabelText('Пароль'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByLabelText('Запомнить меня'));

    // Отправляем форму
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

    // Проверяем, что метод API был вызван с правильными параметрами
    await waitFor(() => {
      expect(mockLoginMutation).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true,
      });
    });
  });

  it('должен отображать ошибки валидации', async () => {
    render(<TestApp />);

    // Отправляем пустую форму
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

    // Проверяем, что отображаются ошибки валидации
    await waitFor(() => {
      (expect(screen.getByText('Email обязателен')) as any).toBeInTheDocument();
      (expect(screen.getByText('Пароль обязателен')) as any).toBeInTheDocument();
    });
  });

  it('должен отображать ошибку аутентификации', async () => {
    // Настраиваем мок для ошибки входа
    const errorMessage = 'Неверный email или пароль';

    // Сбрасываем счетчик вызовов мока перед тестом
    mockLoginMutation.mockClear();

    // Переопределяем метод unwrap для возврата ошибки
    mockLoginTrigger.mockImplementation((...args) => {
      mockLoginMutation(...args); // Сохраняем вызов в локальном моке
      return {
        unwrap: () => Promise.reject(new Error(errorMessage)),
      };
    });

    render(<TestApp />);

    // Заполняем форму
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByLabelText('Пароль'), {
      target: { value: 'wrong-password' },
    });

    // Отправляем форму
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

    // Проверяем, что отображается ошибка аутентификации
    await waitFor(() => {
      (expect(screen.getByText(errorMessage)) as any).toBeInTheDocument();
    });
  });

  it('должен перенаправлять на главную страницу после успешного входа', async () => {
    // Сбрасываем счетчик вызовов мока перед тестом
    mockLoginMutation.mockClear();

    // Возвращаем исходную имплементацию для успешного входа
    mockLoginTrigger.mockImplementation((...args) => {
      mockLoginMutation(...args); // Сохраняем вызов в локальном моке
      return {
        unwrap: () => Promise.resolve(mockAuthResponse),
      };
    });

    render(<TestApp />);

    // Заполняем форму
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByLabelText('Пароль'), {
      target: { value: 'password123' },
    });

    // Отправляем форму
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

    // Проверяем, что произошло перенаправление на главную страницу
    await waitFor(() => {
      (expect(screen.getByText('Главная страница')) as any).toBeInTheDocument();
    });
  });

  it('должен перенаправлять на указанную страницу после успешного входа', async () => {
    // Настраиваем мок для успешного входа - используем прагматичный подход в тестах
    // Сбрасываем моки и настраиваем их для текущего теста
    mockLoginMutation.mockClear();
    mockLoginTrigger.mockImplementation((...args) => {
      mockLoginMutation(...args);
      return {
        unwrap: () => Promise.resolve(mockAuthResponse),
      };
    });

    // Устанавливаем начальный путь с параметром from
    render(
      <TestApp initialEntries={[{ pathname: '/login', state: { from: '/dashboard' } } as any]} />,
    );

    // Заполняем форму
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByLabelText('Пароль'), {
      target: { value: 'password123' },
    });

    // Отправляем форму
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

    // Проверяем, что произошло перенаправление на дашборд
    await waitFor(() => {
      (expect(screen.getByText('Дашборд')) as any).toBeInTheDocument();
    });
  });

  it('должен отображать кнопку в состоянии загрузки', async () => {
    // Настраиваем мок для состояния загрузки
    jest
      .spyOn(authApi, 'useLoginMutation')
      .mockImplementation(() => [mockLoginTrigger, { isLoading: true, reset: jest.fn() }]);

    render(<TestApp />);

    // Заполняем форму
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByLabelText('Пароль'), {
      target: { value: 'password123' },
    });

    // Отправляем форму
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

    // Проверяем, что кнопка находится в состоянии загрузки
    (expect(screen.getByRole('button', { name: 'Вход...' })) as any).toBeInTheDocument();
    (expect(screen.getByRole('button', { name: 'Вход...' })) as any).toBeDisabled();
  });
});
