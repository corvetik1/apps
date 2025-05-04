/**
 * Конфигурация Redux store
 *
 * Этот модуль содержит конфигурацию Redux store, включая все редьюсеры,
 * middleware и настройки для работы с Redux DevTools.
 */

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authReducer } from './slices/authSlice';
import { api } from '../api';
import { isProduction } from '../utils/env';

/**
 * Корневой Redux store приложения
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware),
  // Используем утилиту env для совместимости с Jest
  devTools: !isProduction(),
});

// Настройка слушателей для RTK Query
setupListeners(store.dispatch);

// Типы для TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
