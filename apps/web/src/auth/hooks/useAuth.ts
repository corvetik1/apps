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
} from '../../store/slices/authSlice';
import {
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  getErrorMessage,
} from '../../api/authApi';
import { LoginRequest, Role } from '@finance-platform/shared';

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
        const response = await loginMutation(credentials).unwrap();
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
        await logoutMutation();
      }
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
    } finally {
      // Удаляем токены из хранилища
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('refreshToken');

      // Очищаем состояние
      dispatch(logoutAction());
    }
  }, [dispatch, isAuthenticated, logoutMutation]);

  /**
   * Обновление токена
   */
  const refreshToken = useCallback(async () => {
    try {
      // Получаем refreshToken из localStorage или sessionStorage
      const storedRefreshToken =
        localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');

      if (!storedRefreshToken) {
        throw new Error('Токен обновления не найден');
      }

      dispatch(refreshTokenStart());
      const response = await refreshTokenMutation({ refreshToken: storedRefreshToken }).unwrap();
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

      // Если не удалось обновить токен, выходим из системы
      logout();

      throw new Error(errorMessage);
    }
  }, [dispatch, refreshTokenMutation, logout]);

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
    error: auth.error,

    // Методы
    login,
    logout,
    refreshToken,
    hasRole,
    hasPermission,
  };
};
