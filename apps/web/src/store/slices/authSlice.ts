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

      state.isAuthenticated = true;
      state.userId = user.id;
      state.email = user.email;
      state.name = user.name;
      state.role = user.role as Role;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.expiresAt = Date.now() + expiresIn * 1000;
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
    logout: state => {
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
} = authSlice.actions;

// Экспортируем редьюсер
export const authReducer = authSlice.reducer;

// Селекторы
export const selectAuth = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectUser = (state: RootState) => ({
  id: state.auth.userId,
  email: state.auth.email,
  name: state.auth.name,
  role: state.auth.role,
});
export const selectUserRole = (state: RootState) => state.auth.role;
export const selectPermissions = (state: RootState) => state.auth.permissions;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsAuthLoading = (state: RootState) => state.auth.isLoading;
