/**
 * Тесты для authSlice
 *
 * Этот модуль содержит тесты для Redux slice аутентификации,
 * проверяя корректность работы редьюсеров и селекторов.
 */

// Используем мок для типа Role, так как в тестовом окружении может быть проблема с импортом из @finance-platform/shared
enum Role {
  Admin = 'admin',
  Manager = 'manager',
  User = 'user',
  Guest = 'guest',
  Accountant = 'accountant'
}
import {
  authReducer,
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  refreshTokenStart,
  refreshTokenSuccess,
  refreshTokenFailure,
  updateSession,
  clearError,
  selectIsAuthenticated,
  selectUser,
  selectUserRole,
  selectPermissions,
  selectAuthError,
  selectIsAuthLoading,
} from '../authSlice';

describe('authSlice', () => {
  // Начальное состояние для тестов
  const initialState = {
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

  // Тестовые данные
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    role: Role.User,
  };

  const mockTokens = {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    expiresIn: 3600,
  };

  const mockAuthResponse = {
    user: mockUser,
    ...mockTokens,
  };

  const mockSessionInfo = {
    userId: '1',
    role: Role.User,
    permissions: ['users:read:own', 'users:update:own'],
    expiresAt: Date.now() + 3600000,
  };

  const mockError = 'Ошибка аутентификации';

  describe('редьюсеры', () => {
    it('должен вернуть начальное состояние', () => {
      expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('должен обрабатывать loginStart', () => {
      const actual = authReducer(initialState, loginStart());
      expect(actual.isLoading).toBe(true);
      expect(actual.error).toBe(null);
    });

    it('должен обрабатывать loginSuccess', () => {
      const startState = { ...initialState, isLoading: true };
      const actual = authReducer(startState, loginSuccess(mockAuthResponse));

      expect(actual.isAuthenticated).toBe(true);
      expect(actual.userId).toBe(mockUser.id);
      expect(actual.email).toBe(mockUser.email);
      expect(actual.name).toBe(mockUser.name);
      expect(actual.role).toBe(mockUser.role);
      expect(actual.accessToken).toBe(mockTokens.accessToken);
      expect(actual.refreshToken).toBe(mockTokens.refreshToken);
      expect(actual.isLoading).toBe(false);
      expect(actual.error).toBe(null);
      expect(actual.expiresAt).toBeDefined();
    });

    it('должен обрабатывать loginFailure', () => {
      const startState = { ...initialState, isLoading: true };
      const actual = authReducer(startState, loginFailure(mockError));

      expect(actual.isAuthenticated).toBe(false);
      expect(actual.isLoading).toBe(false);
      expect(actual.error).toBe(mockError);
    });

    it('должен обрабатывать logout', () => {
      const startState = {
        isAuthenticated: true,
        userId: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
        expiresAt: Date.now() + 3600000,
        permissions: [],
        isLoading: false,
        error: null,
      };

      const actual = authReducer(startState, logout());
      expect(actual).toEqual(initialState);
    });

    it('должен обрабатывать refreshTokenStart', () => {
      const actual = authReducer(initialState, refreshTokenStart());
      expect(actual.isLoading).toBe(true);
      expect(actual.error).toBe(null);
    });

    it('должен обрабатывать refreshTokenSuccess', () => {
      const startState = {
        ...initialState,
        isAuthenticated: true,
        userId: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        isLoading: true,
      };

      const actual = authReducer(startState, refreshTokenSuccess(mockAuthResponse));

      expect(actual.accessToken).toBe(mockTokens.accessToken);
      expect(actual.refreshToken).toBe(mockTokens.refreshToken);
      expect(actual.isLoading).toBe(false);
      expect(actual.error).toBe(null);
      expect(actual.expiresAt).toBeDefined();
    });

    it('должен обрабатывать refreshTokenFailure', () => {
      const startState = { ...initialState, isLoading: true };
      const actual = authReducer(startState, refreshTokenFailure(mockError));

      expect(actual.isLoading).toBe(false);
      expect(actual.error).toBe(mockError);
    });

    it('должен обрабатывать updateSession', () => {
      const actual = authReducer(initialState, updateSession(mockSessionInfo));

      expect(actual.userId).toBe(mockSessionInfo.userId);
      expect(actual.role).toBe(mockSessionInfo.role);
      expect(actual.permissions).toEqual(mockSessionInfo.permissions);
      expect(actual.expiresAt).toBe(mockSessionInfo.expiresAt);
    });

    it('должен обрабатывать clearError', () => {
      const startState = { ...initialState, error: mockError };
      const actual = authReducer(startState, clearError());

      expect(actual.error).toBe(null);
    });
  });

  describe('селекторы', () => {
    const mockState = {
      auth: {
        isAuthenticated: true,
        userId: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
        expiresAt: Date.now() + 3600000,
        permissions: mockSessionInfo.permissions,
        isLoading: false,
        error: null,
      },
    };

    it('selectIsAuthenticated должен возвращать статус аутентификации', () => {
      expect(selectIsAuthenticated(mockState as any)).toBe(true);
    });

    it('selectUser должен возвращать информацию о пользователе', () => {
      expect(selectUser(mockState as any)).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
      });
    });

    it('selectUserRole должен возвращать роль пользователя', () => {
      expect(selectUserRole(mockState as any)).toBe(mockUser.role);
    });

    it('selectPermissions должен возвращать разрешения пользователя', () => {
      expect(selectPermissions(mockState as any)).toEqual(mockSessionInfo.permissions);
    });

    it('selectAuthError должен возвращать ошибку аутентификации', () => {
      const stateWithError = {
        auth: {
          ...mockState.auth,
          error: mockError,
        },
      };
      expect(selectAuthError(stateWithError as any)).toBe(mockError);
    });

    it('selectIsAuthLoading должен возвращать статус загрузки', () => {
      const stateWithLoading = {
        auth: {
          ...mockState.auth,
          isLoading: true,
        },
      };
      expect(selectIsAuthLoading(stateWithLoading as any)).toBe(true);
    });
  });
});
