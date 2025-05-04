/**
 * Настройка переменных окружения для тестов
 * 
 * Этот файл настраивает окружение для тестов, устанавливая переменные окружения.
 */

// Устанавливаем переменные окружения для тестов
process.env.MODE = 'test';
process.env.VITE_API_URL = 'http://localhost:3333/api/v1';
process.env.VITE_USE_MOCKS = 'true';

// Мокируем global.navigator для тестов
Object.defineProperty(global, 'navigator', {
  value: {
    userAgent: 'node.js',
  },
  writable: true,
});

// Если еще какие-то тесты требуют import.meta, можно раскомментировать это
/* 
Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: {
        MODE: 'test',
        VITE_API_URL: 'http://localhost:3333/api/v1',
        VITE_USE_MOCKS: 'true',
      },
    },
  },
  writable: true,
});
*/
