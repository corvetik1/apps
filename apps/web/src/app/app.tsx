import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store';
import { LoginPage } from '../auth/pages/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';
import { ForbiddenPage } from './pages/ForbiddenPage';
import { DashboardPage } from './pages/DashboardPage';
import styles from './app.module.css';

/**
 * Главный компонент приложения финансовой платформы
 *
 * @returns {JSX.Element} Корневой компонент приложения
 */
export function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className={styles.container}>
          <Routes>
            {/* Публичные маршруты */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forbidden" element={<ForbiddenPage />} />

            {/* Защищенные маршруты */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            {/* Перенаправление на страницу входа для неизвестных маршрутов */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

/**
 * Компонент главной страницы
 */
function HomePage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Финансовая платформа</h1>
        <p>Текущий этап: MVP-1 (Аутентификация)</p>
      </header>

      <main className={styles.main}>
        <section className={styles.infoSection}>
          <h2>Добро пожаловать!</h2>
          <p>
            Вы успешно вошли в систему. Здесь будет реализована функциональность управления
            пользователями, тендерами и финансами.
          </p>
        </section>

        <section className={styles.roadmapSection}>
          <h2>Дорожная карта</h2>
          <ul className={styles.roadmapList}>
            <li className={`${styles.roadmapItem} ${styles.current}`}>
              <strong>MVP-0:</strong> Каркас приложения
            </li>
            <li className={styles.roadmapItem}>
              <strong>MVP-1:</strong> Аутентификация
            </li>
            <li className={styles.roadmapItem}>
              <strong>MVP-2:</strong> Пользователи и роли
            </li>
            <li className={styles.roadmapItem}>
              <strong>MVP-3:</strong> Тендеры
            </li>
            <li className={styles.roadmapItem}>
              <strong>MVP-4:</strong> Финансы
            </li>
          </ul>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2025 Финансовая платформа</p>
      </footer>
    </div>
  );
}

export default App;
