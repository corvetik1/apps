// Глобальные расширения типов для Jest и Testing Library
import '@testing-library/jest-dom';

declare global {
  // Расширение типов для Jest
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string | RegExp): R;
      toBeVisible(): R;
    }
  }
}

// Расширение типов для Testing Library
declare namespace Testing {
  interface Matchers<R, T> {
    toBeInTheDocument(): R;
    toHaveTextContent(text: string | RegExp): R;
    toBeVisible(): R;
  }
}

// Расширение типов для expect
interface JestMatchers<T> {
  toBeInTheDocument(): T;
  toHaveTextContent(text: string | RegExp): T;
  toBeVisible(): T;
}

export {};
