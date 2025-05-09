/**
 * Имитация базы данных для моков
 *
 * Этот модуль содержит имитацию базы данных для использования в моках,
 * включая таблицы с пользователями, счетами, транзакциями и тендерами.
 */

import { factory, primaryKey } from '@mswjs/data';
import { Role } from '@finance-platform/shared';

/**
 * Модель базы данных для моков
 */
export const db = factory({
  // Модель пользователя
  user: {
    id: primaryKey(String),
    email: String,
    name: String,
    password: String,
    role: String,
    departmentId: String,
    transactionLimit: Number,
    createdAt: String,
    updatedAt: String,
  },

  // Модель счета
  account: {
    id: primaryKey(String),
    name: String,
    balance: Number,
    currency: String,
    isActive: Boolean,
    departmentId: String,
    userId: String,
    createdAt: String,
    updatedAt: String,
  },

  // Модель транзакции
  transaction: {
    id: primaryKey(String),
    amount: Number,
    currency: String,
    description: String,
    type: String,
    status: String,
    accountId: String,
    userId: String,
    createdAt: String,
    updatedAt: String,
  },

  // Модель тендера
  tender: {
    id: primaryKey(String),
    title: String,
    description: String,
    budget: Number,
    currency: String,
    status: String,
    startDate: String,
    endDate: String,
    isClosed: Boolean,
    departmentId: String,
    createdBy: String,
    createdAt: String,
    updatedAt: String,
  },
});

/**
 * Заполнение базы данных начальными данными
 */
export const seedDb = () => {
  // Очищаем базу данных
  // Очищаем базу данных, удаляя все записи
  // MSW Data API не имеет метода clear(), поэтому нужно удалять по одной записи
  const allUsers = db.user.getAll();
  allUsers.forEach(user => {
    try {
      db.user.delete({
        where: {
          id: {
            equals: user.id,
          },
        },
      });
    } catch (e) {
      console.error('Error deleting user:', e);
    }
  });

  const allAccounts = db.account.getAll();
  allAccounts.forEach(account => {
    try {
      db.account.delete({
        where: {
          id: {
            equals: account.id,
          },
        },
      });
    } catch (e) {
      console.error('Error deleting account:', e);
    }
  });

  const allTransactions = db.transaction.getAll();
  allTransactions.forEach(transaction => {
    try {
      db.transaction.delete({
        where: {
          id: {
            equals: transaction.id,
          },
        },
      });
    } catch (e) {
      console.error('Error deleting transaction:', e);
    }
  });

  const allTenders = db.tender.getAll();
  allTenders.forEach(tender => {
    try {
      db.tender.delete({
        where: {
          id: {
            equals: tender.id,
          },
        },
      });
    } catch (e) {
      console.error('Error deleting tender:', e);
    }
  });

  // Добавляем пользователей
  db.user.create({
    id: '1',
    email: 'admin@example.com',
    name: 'Администратор',
    password: 'admin123',
    role: Role.Admin,
    departmentId: '1',
    transactionLimit: 1000000,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  });

  db.user.create({
    id: '2',
    email: 'manager@example.com',
    name: 'Менеджер',
    password: 'manager123',
    role: Role.Manager,
    departmentId: '1',
    transactionLimit: 500000,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  });

  db.user.create({
    id: '3',
    email: 'user@example.com',
    name: 'Пользователь',
    password: 'user123',
    role: Role.User,
    departmentId: '2',
    transactionLimit: 100000,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  });

  db.user.create({
    id: '4',
    email: 'guest@example.com',
    name: 'Гость',
    password: 'guest123',
    role: Role.Guest,
    departmentId: '',
    transactionLimit: 0,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  });
  
  // Добавляем пользователя с ролью бухгалтера
  db.user.create({
    id: '5',
    email: 'accountant@example.com',
    name: 'Бухгалтер',
    password: 'finance456',
    role: Role.Accountant,
    departmentId: '3',
    transactionLimit: 300000,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  });

  // Добавляем тестового пользователя для useAuth.test.tsx
  db.user.create({
    id: '6',
    email: 'test@example.com',
    name: 'Тестовый Пользователь',
    password: 'password123', // Используется в useAuth.test.tsx
    role: Role.User,
    departmentId: '2',
    transactionLimit: 100000,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  });

  // Добавляем счета
  db.account.create({
    id: '1',
    name: 'Основной счет',
    balance: 1000000,
    currency: 'RUB',
    isActive: true,
    departmentId: '1',
    userId: '1',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  });

  db.account.create({
    id: '2',
    name: 'Счет отдела разработки',
    balance: 500000,
    currency: 'RUB',
    isActive: true,
    departmentId: '2',
    userId: '2',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  });

  // Добавляем транзакции
  db.transaction.create({
    id: '1',
    amount: 50000,
    currency: 'RUB',
    description: 'Оплата услуг',
    type: 'expense',
    status: 'completed',
    accountId: '1',
    userId: '1',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  });

  db.transaction.create({
    id: '2',
    amount: 100000,
    currency: 'RUB',
    description: 'Поступление средств',
    type: 'income',
    status: 'completed',
    accountId: '2',
    userId: '2',
    createdAt: '2023-01-03T00:00:00Z',
    updatedAt: '2023-01-03T00:00:00Z',
  });

  // Добавляем тендеры
  db.tender.create({
    id: '1',
    title: 'Разработка веб-приложения',
    description: 'Разработка веб-приложения для управления финансами',
    budget: 1000000,
    currency: 'RUB',
    status: 'active',
    startDate: '2023-01-01T00:00:00Z',
    endDate: '2023-12-31T23:59:59Z',
    isClosed: false,
    departmentId: '1',
    createdBy: '1',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  });

  db.tender.create({
    id: '2',
    title: 'Закупка оборудования',
    description: 'Закупка компьютерного оборудования для офиса',
    budget: 500000,
    currency: 'RUB',
    status: 'active',
    startDate: '2023-01-01T00:00:00Z',
    endDate: '2023-06-30T23:59:59Z',
    isClosed: false,
    departmentId: '2',
    createdBy: '2',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  });
};

// Заполняем базу данных при импорте модуля
seedDb();
