import '@testing-library/jest-dom';

// Расширяем matchers для Jest и @jest/expect
declare global {
  namespace jest {
    interface Matchers<R, T = unknown> {
      toBeInTheDocument(): R;
      toHaveTextContent(content: string | RegExp): R;
      toBeDisabled(): R;
    }
  }
}

declare module '@jest/expect' {
  interface Matchers<R, T = unknown> {
    toBeInTheDocument(): R;
    toHaveTextContent(content: string | RegExp): R;
    toBeDisabled(): R;
  }
}

export {};
