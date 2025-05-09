import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store';
import { LoginPage } from '../auth/pages/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';
import { ForbiddenPage } from './pages/ForbiddenPage';
import { DashboardPage } from './pages/DashboardPage';
import { UsersPage } from '../users/pages/UsersPage';
import AppBarAndMenu from '../components/AppBarAndMenu';
import { useAuth } from '../auth/hooks/useAuth';
import { AdminPage } from '../admin/pages/AdminPage';
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
          <AppWithAuth />
        </div>
      </Router>
    </Provider>
  );
}

/**
 * Компонент с аутентификацией и меню
 */
function AppWithAuth() {
  const { logout, isAuthenticated } = useAuth();
  
  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {isAuthenticated && <AppBarAndMenu onLogout={handleLogout} />}
      
      <div className={isAuthenticated ? styles.appWithMenu : ''}>
        <Routes>
          {/* Публичные маршруты */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forbidden" element={<ForbiddenPage />} />

          {/* Защищенные маршруты */}
          <Route element={<ProtectedRoute />}>
            {/* Главная страница */}
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* Основные модули */}
            <Route path="/tenders" element={<PlaceholderPage title="Тендеры" />} />
            <Route path="/analytics" element={<PlaceholderPage title="Аналитика" />} />
            <Route path="/finance" element={<PlaceholderPage title="Финансы" />} />
            <Route path="/investments" element={<PlaceholderPage title="Инвестиции" />} />
            <Route path="/notes" element={<PlaceholderPage title="Заметки" />} />
            <Route path="/gallery" element={<PlaceholderPage title="Галерея" />} />
            <Route path="/admin/*" element={<AdminPage />} />
            <Route path="/profile" element={<PlaceholderPage title="Профиль пользователя" />} />
          </Route>

          {/* Перенаправление на страницу входа для неизвестных маршрутов */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </>
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
        <p>Текущий этап: MVP-2 (Пользователи + роли)</p>
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

/**
 * Компонент-заглушка для страниц, которые будут реализованы позже
 */
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>{title}</h1>
        <p>Страница в разработке</p>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <h2>Модуль "{title}" находится в разработке</h2>
          <p>
            Эта страница является заглушкой для будущего функционала.
            В рамках текущего этапа MVP-2 (Пользователи + роли) реализуется
            базовая структура приложения и система разрешений.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
