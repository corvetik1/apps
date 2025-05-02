// Расширение типов для @testing-library/jest-dom
import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string | RegExp): R;
      toBeVisible(): R;
      // Другие матчеры по необходимости
    }
  }
}

// Расширение типов для @testing-library/react
declare module '@testing-library/react' {
  interface JestMatchers<T> {
    toBeInTheDocument(): T;
    toHaveTextContent(text: string | RegExp): T;
    toBeVisible(): T;
  }
}

export {};
