/**
 * Настройка тестового окружения для Vitest
 * 
 * Этот файл автоматически загружается перед запуском тестов благодаря настройке setupFiles в vite.config.ts
 */

// Импортируем Vitest для доступа к глобальным функциям
import { expect, afterEach, vi } from 'vitest';

// Импортируем специальную версию Jest-DOM для Vitest
import '@testing-library/jest-dom/vitest';

// Импортируем функцию очистки из React Testing Library
import { cleanup } from '@testing-library/react';

// Автоматическая очистка после каждого теста
afterEach(() => {
  cleanup();
});

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
