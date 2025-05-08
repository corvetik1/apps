/**
 * Настройка Jest для совместимости с Vite и MSW 2.x
 */

// Глобальные переменные для тестов
global.process.env.MODE = 'test';
global.process.env.VITE_API_URL = 'http://localhost:3333/api/v1';
global.process.env.VITE_USE_MOCKS = 'true';

// Создаем глобальный объект для хранения переменных окружения Vite
global.__VITE_ENV__ = {
  MODE: 'test',
  VITE_API_URL: 'http://localhost:3333/api/v1',
  VITE_USE_MOCKS: 'true',
};

// Мокируем модуль utils/env.ts напрямую
jest.mock('../src/utils/env', () => ({
  isProduction: jest.fn().mockReturnValue(false),
  isDevelopment: jest.fn().mockReturnValue(false),
  isTest: jest.fn().mockReturnValue(true),
  getApiUrl: jest.fn().mockReturnValue('http://localhost:3333/api/v1'),
  useMocks: jest.fn().mockReturnValue(true),
  getEnv: jest.fn((key, defaultValue) => {
    const envMap = {
      MODE: 'test',
      VITE_API_URL: 'http://localhost:3333/api/v1',
      VITE_USE_MOCKS: 'true',
    };
    return envMap[key] || defaultValue;
  }),
}), { virtual: true });

// Отключаем предупреждения React
jest.spyOn(console, 'error').mockImplementation((message) => {
  if (message && message.includes('React does not recognize the')) {
    return;
  }
  // Для остальных ошибок сохраняем стандартное поведение
  console.error(message);
});

// Отключаем предупреждения от MSW
jest.spyOn(console, 'warn').mockImplementation((message) => {
  if (message && (
    message.includes('MSW') ||
    message.includes('Mock Service Worker') ||
    message.includes('worker') ||
    message.includes('Ошибка при инициализации переменных окружения')
  )) {
    return;
  }
  // Для остальных предупреждений сохраняем стандартное поведение
  console.warn(message);
});

// Полифилл для BroadcastChannel, необходимый для MSW 2.x
class BroadcastChannelPolyfill {
  constructor(channel) {
    this.channel = channel;
    this.listeners = [];
  }

  postMessage(message) {
    // Имитация отправки сообщения
    this.listeners.forEach(listener => {
      listener({ data: message });
    });
  }

  addEventListener(type, listener) {
    if (type === 'message') {
      this.listeners.push(listener);
    }
  }

  removeEventListener(type, listener) {
    if (type === 'message') {
      this.listeners = this.listeners.filter(l => l !== listener);
    }
  }

  close() {
    this.listeners = [];
  }
}

// Добавляем BroadcastChannel в глобальный объект
global.BroadcastChannel = BroadcastChannelPolyfill;

