/**
 * Настройка тестового окружения для Vitest
 *
 * Этот файл автоматически загружается перед запуском тестов
 * благодаря настройке setupFiles в vite.config.ts
 */

// Импортируем функции из Vitest для глобального использования
import { expect, afterEach, beforeEach, describe, it, vi, beforeAll, afterAll } from 'vitest';

// Импортируем специальную версию Jest-DOM для Vitest
import '@testing-library/jest-dom/vitest';

// Импортируем MSW для мокирования API
import { setupServer } from 'msw/node';
import { authHandlers } from './mocks/handlers/auth';
// TODO: Импортировать другие обработчики по мере их создания (e.g., usersHandlers)

// Объединяем все обработчики (если есть другие, добавьте их сюда)
const allHandlers = [...authHandlers];

// Создаем и настраиваем MSW сервер
export const server = setupServer(...allHandlers);

// Импортируем функцию очистки из React Testing Library
import { cleanup } from '@testing-library/react';

// Делаем функции Vitest глобальными
// Это позволит использовать их без импорта в тестовых файлах
Object.assign(global, { expect, afterEach, beforeEach, describe, it, vi });

// Запускаем сервер перед всеми тестами
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Автоматическая очистка после каждого теста
afterEach(() => {
  cleanup();
  server.resetHandlers(); // Сбрасываем обработчики MSW после каждого теста
});

// Закрываем сервер после всех тестов
afterAll(() => server.close());

// Подавление предупреждений React
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' && 
    (
      args[0].includes('Warning: ReactDOM.render is no longer supported') ||
      args[0].includes('React does not recognize the') ||
      args[0].includes('Invalid prop')
    )
  ) {
    return;
  }
  originalConsoleError(...args);
};

// Подавление предупреждений MSW
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' && 
    (args[0].includes('MSW') || args[0].includes('Mock Service Worker'))
  ) {
    return;
  }
  originalConsoleWarn(...args);
};
