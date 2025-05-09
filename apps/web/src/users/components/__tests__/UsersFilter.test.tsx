/**
 * Тесты для компонента UsersFilter
 *
 * Этот файл содержит тесты для проверки функциональности фильтрации пользователей,
 * включая ввод данных, сброс фильтров и применение фильтров.
 */

import { vi, describe, it, expect, beforeEach } from 'vitest';

// Используем vi.hoisted для mockRole, чтобы он был доступен в фабрике vi.mock
const { mockRole } = vi.hoisted(() => {
  return {
    mockRole: {
      Admin: 'admin',
      Manager: 'manager',
      User: 'user',
      Accountant: 'accountant',
      Guest: 'guest'
    }
  };
});

// Мокируем shared модуль до импорта компонентов
vi.mock('@finance-platform/shared', () => {
  return {
    Role: mockRole, // Теперь mockRole доступен здесь
    __esModule: true // Важно для правильного мокирования ES модулей
  };
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { UsersFilter } from '../UsersFilter';

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
  const mockOnFilterChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('должен корректно отображать форму фильтрации', () => {
    renderWithTheme(
      <UsersFilter onFilterChange={mockOnFilterChange} />
    );

    // Проверяем, что поля фильтрации отображаются
    expect(screen.getByLabelText('Имя пользователя')).toBeTruthy();
    expect(screen.getByLabelText('Email')).toBeTruthy();
    expect(screen.getByLabelText('Роль')).toBeTruthy();

    // Проверяем, что кнопки отображаются
    expect(screen.getByText('Сбросить')).toBeTruthy();
    expect(screen.getByText('Применить')).toBeTruthy();
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
    // Убедимся, что текст опции соответствует тому, что отображается в UI
    // Обычно это значение из enum Role или его текстовое представление
    const adminOption = screen.getByText('Администратор'); // Предполагаем, что 'Администратор' - это отображаемое значение
    fireEvent.click(adminOption);

    // Нажимаем на кнопку "Применить"
    const applyButton = screen.getByText('Применить');
    fireEvent.click(applyButton);

    // Проверяем, что обработчик был вызван с правильными параметрами
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      name: 'Иван',
      email: 'ivan@example.com',
      role: mockRole.Admin // Используем mockRole.Admin для сравнения
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
    expect((screen.getByLabelText('Имя пользователя') as HTMLInputElement).value).toBe('Иван');
    expect((screen.getByLabelText('Email') as HTMLInputElement).value).toBe('ivan@example.com');

    // Нажимаем на кнопку "Сбросить"
    const resetButton = screen.getByText('Сбросить');
    fireEvent.click(resetButton);

    // Проверяем, что поля очищены
    expect((screen.getByLabelText('Имя пользователя') as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText('Email') as HTMLInputElement).value).toBe('');

    // Проверяем, что обработчик был вызван с пустыми фильтрами
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      name: '',
      email: '',
      role: '' // или null/undefined, в зависимости от логики компонента
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
    expect((screen.getByLabelText('Имя пользователя') as HTMLInputElement).value).toBe('Иван');
    expect((screen.getByLabelText('Email') as HTMLInputElement).value).toBe('ivan@example.com');

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
    expect((screen.getByLabelText('Имя пользователя') as HTMLInputElement).value).toBe('Петр');
    expect((screen.getByLabelText('Email') as HTMLInputElement).value).toBe('petr@example.com');
  });

  it('должен отправлять форму при нажатии на Enter', async () => {
    renderWithTheme(
      <UsersFilter onFilterChange={mockOnFilterChange} />
    );

    // Находим поле ввода имени
    const nameInput = screen.getByLabelText('Имя пользователя');

    // Вводим данные в поле
    fireEvent.change(nameInput, { target: { value: 'Иван' } });

    // Нажимаем Enter в поле ввода
    fireEvent.keyDown(nameInput, { key: 'Enter', code: 'Enter', charCode: 13 });

    // Ожидаем вызова mockOnFilterChange. Может потребоваться waitFor, если есть асинхронность.
    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Иван'
      }));
    });
  });

  it('должен корректно обрабатывать выбор всех ролей', async () => {
    renderWithTheme(
      <UsersFilter onFilterChange={mockOnFilterChange} />
    );

    const roleSelect = screen.getByLabelText('Роль');
    fireEvent.mouseDown(roleSelect);
    // Предполагаем, что опция 'Все роли' имеет пустую строку в качестве значения или специфическое отображаемое имя
    const allRolesOption = await screen.findByText('Все роли'); // или другое отображаемое значение для "всех ролей"
    fireEvent.click(allRolesOption);

    const applyButton = screen.getByText('Применить');
    fireEvent.click(applyButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({
      role: '' // или другое значение, представляющее "все роли"
    }));
  });
});
