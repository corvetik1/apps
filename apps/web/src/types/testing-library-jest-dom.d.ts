import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(content: string | RegExp): R;
      // Добавьте сюда другие методы jest-dom по мере необходимости
    }
  }
}
