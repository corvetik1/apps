import { setupWorker } from 'msw/browser';
import { handlers } from './handlers/index';

// Настраиваем Service Worker с определенными обработчиками запросов для MSW 2.x
export const worker = setupWorker(...handlers);

// Обработка ошибок MSW
worker.events.on('request:unhandled', ({ request }) => {
  console.warn(`Незарегистрированный запрос: ${request.method} ${request.url}`);
});

worker.events.on('response:mocked', ({ request, response }) => {
  console.debug(`Запрос перехвачен MSW: ${request.method} ${request.url} → ${response.status}`);
});
