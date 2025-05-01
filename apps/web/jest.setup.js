/**
 * Настройка окружения для тестов Jest
 *
 * Этот файл добавляет полифиллы для Web API, которые не доступны в среде Node.js
 */

// Импортируем и экспортируем Jest глобальные объекты,
// чтобы они были доступны во всех тестах
const jestGlobals = require('@jest/globals');

// Делаем Jest глобальным
global.jest = jestGlobals.jest;
global.expect = jestGlobals.expect;
global.test = jestGlobals.test;
global.describe = jestGlobals.describe;
global.beforeEach = jestGlobals.beforeEach;
global.afterEach = jestGlobals.afterEach;
global.beforeAll = jestGlobals.beforeAll;
global.afterAll = jestGlobals.afterAll;
global.it = jestGlobals.it;

// Полифилл для TextEncoder/TextDecoder
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// Полифилл для fetch, Request, Response и т.д.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetch = require('whatwg-fetch');

// Простые заглушки для Web Streams API
class MockStream {
  getReader() {
    return { read: () => Promise.resolve({ done: true, value: undefined }) };
  }
  getWriter() {
    return { write: () => Promise.resolve(), close: () => Promise.resolve() };
  }
  pipeTo() {
    return Promise.resolve();
  }
  pipeThrough() {
    return new MockStream();
  }
}

global.ReadableStream = global.ReadableStream || MockStream;
global.WritableStream = global.WritableStream || MockStream;
global.TransformStream =
  global.TransformStream ||
  class TransformStream {
    constructor() {
      this.readable = new MockStream();
      this.writable = new MockStream();
    }
  };

// Настройка для MSW
require('msw/node');
