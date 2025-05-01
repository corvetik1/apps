/**
 * Компонент защищенного маршрута
 *
 * Этот компонент проверяет аутентификацию пользователя и перенаправляет
 * на страницу входа, если пользователь не аутентифицирован.
 */

import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/hooks/useAuth';
import { Role } from '@finance-platform/shared';

/**
 * Свойства компонента защищенного маршрута
 */
interface ProtectedRouteProps {
  /** Требуемая роль для доступа к маршруту */
  requiredRole?: Role;
  /** Требуемое разрешение для доступа к маршруту */
  requiredPermission?: string;
}

/**
 * Компонент защищенного маршрута
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRole,
  requiredPermission,
}) => {
  const { isAuthenticated, hasRole, hasPermission } = useAuth();
  const location = useLocation();

  // Проверяем аутентификацию
  if (!isAuthenticated) {
    // Перенаправляем на страницу входа с сохранением текущего URL
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Проверяем роль, если она требуется
  if (requiredRole && !hasRole(requiredRole)) {
    // Перенаправляем на страницу 403 (Доступ запрещен)
    return <Navigate to="/forbidden" replace />;
  }

  // Проверяем разрешение, если оно требуется
  if (requiredPermission && !hasPermission(requiredPermission)) {
    // Перенаправляем на страницу 403 (Доступ запрещен)
    return <Navigate to="/forbidden" replace />;
  }

  // Если все проверки пройдены, рендерим дочерние компоненты
  return <Outlet />;
};
