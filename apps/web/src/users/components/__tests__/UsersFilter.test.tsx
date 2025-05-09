/**
 * Тесты для компонента UsersFilter
 *
 * Этот файл содержит тесты для проверки функциональности фильтрации пользователей,
 * включая ввод данных, сброс фильтров и применение фильтров.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { UsersFilter } from '../UsersFilter';

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

// Создаем тестовую тему
const theme = createTheme();

// Функция для рендеринга компонента с необходимыми провайдерами
const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  );
};

describe('UsersFilter', () => {
  // Мокируем обработчик изменения фильтров
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен корректно отображать форму фильтрации', () => {
    renderWithTheme(
      <UsersFilter onFilterChange={mockOnFilterChange} />
    );

    // Проверяем, что поля фильтрации отображаются
    expect(screen.getByLabelText('Имя пользователя')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Роль')).toBeInTheDocument();

    // Проверяем, что кнопки отображаются
    expect(screen.getByText('Сбросить')).toBeInTheDocument();
    expect(screen.getByText('Применить')).toBeInTheDocument();
  });

  it('должен корректно обрабатывать ввод данных', () => {
    renderWithTheme(
      <UsersFilter onFilterChange={mockOnFilterChange} />
    );

    // Находим поля ввода
    const nameInput = screen.getByLabelText('Имя пользователя');
    const emailInput = screen.getByLabelText('Email');
    const roleSelect = screen.getByLabelText('Роль');

    // Вводим данные в поля
    fireEvent.change(nameInput, { target: { value: 'Иван' } });
    fireEvent.change(emailInput, { target: { value: 'ivan@example.com' } });
    
    // Открываем выпадающий список ролей
    fireEvent.mouseDown(roleSelect);
    
    // Выбираем роль "Администратор"
    const adminOption = screen.getByText('Администратор');
    fireEvent.click(adminOption);

    // Нажимаем на кнопку "Применить"
    const applyButton = screen.getByText('Применить');
    fireEvent.click(applyButton);

    // Проверяем, что обработчик был вызван с правильными параметрами
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      name: 'Иван',
      email: 'ivan@example.com',
      role: mockRole.Admin
    });
  });

  it('должен корректно обрабатывать сброс фильтров', () => {
    // Рендерим компонент с начальными фильтрами
    renderWithTheme(
      <UsersFilter 
        initialFilters={{
          name: 'Иван',
          email: 'ivan@example.com',
          role: mockRole.Admin
        }}
        onFilterChange={mockOnFilterChange}
      />
    );

    // Проверяем, что поля заполнены начальными значениями
    expect(screen.getByLabelText('Имя пользователя')).toHaveValue('Иван');
    expect(screen.getByLabelText('Email')).toHaveValue('ivan@example.com');

    // Нажимаем на кнопку "Сбросить"
    const resetButton = screen.getByText('Сбросить');
    fireEvent.click(resetButton);

    // Проверяем, что поля очищены
    expect(screen.getByLabelText('Имя пользователя')).toHaveValue('');
    expect(screen.getByLabelText('Email')).toHaveValue('');

    // Проверяем, что обработчик был вызван с пустыми фильтрами
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      name: '',
      email: '',
      role: ''
    });
  });

  it('должен обновлять состояние при изменении начальных фильтров', () => {
    // Рендерим компонент с начальными фильтрами
    const { rerender } = renderWithTheme(
      <UsersFilter 
        initialFilters={{
          name: 'Иван',
          email: 'ivan@example.com',
          role: mockRole.Admin
        }}
        onFilterChange={mockOnFilterChange}
      />
    );

    // Проверяем, что поля заполнены начальными значениями
    expect(screen.getByLabelText('Имя пользователя')).toHaveValue('Иван');
    expect(screen.getByLabelText('Email')).toHaveValue('ivan@example.com');

    // Обновляем компонент с новыми начальными фильтрами
    rerender(
      <ThemeProvider theme={theme}>
        <UsersFilter 
          initialFilters={{
            name: 'Петр',
            email: 'petr@example.com',
            role: mockRole.Manager
          }}
          onFilterChange={mockOnFilterChange}
        />
      </ThemeProvider>
    );

    // Проверяем, что поля обновлены новыми значениями
    expect(screen.getByLabelText('Имя пользователя')).toHaveValue('Петр');
    expect(screen.getByLabelText('Email')).toHaveValue('petr@example.com');
  });

  it('должен отправлять форму при нажатии на Enter', () => {
    renderWithTheme(
      <UsersFilter onFilterChange={mockOnFilterChange} />
    );

    // Находим поле ввода имени
    const nameInput = screen.getByLabelText('Имя пользователя');

    // Вводим данные в поле
    fireEvent.change(nameInput, { target: { value: 'Иван' } });

    // Нажимаем Enter в поле ввода
    fireEvent.keyDown(nameInput, { key: 'Enter', code: 'Enter' });

    // Проверяем, что обработчик был вызван с правильными параметрами
    expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Иван'
    }));
  });

  it('должен корректно обрабатывать выбор всех ролей', () => {
    renderWithTheme(
      <UsersFilter onFilterChange={mockOnFilterChange} />
    );

    // Находим поле выбора роли
    const roleSelect = screen.getByLabelText('Роль');

    // Открываем выпадающий список ролей
    fireEvent.mouseDown(roleSelect);
    
    // Выбираем опцию "Все роли"
    const allRolesOption = screen.getByText('Все роли');
    fireEvent.click(allRolesOption);

    // Нажимаем на кнопку "Применить"
    const applyButton = screen.getByText('Применить');
    fireEvent.click(applyButton);

    // Проверяем, что обработчик был вызван с пустой ролью
    expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({
      role: ''
    }));
  });
});
