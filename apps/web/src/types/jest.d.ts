// Глобальные типы для Jest
import '@testing-library/jest-dom';

interface ExpectInterface {
  // Базовые методы
  toBeTruthy(): void;
  toBeFalsy(): void;
  toBeNull(): void;
  toBeUndefined(): void;
  toBeDefined(): void;
  toEqual(value: unknown): void;
  toStrictEqual(value: unknown): void;
  toBeInTheDocument(): void;
  toHaveTextContent(text: string | RegExp): void;
  // Добавляем другие методы по мере необходимости
}

interface JestInterface {
  fn<T = unknown, Y extends unknown[] = unknown[]>(
    implementation?: (...args: Y) => T,
  ): (...args: Y) => T;
  // Добавляем другие методы по мере необходимости
}

declare global {
  const describe: (name: string, fn: () => void) => void;
  const it: (name: string, fn: () => void) => void;
  const expect: <T>(actual: T) => ExpectInterface;
  const beforeEach: (fn: () => void) => void;
  const afterEach: (fn: () => void) => void;
  const beforeAll: (fn: () => void) => void;
  const afterAll: (fn: () => void) => void;
  const test: (name: string, fn: () => void) => void;
  const jest: JestInterface;
}
