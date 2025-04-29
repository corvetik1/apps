import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';

/**
 * Инициализация и рендеринг приложения
 *
 * Примечание: MSW временно отключен для исключения проблем с отображением.
 * Будет включен при реализации блока D (MSW-моки).
 */

// Прямой рендеринг без асинхронных вызовов
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Для отладки
console.log('Финансовая платформа запущена');
document.title = 'Финансовая платформа | MVP-0';
