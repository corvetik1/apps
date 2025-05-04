/**
 * Мок для модуля env.ts в тестовой среде
 */

// Тип для переменных окружения
type EnvVariables = {
  MODE: 'development' | 'production' | 'test';
  VITE_API_URL: string;
  VITE_USE_MOCKS: string;
};

// Экспортируем все функции из оригинального модуля как моки
export const isProduction = jest.fn().mockReturnValue(false);
export const isDevelopment = jest.fn().mockReturnValue(false);
export const isTest = jest.fn().mockReturnValue(true);
export const getApiUrl = jest.fn().mockReturnValue('http://localhost:3333/api/v1');
export const useMocks = jest.fn().mockReturnValue(true);
export const getEnv = jest.fn(<K extends keyof EnvVariables>(key: K, defaultValue?: EnvVariables[K]): EnvVariables[K] => {
  const envMap: EnvVariables = {
    MODE: 'test',
    VITE_API_URL: 'http://localhost:3333/api/v1',
    VITE_USE_MOCKS: 'true',
  };
  return (key in envMap ? envMap[key] : defaultValue) as EnvVariables[K];
});
