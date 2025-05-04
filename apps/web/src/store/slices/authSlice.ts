/**
 * Redux slice для управления состоянием аутентификации
 *
 * Этот модуль содержит редьюсеры и действия для управления
 * состоянием аутентификации пользователя.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Role, AuthResponse, SessionInfo } from '@finance-platform/shared';
import { RootState } from '..';

/**
 * Интерфейс состояния аутентификации
 */
interface AuthState {
  /** Флаг аутентификации пользователя */
  isAuthenticated: boolean;
  /** Идентификатор пользователя */
  userId: string | null;
  /** Email пользователя */
  email: string | null;
  /** Имя пользователя */
  name: string | null;
  /** Роль пользователя */
  role: Role | null;
  /** Токен доступа */
  accessToken: string | null;
  /** Токен для обновления сессии */
  refreshToken: string | null;
  /** Время истечения токена */
  expiresAt: number | null;
  /** Список разрешений пользователя */
  permissions: string[];
  /** Флаг загрузки */
  isLoading: boolean;
  /** Сообщение об ошибке */
  error: string | null;
}

/**
 * Начальное состояние аутентификации
 */
const initialState: AuthState = {
  isAuthenticated: false,
  userId: null,
  email: null,
  name: null,
  role: null,
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
  permissions: [],
  isLoading: false,
  error: null,
};

/**
 * Slice для управления состоянием аутентификации
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Начало процесса аутентификации
     */
    loginStart: state => {
      state.isLoading = true;
      state.error = null;
    },

    /**
     * Успешная аутентификация
     */
    loginSuccess: (state, action: PayloadAction<AuthResponse>) => {
      const { user, accessToken, refreshToken, expiresIn } = action.payload;
      const expiresAt = Date.now() + expiresIn * 1000;

      // Сохраняем данные в localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('expiresAt', expiresAt.toString());
      localStorage.setItem('userId', user.id);
      localStorage.setItem('email', user.email);
      localStorage.setItem('name', user.name);
      localStorage.setItem('role', user.role);

      state.isAuthenticated = true;
      state.userId = user.id;
      state.email = user.email;
      state.name = user.name;
      state.role = user.role as Role;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.expiresAt = expiresAt;
      state.isLoading = false;
      state.error = null;
    },

    /**
     * Ошибка аутентификации
     */
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = action.payload;
    },

    /**
     * Обновление информации о сессии
     */
    updateSession: (state, action: PayloadAction<SessionInfo>) => {
      const { userId, role, permissions, expiresAt } = action.payload;

      state.userId = userId;
      state.role = role;
      state.permissions = permissions;
      state.expiresAt = expiresAt;
    },

    /**
     * Выход из системы
     */
    logout: () => {
      // Очищаем данные аутентификации из localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('expiresAt');
      localStorage.removeItem('userId');
      localStorage.removeItem('email');
      localStorage.removeItem('name');
      localStorage.removeItem('role');
      
      return initialState;
    },

    /**
     * Начало процесса обновления токена
     */
    refreshTokenStart: state => {
      state.isLoading = true;
      state.error = null;
    },

    /**
     * Успешное обновление токена
     */
    refreshTokenSuccess: (state, action: PayloadAction<AuthResponse>) => {
      const { accessToken, refreshToken, expiresIn } = action.payload;

      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.expiresAt = Date.now() + expiresIn * 1000;
      state.isLoading = false;
      state.error = null;
    },

    /**
     * Ошибка обновления токена
     */
    refreshTokenFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    /**
     * Сброс ошибки
     */
    clearError: state => {
      state.error = null;
    },
    
    /**
     * Восстановление сессии из localStorage
     */
    restoreSession: state => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const expiresAtString = localStorage.getItem('expiresAt');
      const userId = localStorage.getItem('userId');
      const email = localStorage.getItem('email');
      const name = localStorage.getItem('name');
      const roleString = localStorage.getItem('role');
      
      // Проверяем, что все необходимые данные есть в localStorage
      if (accessToken && refreshToken && expiresAtString && userId && email && name && roleString) {
        const expiresAt = parseInt(expiresAtString, 10);
        const role = roleString as Role;
        
        // Проверяем, что токен не истек
        if (expiresAt > Date.now()) {
          state.isAuthenticated = true;
          state.userId = userId;
          state.email = email;
          state.name = name;
          state.role = role;
          state.accessToken = accessToken;
          state.refreshToken = refreshToken;
          state.expiresAt = expiresAt;
        } else {
          // Если токен истек, очищаем localStorage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('expiresAt');
          localStorage.removeItem('userId');
          localStorage.removeItem('email');
          localStorage.removeItem('name');
          localStorage.removeItem('role');
        }
      }
    },
  },
});

// Экспортируем действия
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  updateSession,
  logout,
  refreshTokenStart,
  refreshTokenSuccess,
  refreshTokenFailure,
  clearError,
  restoreSession,
} = authSlice.actions;

// Экспортируем действия как объект для удобства использования
export const authActions = authSlice.actions;

// Экспортируем редьюсер
export const authReducer = authSlice.reducer;

// Селекторы
import { createSelector } from '@reduxjs/toolkit';

export const selectAuth = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

// Мемоизированный селектор пользователя с помощью createSelector
export const selectUser = createSelector(
  [
    (state: RootState) => state.auth.userId,
    (state: RootState) => state.auth.email,
    (state: RootState) => state.auth.name,
    (state: RootState) => state.auth.role,
  ],
  (id, email, name, role) => ({
    id,
    email,
    name,
    role,
  }),
);

export const selectUserRole = (state: RootState) => state.auth.role;
export const selectPermissions = (state: RootState) => state.auth.permissions;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsAuthLoading = (state: RootState) => state.auth.isLoading;
