/**
 * Упрощенная утилита для доступа к переменным окружения
 * Для использования в Jest и Vite
 * Использует фиксированные значения для тестов, избегая проблем с import.meta
 */

/**
 * Проверка, является ли текущая среда продакшн
 */
export const isProduction = () => false;

/**
 * Проверка, является ли текущая среда разработкой
 */
export const isDevelopment = () => true;

/**
 * Проверка, является ли текущая среда тестовой
 */
export const isTest = () => typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';

/**
 * Получить базовый URL API
 */
export const getApiUrl = () => 'http://localhost:3333/api/v1';

/**
 * Проверка, использовать ли моки
 */
export const useMocks = () => true;

/**
 * Получить значение переменной окружения
 * @param key Ключ переменной окружения
 * @param defaultValue Значение по умолчанию
 */
export const getEnv = (key: string, defaultValue?: string): string => {
  // Фиксированные значения для тестовой и разработческой среды
  const envMap: Record<string, string> = {
    'MODE': 'development',
    'VITE_API_URL': 'http://localhost:3333/api/v1',
    'VITE_USE_MOCKS': 'true',
  };
  
  return key in envMap ? envMap[key] : (defaultValue || '');
};
