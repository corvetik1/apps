/**
 * Страница входа в систему
 *
 * Эта страница отображает форму входа и обрабатывает перенаправление
 * после успешной аутентификации.
 */

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { useAuth } from '../hooks/useAuth';
import styles from '../auth.module.css';

/**
 * Страница входа в систему
 */
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Получаем URL для перенаправления после входа
  const from = (location.state as { from?: string })?.from || '/';

  // Если пользователь уже аутентифицирован, перенаправляем его
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  /**
   * Обработчик успешного входа
   */
  const handleLoginSuccess = () => {
    navigate(from, { replace: true });
  };

  return (
    <div className={styles['login-page']}>
      <div className={styles['login-container']}>
        <h1 className={styles['login-title']}>Финансовая платформа</h1>
        <p className={styles['login-subtitle']}>Войдите в систему, чтобы продолжить</p>

        <LoginForm onSuccess={handleLoginSuccess} />

        <div className={styles['login-footer']}>
          <p>&copy; {new Date().getFullYear()} Финансовая платформа. Все права защищены.</p>
        </div>
      </div>
    </div>
  );
};
