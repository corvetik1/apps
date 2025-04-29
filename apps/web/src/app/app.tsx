import styles from './app.module.css';

/**
 * Главный компонент приложения финансовой платформы
 *
 * @returns {JSX.Element} Корневой компонент приложения
 */
export function App() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Финансовая платформа</h1>
        <p>Текущий этап: MVP-0 (Каркас)</p>
      </header>

      <main className={styles.main}>
        <section className={styles.infoSection}>
          <h2>Добро пожаловать!</h2>
          <p>
            Это начальная версия финансовой платформы. В дальнейшем здесь будет реализована
            функциональность аутентификации, управления пользователями, тендерами и финансами.
          </p>
          <button
            className={styles.button}
            onClick={() => alert('Приветствуем вас в финансовой платформе!')}
          >
            Приветствие
          </button>
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
