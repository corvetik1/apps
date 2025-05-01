/**
 * Компонент кнопки выхода из системы
 *
 * Этот компонент отображает кнопку для выхода пользователя из системы.
 */

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import styles from '../auth.module.css';

/**
 * Свойства компонента кнопки выхода
 */
interface LogoutButtonProps {
  /** Текст кнопки */
  text?: string;
  /** Дополнительные классы */
  className?: string;
  /** Обработчик успешного выхода */
  onSuccess?: () => void;
}

/**
 * Компонент кнопки выхода из системы
 */
export const LogoutButton: React.FC<LogoutButtonProps> = ({
  text = 'Выйти',
  className = '',
  onSuccess,
}) => {
  // Хук аутентификации
  const { logout, isLoading } = useAuth();

  /**
   * Обработчик клика по кнопке выхода
   */
  const handleLogout = async () => {
    try {
      // Выход из системы
      await logout();

      // Вызываем обработчик успешного выхода
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Ошибка обрабатывается в хуке useAuth
      console.error('Ошибка выхода:', error);
    }
  };

  return (
    <button
      className={`${styles['logout-button']} ${className}`}
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? 'Выход...' : text}
    </button>
  );
};
