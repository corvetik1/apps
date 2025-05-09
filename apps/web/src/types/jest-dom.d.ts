// Расширение типов для @testing-library/jest-dom
import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      // Основные матчеры
      toBeInTheDocument(): R;
      toHaveTextContent(text: string | RegExp, options?: { normalizeWhitespace: boolean }): R;
      toBeVisible(): R;
      
      // Матчеры для значений
      toHaveValue(value: string | number | string[]): R;
      toBeEmpty(): R;
      
      // Матчеры для состояния
      toBeDisabled(): R;
      toBeEnabled(): R;
      toBeRequired(): R;
      toBeValid(): R;
      toBeInvalid(): R;
      toHaveFocus(): R;
      
      // Матчеры для структуры
      toContainElement(element: HTMLElement | null): R;
      toContainHTML(html: string): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveClass(...classNames: string[]): R;
      toHaveStyle(css: string): R;
      toHaveFormValues(expectedValues: Record<string, any>): R;
    }
  }
}

// Расширение типов для @testing-library/react
declare module '@testing-library/react' {
  interface JestMatchers<T> {
    // Основные матчеры
    toBeInTheDocument(): T;
    toHaveTextContent(text: string | RegExp, options?: { normalizeWhitespace: boolean }): T;
    toBeVisible(): T;
    
    // Матчеры для значений
    toHaveValue(value: string | number | string[]): T;
    toBeEmpty(): T;
    
    // Матчеры для состояния
    toBeDisabled(): T;
    toBeEnabled(): T;
    toBeRequired(): T;
    toBeValid(): T;
    toBeInvalid(): T;
    toHaveFocus(): T;
    
    // Матчеры для структуры
    toContainElement(element: HTMLElement | null): T;
    toContainHTML(html: string): T;
    toHaveAttribute(attr: string, value?: string): T;
    toHaveClass(...classNames: string[]): T;
    toHaveStyle(css: string): T;
    toHaveFormValues(expectedValues: Record<string, any>): T;
  }
}

export {};
