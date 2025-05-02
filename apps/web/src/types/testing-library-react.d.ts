// Расширение типов для @testing-library/react
import '@testing-library/react';
import { queries } from '@testing-library/dom';

declare module '@testing-library/react' {
  export interface Screen {
    getByText: (
      id: string | RegExp,
      options?: queries.ByTextOptions
    ) => HTMLElement;
    queryByText: (
      id: string | RegExp,
      options?: queries.ByTextOptions
    ) => HTMLElement | null;
  }
}

export {};
