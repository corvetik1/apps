// Типы для Jest
import { jest } from '@jest/globals';

declare global {
  namespace NodeJS {
    interface Global {
      expect: typeof import('expect');
      describe: typeof import('@jest/globals').describe;
      it: typeof import('@jest/globals').it;
      test: typeof import('@jest/globals').test;
      beforeAll: typeof import('@jest/globals').beforeAll;
      beforeEach: typeof import('@jest/globals').beforeEach;
      afterAll: typeof import('@jest/globals').afterAll;
      afterEach: typeof import('@jest/globals').afterEach;
      jest: typeof jest;
    }
  }
}

// Глобальные типы для тестов
declare global {
  const describe: typeof import('@jest/globals').describe;
  const it: typeof import('@jest/globals').it;
  const test: typeof import('@jest/globals').test;
  const expect: typeof import('expect');
  const beforeAll: typeof import('@jest/globals').beforeAll;
  const beforeEach: typeof import('@jest/globals').beforeEach;
  const afterAll: typeof import('@jest/globals').afterAll;
  const afterEach: typeof import('@jest/globals').afterEach;
  const jest: typeof jest;
}
