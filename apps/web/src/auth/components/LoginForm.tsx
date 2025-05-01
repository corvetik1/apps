/**
 * Компонент формы входа
 *
 * Этот компонент отображает форму для ввода email и пароля
 * для аутентификации пользователя.
 */

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoginRequest } from '@finance-platform/shared';
import styles from '../auth.module.css';

/**
 * Свойства компонента формы входа
 */
interface LoginFormProps {
  /** Обработчик успешного входа */
  onSuccess?: () => void;
}

/**
 * Компонент формы входа
 */
export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  // Состояние формы
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
    rememberMe: false,
  });

  // Состояние валидации
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Хук аутентификации
  const { login, isLoading, error } = useAuth();

  /**
   * Обработчик изменения полей формы
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Сбрасываем ошибку для поля при его изменении
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  /**
   * Валидация формы
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Проверка email
    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный формат email';
    }

    // Проверка пароля
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Пароль должен содержать не менее 8 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Обработчик отправки формы
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Валидация формы
    if (!validateForm()) {
      return;
    }

    try {
      // Вход в систему
      await login(formData);

      // Вызываем обработчик успешного входа
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Ошибка обрабатывается в хуке useAuth
      console.error('Ошибка входа:', error);
    }
  };

  return (
    <div className={styles['login-form-container']}>
      <h2 className={styles['login-form-title']}>Вход в систему</h2>

      <form className={styles['login-form']} onSubmit={handleSubmit}>
        {/* Поле email */}
        <div className={styles['form-group']}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? styles['input-error'] : ''}
            disabled={isLoading}
            autoComplete="username"
          />
          {errors.email && <div className={styles['error-message']}>{errors.email}</div>}
        </div>

        {/* Поле пароля */}
        <div className={styles['form-group']}>
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? styles['input-error'] : ''}
            disabled={isLoading}
            autoComplete="current-password"
          />
          {errors.password && <div className={styles['error-message']}>{errors.password}</div>}
        </div>

        {/* Чекбокс "Запомнить меня" */}
        <div className={`${styles['form-group']} ${styles['checkbox']}`}>
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            disabled={isLoading}
          />
          <label htmlFor="rememberMe">Запомнить меня</label>
        </div>

        {/* Сообщение об ошибке */}
        {error && <div className={styles['form-error']}>{error}</div>}

        {/* Кнопка отправки */}
        <button type="submit" className={styles['login-button']} disabled={isLoading}>
          {isLoading ? 'Вход...' : 'Войти'}
        </button>
      </form>
    </div>
  );
};
