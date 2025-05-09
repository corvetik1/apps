# Финансовая платформа

![Nx logo](https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png)

Современная финансовая платформа, разработанная с использованием монорепозитория на базе Nx Workspace. Проект включает в себя frontend (React + Vite) и backend (NestJS) части, а также общие библиотеки для переиспользования кода.

## Текущий статус

### Текущий этап: MVP-2 (Пользователи + роли)

Завершены работы по блокам:

- ✅ **Блок A**: Подготовка окружения (Vite/Vitest/ESLint/Husky/Storybook)
- ✅ **Блок B**: Типы и DTO (User ... AnalyticsRecord)
- ✅ **Блок C**: State-менеджмент (RTK Query, Redux Toolkit)
- ✅ **Блок D**: MSW-моки (JSON + handlers)
- ✅ **Блок E**: Интеграционные тесты (FE)
- ✅ **Блок F**: Юнит-тесты (FE)
- ✅ **Блок H**: CI/CD Frontend
- ✅ **Блок K**: Auth + RBAC/ABAC (частично)

Репозиторий: [https://github.com/corvetik1/apps](https://github.com/corvetik1/apps)

## Дорожная карта

Проект разрабатывается инкрементально, согласно следующей дорожной карте:

### MVP-0: Каркас (текущий этап)

- ✅ Базовый каркас (Router, пустой store, MSW /health)
- ✅ CI с lint и базовыми тестами
- ✅ Настройка окружения разработки

### MVP-1: Аутентификация (завершено)

- ✅ AuthSlice, authApi
- ✅ Login UI, ProtectedRoute
- ✅ MSW /v1/auth/\*

### MVP-2: Пользователи + роли (в процессе)

- ✅ UsersSlice
- ✅ RBAC guard
- ✅ Модернизация меню с ролевым доступом (AppBarAndMenu)
- ✅ Переход на подход с выделением стилей в отдельные файлы
- ⬜ List view
- ⬜ /v1/users

### MVP-3: Тендеры

- ⬜ List + Create + Delete
- ⬜ tendersApi
- ⬜ Prisma migration 001

### MVP-4: Финансы

## Инструменты для работы с JSON-схемами

В проекте реализованы два ключевых инструмента для работы с JSON-схемами:

### 1. Генератор JSON-схем

Автоматически генерирует JSON-схемы на основе TypeScript-интерфейсов.

- **Путь:** `tools/schema-generator/`
- **Запуск:** `pnpm schema:generate`
- **Документация:** `docs/schema-generator-guide.md`

Ключевые возможности:

- Анализ TypeScript-интерфейсов с помощью TypeScript Compiler API
- Извлечение метаданных из JSDoc-комментариев
- Генерация JSON-схем в формате JSON Schema Draft-07
- Автоматическое создание тестов для схем

### 2. Мониторинг JSON-схем

Отслеживает соответствие между JSON-схемами и их тестами.

- **Путь:** `tools/schema-monitor/`
- **Запуск:** `pnpm schema:monitor`
- **Документация:** `docs/schema-monitor-guide.md`

Ключевые возможности:

- Проверка наличия тестов для всех JSON-схем
- Выявление несоответствий между свойствами в схемах и тестах
- Генерация отчета о несоответствиях
- Интеграция с pre-commit хуками и CI/CD

### Интеграция в процесс разработки

Оба инструмента интегрированы в процесс разработки через pre-commit хуки:

1. При изменении TypeScript-интерфейсов автоматически запускается генератор схем
2. При изменении JSON-схем или тестов запускается мониторинг схем

Это обеспечивает постоянное соответствие между TypeScript-интерфейсами, JSON-схемами и их тестами.

## Валидация и маппинг DTO

В проекте реализованы инструменты для валидации данных на основе JSON-схем и маппинга между DTO и моделями.

## Модернизация главного меню (AppBarAndMenu)

### Выполненные задачи

1. **Ролевой контроль доступа (RBAC)**
   - Реализован фильтр пунктов меню на основе роли пользователя
   - Элемент "Админка" доступен только для пользователей с ролью Admin
   - Визуализация текущей роли пользователя в интерфейсе

2. **Улучшение пользовательского интерфейса**
   - Современный компактный дизайн пунктов меню
   - Визуальное отделение активных пунктов меню
   - Разные стили для разных типов действий (например, красный цвет для кнопки "Выйти")
   - Адаптивный дизайн для мобильных устройств

3. **Архитектурные улучшения**
   - Перенос всех стилей в отдельные файлы (*.styles.ts)
   - Типизация стилей с использованием `SxProps` из Material UI для лучшей поддержки IDE
   - Функциональный подход к созданию условных стилей
   - Мемоизация списков меню для оптимизации производительности

### Структура компонентов с выделенными стилями

| Компонент | Файл стилей | Описание |
|-----------|-------------|----------|
| AppBarAndMenu.tsx | AppBarAndMenu.styles.ts | Главное меню приложения |

### Решенные проблемы

1. **Сессия пользователя**
   - Реализовано сохранение данных сессии в localStorage
   - Автоматическое восстановление сессии при перезагрузке страницы
   - Корректная обработка выхода пользователя

2. **Типизация**
   - Исправлены проблемы с типами при использовании `sx` props в Material UI
   - Обеспечена строгая типизация для объектов стилей

3. **Производительность**
   - Оптимизированы рендеры компонентов с использованием React.memo
   - Мемоизация вычисляемых значений через useMemo

### 1. Валидация на основе JSON-схем

Обеспечивает строгую типизацию и валидацию данных на уровне runtime.

- **Путь:** `libs/shared/src/lib/utils/validation.ts`
- **Тесты:** `libs/shared/src/lib/utils/__tests__/validation.spec.ts`

Ключевые возможности:

- Валидация данных на основе JSON-схем с использованием Ajv
- Удаление дополнительных свойств и приведение типов
- Подробные сообщения об ошибках валидации
- Поддержка форматов (email, date, date-time и т.д.)
- **Кеширование скомпилированных схем** для оптимизации производительности

### 2. Middleware и декораторы для NestJS

Интеграция валидации в контроллеры NestJS.

- **Middleware:** `apps/api/src/app/middleware/validation.middleware.ts`
- **Декораторы:** `apps/api/src/app/decorators/validate.decorator.ts`

Ключевые возможности:

- Валидация тела запроса, параметров запроса и параметров пути
- Автоматическое отклонение невалидных запросов с кодом 400
- Удобные декораторы для использования в контроллерах

### 3. Маппинг между DTO и моделями

Обеспечивает безопасное преобразование данных между DTO и моделями.

- **Базовый маппер:** `libs/shared/src/lib/utils/mapping/base.mapper.ts`
- **Пример маппера:** `libs/shared/src/lib/utils/mapping/user.mapper.ts`

Ключевые возможности:

- Типобезопасное преобразование между DTO и моделями
- Поддержка массивов и вложенных объектов
- Обновление моделей данными из DTO
- **Пакетная обработка больших наборов данных** для оптимизации памяти и производительности
- Вложенные мапперы для сложных отношений между сущностями

### 4. Оптимизация производительности

Инструменты для оптимизации производительности при работе с большими объемами данных.

- **Кеш схем:** `libs/shared/src/lib/utils/validation/schema-cache.ts`
- **Пакетные методы маппера:** `libs/shared/src/lib/utils/mapping/base.mapper.ts`

Ключевые возможности:

- Кеширование скомпилированных JSON-схем для ускорения валидации
- Пакетная обработка больших наборов данных с контролем потребления памяти
- Оптимизация производительности при работе с большими наборами данных

### 5. Интеграция с Swagger

Автоматическое документирование API на основе JSON-схем.

- **Декораторы:** `apps/api/src/app/decorators/api-schema.decorator.ts`

Ключевые возможности:

- Автоматическое создание документации Swagger на основе JSON-схем
- Документирование тела запроса, ответов и операций
- Поддержка массивов, вложенных объектов и перечислений

### 5. Интеграция в процесс разработки

Все инструменты интегрированы в процесс разработки:

1. JSON-схемы генерируются из TypeScript-интерфейсов
2. Валидация использует сгенерированные JSON-схемы
3. Маппинг обеспечивает безопасное преобразование между DTO и моделями
4. Swagger-документация создается на основе тех же JSON-схем

Это обеспечивает единый источник истины для типов данных и их валидации на всех уровнях приложения.

- ⬜ Accounts list
- ⬜ Balance calculation
- ⬜ /v1/finance/accounts

## Последние выполненные изменения

### Обновление MSW с версии 1.x на 2.x

В рамках поддержки актуальности фронтенд-части приложения выполнено обновление Mock Service Worker (MSW) с версии 1.x на версию 2.x. Основные изменения:

- **Импорты MSW**:
  - Старый импорт: `import { rest } from 'msw'`
  - Новый импорт: `import { http, HttpResponse } from 'msw'`

- **Обработчики запросов**:
  - Старый формат: `rest.post('/endpoint', (req, res, ctx) => { ... })`
  - Новый формат: `http.post('/endpoint', async ({ request }) => { ... })`

- **Формирование ответов**:
  - Старый формат: `return res(ctx.status(200), ctx.json(data))`
  - Новый формат: `return HttpResponse.json(data, { status: 200 })`

Изменены файлы:

- `apps/web/src/mocks/browser.ts`
- `apps/web/src/mocks/handlers/index.ts`
- `apps/web/src/mocks/handlers/auth.ts`
- `apps/web/src/main.tsx`

### Упрощение работы с переменными окружения для совместимости с Jest

Для решения проблемы с `import.meta.env` в тестовой среде была существенно упрощена утилита `utils/env.ts`:

- Удалена сложная логика использования `import.meta.env`
- Реализованы простые функции, возвращающие фиксированные значения для тестов
- Обновлена конфигурация Jest и добавлено корректное мокирование зависимостей

Дополнительные изменения:

- Исправлены типы и импорты в `api/__mocks__/index.ts`
- Исправлены зависимости: `@rtk/query/react` заменено на `@reduxjs/toolkit/query/react`
- Добавлены явные типы для параметров функций

Результат: все 13 тестовых наборов (131 тест) успешно проходят, что позволяет продолжить разработку в соответствии с принципом "fail fast".

## Подходы к тестированию

В проекте реализованы различные подходы к тестированию, обеспечивающие высокое покрытие кода и стабильность тестов.

### 1. Функциональное тестирование с полным мокированием

Для тестирования модулей с внешними зависимостями (например, CASL для управления правами доступа) используется подход функционального тестирования с полным мокированием:

```typescript
// 1. Импорты библиотек для тестирования
import { describe, it, expect, jest } from '@jest/globals';

// 2. Моки внешних зависимостей (до импорта тестируемых функций)
jest.mock('@casl/ability', () => ({
  createMongoAbility: jest.fn().mockImplementation(() => ({
    can: jest.fn().mockReturnValue(true)
  }))
}));

// 3. Импорт тестируемых функций
import { defineAbilitiesFor, hasPermission } from '../abilities';

// 4. Тесты, организованные по функциям
describe('defineAbilitiesFor', () => {
  it('должен создавать правильные разрешения для администратора', () => {
    // Вызов функции
    const result = defineAbilitiesFor({ role: 'admin' });
    
    // Проверка результата
    expect(result).toBeDefined();
    expect(result.can).toBeDefined();
  });
});
```

Преимущества этого подхода:

- Тесты не зависят от деталей реализации
- Легко поддерживать при изменениях в коде
- Тесты выполняются быстро
- Хорошее покрытие кода при минимальных усилиях

Пример: `apps/web/src/permissions/__tests__/abilities.test.ts`

### 2. Тестирование с Vitest и мокирование RTK Query API

Для интеграционного тестирования компонентов, взаимодействующих с RTK Query API, используется следующий подход:

#### 2.1. Структура моков API (Vitest)

Мокирование API RTK Query выполняется с использованием `vi.mock()`. Важно правильно смоделировать структуру, возвращаемую хуками RTK Query (`useQuery`, `useMutation`).

```typescript
// Пример мока для ../../api
vi.mock('../../api', () => {
  // Создаем мок-функции для каждого эндпоинта
  const mockGetUsers = vi.fn();
  const mockCreateUser = vi.fn();
  const mockUpdateUser = vi.fn();
  const mockDeleteUser = vi.fn();

  // Формируем объект, имитирующий структуру API
  const mockApi = {
    api: {
      reducerPath: 'api', // Важно для configureStore
      reducer: {}, // Пустой объект, если не тестируем сам редьюсер
      middleware: vi.fn(() => vi.fn()), // Мок middleware
      endpoints: {
        getUsers: {
          useQuery: mockGetUsers.mockReturnValue({
            data: {
              items: [
                // Пример данных пользователя
                { id: '1', name: 'Иван Иванов', email: 'ivan@example.com', role: 'admin', createdAt: '...', updatedAt: '...' },
                { id: '2', name: 'Петр Петров', email: 'petr@example.com', role: 'manager', createdAt: '...', updatedAt: '...' },
              ],
              total: 2,
              page: 1,
              limit: 10,
              pages: 1,
            },
            isLoading: false,
            error: null,
            refetch: vi.fn(), // Мок для функции refetch
          }),
        },
        createUser: {
          useMutation: mockCreateUser.mockReturnValue([
            vi.fn().mockResolvedValue({ id: '3', name: 'Новый Пользователь', email: 'new@example.com', role: 'user' }), // Мок функции-триггера мутации
            { isLoading: false, error: null }, // Состояние мутации
          ]),
        },
        updateUser: {
          useMutation: mockUpdateUser.mockReturnValue([
            vi.fn().mockResolvedValue({ id: '1', name: 'Обновленный Иванов', email: 'ivan@example.com', role: 'admin' }),
            { isLoading: false, error: null },
          ]),
        },
        deleteUser: {
          useMutation: mockDeleteUser.mockReturnValue([
            vi.fn().mockResolvedValue({}),
            { isLoading: false },
          ]),
        },
      },
    },
  };

  return mockApi; // Возвращаем полную структуру мока
});
```

**Ключевые моменты:**
- Каждый хук (`useQuery`, `useMutation`) должен возвращать структуру, соответствующую реальному API.
- Для `useQuery` это объект с полями `data`, `isLoading`, `error`, `refetch`.
- Для `useMutation` это массив, где первый элемент — функция-триггер мутации, а второй — объект состояния мутации (`isLoading`, `error`).

#### 2.2. Доступ к мокам в тестах

Поскольку API мокируется глобально с помощью `vi.mock()`, для доступа к конкретным мок-функциям внутри тестов (например, для `expect(mockFunction).toHaveBeenCalledWith(...)`) используется динамический импорт `require()`:

```typescript
import { api as actualApi } from '../../api'; // Может потребоваться для типов

describe('SomeComponent', () => {
  it('should call getUsers on mount', async () => {
    // Получаем доступ к мокированному модулю API внутри теста
    const { api: mockedApi } = require('../../api');
    const mockGetUsersQuery = mockedApi.endpoints.getUsers.useQuery;

    renderWithProviders(<SomeComponent />);

    await waitFor(() => {
      expect(mockGetUsersQuery).toHaveBeenCalled();
    });
  });

  it('should call createUser mutation with correct data', async () => {
    const { api: mockedApi } = require('../../api');
    const createUserMutationTrigger = mockedApi.endpoints.createUser.useMutation[0];

    renderWithProviders(<SomeComponent />);
    // ... симуляция действий пользователя для вызова мутации ...

    await waitFor(() => {
      expect(createUserMutationTrigger).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Test User', email: 'test@example.com' })
      );
    });
  });
});
```

**Почему `require()`?**
- Статический `import` выполняется до того, как `vi.mock()` заменит модуль, поэтому импортированный `api` будет оригинальным, а не мокированным.
- `require()` внутри теста (или `beforeEach`) позволяют получить доступ к уже мокированной версии модуля.

#### 2.3. Настройка тестового окружения

**`createTestStore()`**

Функция для создания Redux store для тестов должна использовать мокированный API:

```typescript
const createTestStore = () => {
  // Динамический импорт мокированного API
  const { api } = require('../../api');

  return configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      auth: authReducer, // Другие редьюсеры
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
    // ... preloadedState ...
  });
};
```

**`renderWithProviders()`**

Хелпер для рендеринга компонентов с провайдерами (Redux Store, Theme, Router) должен использовать `createTestStore()`:

```typescript
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
// ... импорты createTestStore, theme ...

export const renderWithProviders = (ui: React.ReactElement, { route = '/' } = {}) => {
  const store = createTestStore();
  window.history.pushState({}, 'Test page', route);

  return {
    ...render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>{ui}</BrowserRouter>
        </ThemeProvider>
      </Provider>
    ),
    store, // Возвращаем store для возможности дополнительных проверок
  };
};
```

#### 2.4. Асинхронные операции и `waitFor`

При тестировании асинхронных операций (например, вызовов API при монтировании компонента или после действий пользователя) необходимо использовать `waitFor` из `@testing-library/react` для ожидания завершения этих операций перед выполнением проверок (`expect`).

```typescript
await waitFor(() => {
  expect(screen.getByText('User Loaded')).toBeInTheDocument();
  expect(mockApiFunction).toHaveBeenCalled();
});
```

#### 2.5. Важные замечания

- **Удаление статических импортов API**: Если в тестовом файле используется `vi.mock('../../api', ...)`, то статический `import { api } from '../../api';` в начале файла должен быть удален или закомментирован, чтобы избежать конфликтов.
- **Типизация**: Для сохранения типизации при работе с моками можно использовать `vi.mocked()` или явное приведение типов, если это необходимо, хотя динамический `require` может усложнить статическую типизацию моков.

Этот подход обеспечивает надежное и предсказуемое тестирование компонентов, использующих RTK Query, изолируя их от реальных сетевых запросов и позволяя точно контролировать возвращаемые данные и состояния API.

### 3. Мокирование функций API

Для корректной типизации мок-функций используется следующий подход:

```typescript
// Определение типа функции
type LoginMutation = (args: LoginArgs) => Promise<AuthResponse>;

// Мокирование с корректной типизацией
const mockLoginMutation: jest.MockedFunction<LoginMutation> = jest.fn();
```

Ключевые особенности:

- Использование `jest.MockedFunction<T>` для корректной типизации моков
- Явное определение типов для аргументов и возвращаемых значений
- Аннотация типов вместо приведения типов с круглыми скобками

### 2. Матчеры Testing Library

Для корректной работы матчеров из `@testing-library/jest-dom` реализованы следующие решения:

1. **Явный импорт в тестовых файлах:**

   ```typescript
   import '@testing-library/jest-dom';
   ```

2. **Расширение типов в `testing-library-jest-dom.d.ts`:**

   ```typescript
   declare module '@jest/expect' {
     interface Matchers<R, T = unknown> {
       toBeInTheDocument(): R;
       toBeDisabled(): R;
       toHaveTextContent(text: string | RegExp): R;
     }
   }
   ```

3. **Указание типов в `tsconfig.json`:**

   ```json
   {
     "compilerOptions": {
       "types": ["jest", "@testing-library/jest-dom", "node"]
     }
   }
   ```

4. **Прагматичный подход с приведением типов:**

   ```typescript
   // Для обхода проблем с типизацией в тестах
   (expect(screen.getByText('Финансовая платформа')) as any).toBeInTheDocument();
   ```

Этот подход обеспечивает работоспособность тестов без изменения их логики, при этом решая проблемы с типизацией.

### 3. Прагматичный подход к тестированию RTK Query

Тестирование кода, использующего RTK Query, представляет собой особую сложность из-за сложной типизации и структуры хуков. В проекте реализован прагматичный подход к тестированию RTK Query, который обеспечивает стабильность тестов и упрощает их поддержку.

#### Основные принципы мокирования RTK Query

1. **Использование `jest.spyOn` вместо `jest.mock`**:

   ```typescript
   // Плохо: создает проблемы с типами
   jest.mock('../../../api/authApi', () => ({
     useLoginMutation: jest.fn(),
   }));

   // Хорошо: работает стабильно и поддерживает типы
   jest.spyOn(authApi, 'useLoginMutation').mockImplementation(() => mockLoginHook);
   ```

2. **Прагматичное использование `any` для моков**:

   ```typescript
   // Создаем простые моки с использованием any
   const mockLoginTrigger: any = jest.fn(() => Promise.resolve({ data: mockAuthResponse }));
   const mockLoginHook: any = [mockLoginTrigger, { isLoading: false, reset: jest.fn() }];
   ```

3. **Использование `mockImplementation` вместо `mockResolvedValue`**:

   ```typescript
   // Вместо этого (create типы)
   mockLoginFn.mockResolvedValue({ data: mockAuthResponse });

   // Используем это
   mockLoginFn.mockImplementation(() => Promise.resolve({ data: mockAuthResponse }));
   ```

4. **Связывание глобальных и локальных моков**:

   ```typescript
   // Глобальные моки для RTK Query хуков
   const mockLoginTrigger: any = jest.fn();
   const mockLoginHook: any = [mockLoginTrigger, { isLoading: false, reset: jest.fn() }];

   describe('useAuth', () => {
     // Локальные моки для проверки в тестах
     const mockLoginMutation: any = jest.fn();

     beforeAll(() => {
       // Связываем глобальный мок с локальным
       mockLoginTrigger.mockImplementation((...args) => {
         // Перенаправляем вызов на локальный мок
         mockLoginMutation(...args);
         return Promise.resolve({ data: mockAuthResponse });
       });

       // Мокируем хук RTK Query
       jest.spyOn(authApi, 'useLoginMutation').mockImplementation(() => mockLoginHook);
     });

     // Теперь в тестах можно проверять вызовы mockLoginMutation
     it('login должен вызывать API', async () => {
       expect(mockLoginMutation).toHaveBeenCalledWith({
         email: 'test@example.com',
         password: 'password123',
       });
     });
   });
   ```

#### Преимущества прагматичного подхода

1. **Устойчивость к обновлениям RTK Query** - при обновлении библиотеки не потребуется менять тесты.

2. **Упрощенная поддержка** - нет необходимости разбираться в сложных типах RTK Query при написании или обновлении тестов.

3. **Фокус на логике, а не на типах** - мы тестируем поведение приложения, а не строгость типов (это задача TypeScript при компиляции).

## Блоки разработки

### Клиентская часть (Frontend)

- Завершенные блоки

- ✅ **Блок A**: Подготовка окружения (Vite/Vitest/ESLint/Husky/Storybook)
- ✅ **Блок B**: Типы и DTO (User ... AnalyticsRecord)
- ✅ **Блок C**: State-менеджмент (RTK Query, Redux Toolkit)
- ✅ **Блок D**: MSW-моки (JSON + handlers)
- ✅ **Блок E**: Интеграционные тесты (FE)
- ✅ **Блок F**: Юнит-тесты (FE)
- ✅ **Блок H**: CI/CD Frontend
- ✅ **Блок K**: Auth + RBAC/ABAC (частично,  клиентская часть)

- В процессе разработки

- ⬜ **Блок G**: Storybook + Visual diff

### Серверная часть (Backend)

- В процессе разработки

- ⬜ **Блок I**: Инициализация БД (Prisma, сиды)
- ⬜ **Блок J**: NestJS-модули
- ⬜ **Блок K**: Auth + RBAC/ABAC (серверная часть)
- ⬜ **Блок L**: Внешние интеграции (AI, Analytics)
- ⬜ **Блок M**: Тесты бэкенда
- ⬜ **Блок N**: Docker + CI/CD Backend

### Общие блоки

- В процессе разработки

- ⬜ **Блок O**: Безопасность + Мониторинг
- ⬜ **Блок P**: Финальная интеграция

## Структура проекта

Проект организован как монорепозиторий Nx со следующей структурой:

- `apps/web` - Frontend приложение на React + Vite
- `apps/web-e2e` - E2E тесты для Frontend
- `apps/api` - Backend приложение на NestJS
- `apps/api-e2e` - E2E тесты для Backend
- `libs/shared` - Общие типы и интерфейсы
- `libs/web-ui` - UI компоненты
- `libs/web-state` - Управление состоянием
- `libs/web-mocks` - Моки для тестирования

## Как работать с Nx

### Запуск задач

Для запуска задач с Nx используйте:

```sh
pnpm exec nx <цель> <имя-проекта>
```

Примеры:

```sh
# Запуск разработки frontend
pnpm exec nx serve web

# Запуск разработки backend
pnpm exec nx serve api

# Запуск тестов
pnpm exec nx test web
pnpm exec nx test api

# Сборка проектов
pnpm exec nx build web
pnpm exec nx build api

# Запуск линтера
pnpm exec nx lint web
```

### Создание новых компонентов и библиотек

Для создания новых компонентов и библиотек используйте генераторы Nx:

```sh
# Создание React компонента
pnpm exec nx g @nx/react:component Button --project=web-ui

# Создание новой библиотеки
pnpm exec nx g @nx/js:lib new-lib

# Создание NestJS модуля
pnpm exec nx g @nx/nest:module users --project=api
```

### Визуализация зависимостей

Для визуализации зависимостей между проектами используйте:

```sh
pnpm exec nx graph
```

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/getting-started/intro#learn-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community: -[Discord](https://go.nx.dev/community) -[Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl) -[Our Youtube channel](https://www.youtube.com/@nxdevtools) -[Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
