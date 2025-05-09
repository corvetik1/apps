/**
 * Глобальные типы для Vitest
 */

import { expect, vi, afterEach, beforeEach, describe, it } from 'vitest';

declare global {
  // Глобальные функции Vitest
  const expect: typeof expect;
  const vi: typeof vi;
  const afterEach: typeof afterEach;
  const beforeEach: typeof beforeEach;
  const describe: typeof describe;
  const it: typeof it;
}

// Это пустой экспорт, чтобы TypeScript считал файл модулем
export {};
