/**
 * Тесты для страницы с ошибкой доступа
 *
 * Этот модуль содержит тесты для компонента страницы с ошибкой доступа (403 Forbidden).
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ForbiddenPage from '../ForbiddenPage';

describe('ForbiddenPage', () => {
  it('должен отрендерить страницу с ошибкой доступа', () => {
    // Рендерим компонент внутри MemoryRouter, так как он использует Link из react-router-dom
    render(
      <MemoryRouter>
        <ForbiddenPage />
      </MemoryRouter>
    );

    // Проверяем заголовок
    const header = screen.getByText('Доступ запрещен');
    expect(header).toBeTruthy();

    // Проверяем сообщение об ошибке
    const message = screen.getByText('У вас недостаточно прав для доступа к этой странице.');
    expect(message).toBeTruthy();

    // Проверяем наличие ссылки на главную страницу
    const link = screen.getByText('Вернуться на главную');
    expect(link).toBeTruthy();
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('/');
  });

  it('должен содержать стили для элементов страницы', () => {
    // Рендерим компонент
    render(
      <MemoryRouter>
        <ForbiddenPage />
      </MemoryRouter>
    );

    // Проверяем наличие стилей
    const container = screen.getByText('Доступ запрещен').closest('div');
    expect(container).toBeTruthy();
    
    if (container) {
      // Проверяем классы CSS
      const pageDiv = container.parentElement;
      expect(pageDiv?.className).toContain('page');
      
      expect(container.className).toContain('container');
      
      const title = screen.getByText('Доступ запрещен');
      expect(title.className).toContain('title');
      
      const message = screen.getByText('У вас недостаточно прав для доступа к этой странице.');
      expect(message.className).toContain('message');
      
      const link = screen.getByText('Вернуться на главную');
      expect(link.className).toContain('button');
      
      const actionsDiv = link.closest('div');
      expect(actionsDiv?.className).toContain('actions');
    }
  });
});
