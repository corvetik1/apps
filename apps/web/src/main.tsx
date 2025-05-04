import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/app';

/**
 * Инициализация и рендеринг приложения
 *
 * Блок D (MSW-моки) активирован для тестирования без бэкенда
 */

// Импортируем и инициализируем MSW для мокирования API
// Используем асинхронную функцию для инициализации приложения
async function startApp() {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    console.log('🔶 [MSW] Инициализация моков для разработки...');
    const { worker } = await import('./mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }

  // Рендерим приложение
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  
  root.render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );

  // Для отладки
  console.log('Финансовая платформа запущена');
  document.title = 'Финансовая платформа | MVP-1';
}

// Запускаем приложение
startApp();
