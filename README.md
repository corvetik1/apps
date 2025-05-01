# Финансовая платформа

![Nx logo](https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png)

Современная финансовая платформа, разработанная с использованием монорепозитория на базе Nx Workspace. Проект включает в себя frontend (React + Vite) и backend (NestJS) части, а также общие библиотеки для переиспользования кода.

## Текущий статус

### Текущий этап: MVP-0 (Каркас)

Завершены работы по блоку A (Подготовка окружения):

- ✅ Настроен монорепозиторий на базе Nx Workspace
- ✅ Настроены инструменты качества кода (ESLint, Prettier, Husky)
- ✅ Настроено тестовое окружение (Jest, Testing Library)
- ✅ Настроен MSW для моков API
- ✅ Настроен CI/CD через GitHub Actions
- ✅ Создана базовая документация
- ✅ Реализованы инструменты для работы с JSON-схемами

Репозиторий: [https://github.com/corvetik1/apps](https://github.com/corvetik1/apps)

## Дорожная карта

Проект разрабатывается инкрементально, согласно следующей дорожной карте:

### MVP-0: Каркас (текущий этап)

- ✅ Базовый каркас (Router, пустой store, MSW /health)
- ✅ CI с lint и базовыми тестами
- ✅ Настройка окружения разработки

### MVP-1: Аутентификация

- ⬜ AuthSlice, authApi
- ⬜ Login UI, ProtectedRoute
- ⬜ MSW /v1/auth/\*

### MVP-2: Пользователи + роли

- ⬜ UsersSlice, List view
- ⬜ RBAC guard
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

## Типизация тестов

В проекте реализованы решения для корректной типизации тестов с использованием Jest и Testing Library.

### 1. Мокирование функций API

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

- ✅ **Блок A**: Подготовка окружения (Vite/Vitest/ESLint/Husky/Storybook)
- ⬜ **Блок B**: Типы и DTO (User ... AnalyticsRecord)
- ⬜ **Блок C**: State-менеджмент (RTK Query, Redux Toolkit)
- ⬜ **Блок D**: MSW-моки (JSON + handlers)
- ⬜ **Блок E**: Интеграционные тесты (FE)
- ⬜ **Блок F**: Юнит-тесты (FE)
- ⬜ **Блок G**: Storybook + Visual diff
- ⬜ **Блок H**: CI/CD Frontend
- ⬜ **Блок I**: Инициализация БД (Prisma, сиды)
- ⬜ **Блок J**: NestJS-модули
- ⬜ **Блок K**: Auth + RBAC/ABAC
- ⬜ **Блок L**: Внешние интеграции (AI, Analytics)
- ⬜ **Блок M**: Тесты бэкенда
- ⬜ **Блок N**: Docker + CI/CD Backend
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
