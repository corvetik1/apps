/**
 * Страница дашборда
 *
 * Этот компонент отображает дашборд с основной информацией
 * и статистикой для пользователя.
 */

import React from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { LogoutButton } from '../../auth/components/LogoutButton';
import styles from '../app.module.css';

/**
 * Компонент страницы дашборда
 */
export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Дашборд</h1>
        <div className={styles.userInfo}>
          <span>{user.name}</span>
          <LogoutButton />
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.infoSection}>
          <h2>Аналитика</h2>
          <p>Здесь будет отображаться аналитика и статистика по финансовым показателям.</p>
        </section>

        <section className={styles.infoSection}>
          <h2>Последние транзакции</h2>
          <p>Здесь будет список последних транзакций.</p>
        </section>

        <section className={styles.infoSection}>
          <h2>Активные тендеры</h2>
          <p>Здесь будет список активных тендеров.</p>
        </section>
      </main>
    </div>
  );
};
