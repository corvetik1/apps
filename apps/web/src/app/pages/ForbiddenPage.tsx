/**
 * Страница с ошибкой доступа (403 Forbidden)
 *
 * Этот компонент отображается, когда у пользователя недостаточно прав
 * для доступа к запрашиваемому ресурсу.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../app.module.css';

/**
 * Компонент страницы с ошибкой доступа
 */
export const ForbiddenPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Доступ запрещен</h1>
        <p className={styles.message}>У вас недостаточно прав для доступа к этой странице.</p>
        <div className={styles.actions}>
          <Link to="/" className={styles.button}>
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
};
