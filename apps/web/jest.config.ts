// Конфигурация Jest для веб-приложения
export default {
  displayName: 'web',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/web',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.{ts,tsx}',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/types.{ts,tsx}',
    '!src/**/__mocks__/**',
    '!src/mocks/**',
    '!src/assets/**',
  ],
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'html'],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 45,
      lines: 40,
      statements: 40
    }
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '<rootDir>/jest-setup.js',
    '<rootDir>/src/test-setup-env.ts',
    '<rootDir>/src/setupTests.ts',
    '<rootDir>/src/jest-setup.ts',
    '<rootDir>/jest.setup.js',
  ],
  testPathIgnorePatterns: ['/node_modules/'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      diagnostics: false,
    },
  },
  // Автоматически мокировать модули, если есть директория __mocks__
  automock: false,
  resetMocks: false,
  // Указываем модули, которые нужно мокировать
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};
