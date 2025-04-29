# Финансовая платформа

![Nx logo](https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png)

Современная финансовая платформа, разработанная с использованием монорепозитория на базе Nx Workspace. Проект включает в себя frontend (React + Vite) и backend (NestJS) части, а также общие библиотеки для переиспользования кода.

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
