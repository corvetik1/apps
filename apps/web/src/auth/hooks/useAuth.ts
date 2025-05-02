/**
 * Хук для работы с аутентификацией
 *
 * Этот хук предоставляет методы для входа, выхода и проверки аутентификации пользователя.
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
  refreshTokenStart,
  refreshTokenSuccess,
  refreshTokenFailure,
  selectAuth,
  selectIsAuthenticated,
  selectUser,
  selectUserRole,
  selectPermissions,
  selectAuthError,
} from '../../store/slices/authSlice';
import {
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
} from '../../api/authApi';

// Вспомогательная функция для получения текста ошибки
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return typeof error === 'string' ? error : 'Произошла неизвестная ошибка';
};
import { LoginRequest, Role } from '@finance-platform/shared';

// Определяем тип ответа аутентификации локально
interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: Role;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Хук для работы с аутентификацией
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const role = useSelector(selectUserRole);
  const permissions = useSelector(selectPermissions);
  const error = useSelector(selectAuthError);

  // RTK Query хуки
  const [loginMutation] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();
  const [refreshTokenMutation] = useRefreshTokenMutation();

  /**
   * Вход в систему
   */
  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        dispatch(loginStart());
        const response = await loginMutation(credentials).unwrap() as AuthResponse;
        dispatch(loginSuccess(response));

        // Сохраняем токены в localStorage, если включена опция "запомнить меня"
        if (credentials.rememberMe) {
          localStorage.setItem('refreshToken', response.refreshToken);
        } else {
          // Иначе сохраняем в sessionStorage (только на время сессии)
          sessionStorage.setItem('refreshToken', response.refreshToken);
        }

        return response;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        dispatch(loginFailure(errorMessage));
        throw new Error(errorMessage);
      }
    },
    [dispatch, loginMutation],
  );

  /**
   * Выход из системы
   */
  const logout = useCallback(async () => {
    try {
      if (isAuthenticated) {
        await logoutMutation({}).unwrap();
      }

      // Удаляем токены из хранилища
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('refreshToken');

      // Обновляем состояние в Redux
      dispatch(logoutAction());
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
    }
  }, [dispatch, isAuthenticated, logoutMutation]);

  /**
   * Обновление токена
   */
  const refreshToken = useCallback(async () => {
    try {
      // Получаем refreshToken из хранилища
      const storedRefreshToken =
        localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');

      if (!storedRefreshToken) {
        throw new Error('Отсутствует refreshToken');
      }

      dispatch(refreshTokenStart());
      const response = await refreshTokenMutation({ refreshToken: storedRefreshToken }).unwrap() as AuthResponse;
      dispatch(refreshTokenSuccess(response));

      // Обновляем токен в хранилище
      if (localStorage.getItem('refreshToken')) {
        localStorage.setItem('refreshToken', response.refreshToken);
      } else {
        sessionStorage.setItem('refreshToken', response.refreshToken);
      }

      return response;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(refreshTokenFailure(errorMessage));
      throw new Error(errorMessage);
    }
  }, [dispatch, refreshTokenMutation]);

  /**
   * Проверка, имеет ли пользователь указанную роль
   */
  const hasRole = useCallback(
    (requiredRole: Role) => {
      if (!isAuthenticated || !role) return false;

      // Администратор имеет доступ ко всему
      if (role === Role.Admin) return true;

      // Менеджер имеет доступ ко всему, кроме админских функций
      if (role === Role.Manager && requiredRole !== Role.Admin) return true;

      // Для остальных ролей - точное совпадение
      return role === requiredRole;
    },
    [isAuthenticated, role],
  );

  /**
   * Проверка, имеет ли пользователь указанное разрешение
   */
  const hasPermission = useCallback(
    (permission: string) => {
      if (!isAuthenticated) return false;
      return permissions.includes(permission);
    },
    [isAuthenticated, permissions],
  );

  return {
    // Состояние
    isAuthenticated,
    user,
    role,
    permissions,
    isLoading: auth.isLoading,
    error,

    // Методы
    login,
    logout,
    refreshToken,
    hasRole,
    hasPermission,
  };
};
