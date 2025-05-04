import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { store } from './store';
import { authActions } from './store/slices/authSlice';

/**
 * Инициализация и рендеринг приложения
 *
 * Блок D (MSW-моки) активирован для тестирования без бэкенда
 */

// Импортируем и инициализируем MSW для мокирования API
// Используем асинхронную функцию для инициализации приложения
async function startApp() {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    console.log('🗦 [MSW] Инициализация моков для разработки...');
    const { worker } = await import('./mocks/browser');
    // Для MSW 2.x необходимо использовать правильные настройки
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js',
        options: {
          // Указываем область видимости Service Worker
          scope: '/',
        },
      },
    }).catch(error => {
      console.error('[MSW] Ошибка инициализации MSW:', error);
    });
  }

  // Восстанавливаем сессию из localStorage при загрузке приложения
  store.dispatch(authActions.restoreSession());

  // Рендерим приложение
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );

  // Для отладки
  console.log('Финансовая платформа запущена');
  document.title = 'Финансовая платформа | MVP-1';
}

// Запускаем приложение
startApp();
