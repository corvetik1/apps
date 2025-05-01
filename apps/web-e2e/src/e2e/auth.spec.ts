/**
 * E2E-тесты для аутентификации
 *
 * Этот модуль содержит E2E-тесты для процесса входа и выхода из системы,
 * проверяя корректность работы всего процесса аутентификации.
 */

import { test, expect } from '@playwright/test';

test.describe('Аутентификация', () => {
  test.beforeEach(async ({ page }) => {
    // Перед каждым тестом переходим на страницу входа
    await page.goto('/login');
  });

  test('должен отображать страницу входа', async ({ page }) => {
    // Проверяем наличие элементов на странице входа
    await expect(page.getByText('Финансовая платформа')).toBeVisible();
    await expect(page.getByText('Войдите в систему, чтобы продолжить')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Пароль')).toBeVisible();
    await expect(page.getByLabel('Запомнить меня')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Войти' })).toBeVisible();
  });

  test('должен отображать ошибки валидации', async ({ page }) => {
    // Нажимаем кнопку входа без заполнения полей
    await page.getByRole('button', { name: 'Войти' }).click();

    // Проверяем, что отображаются ошибки валидации
    await expect(page.getByText('Email обязателен')).toBeVisible();
    await expect(page.getByText('Пароль обязателен')).toBeVisible();
  });

  test('должен отображать ошибку при неверных учетных данных', async ({ page }) => {
    // Заполняем форму неверными данными
    await page.getByLabel('Email').fill('wrong@example.com');
    await page.getByLabel('Пароль').fill('wrong-password');

    // Нажимаем кнопку входа
    await page.getByRole('button', { name: 'Войти' }).click();

    // Проверяем, что отображается ошибка аутентификации
    await expect(page.getByText('Неверный email или пароль')).toBeVisible();
  });

  test('должен успешно выполнять вход и выход', async ({ page }) => {
    // Заполняем форму правильными данными
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Пароль').fill('user123');

    // Нажимаем кнопку входа
    await page.getByRole('button', { name: 'Войти' }).click();

    // Проверяем, что произошло перенаправление на главную страницу
    await expect(page).toHaveURL('/');

    // Проверяем, что отображается имя пользователя
    await expect(page.getByText('Пользователь')).toBeVisible();

    // Нажимаем кнопку выхода
    await page.getByRole('button', { name: 'Выйти' }).click();

    // Проверяем, что произошло перенаправление на страницу входа
    await expect(page).toHaveURL('/login');
  });

  test('должен сохранять сессию при перезагрузке страницы', async ({ page }) => {
    // Заполняем форму правильными данными и включаем "Запомнить меня"
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Пароль').fill('user123');
    await page.getByLabel('Запомнить меня').check();

    // Нажимаем кнопку входа
    await page.getByRole('button', { name: 'Войти' }).click();

    // Проверяем, что произошло перенаправление на главную страницу
    await expect(page).toHaveURL('/');

    // Перезагружаем страницу
    await page.reload();

    // Проверяем, что пользователь все еще аутентифицирован
    await expect(page).toHaveURL('/');
    await expect(page.getByText('Пользователь')).toBeVisible();
  });

  test('должен перенаправлять на защищенные маршруты после входа', async ({ page }) => {
    // Пытаемся перейти на защищенный маршрут
    await page.goto('/dashboard');

    // Проверяем, что произошло перенаправление на страницу входа
    await expect(page).toHaveURL(/\/login/);

    // Заполняем форму правильными данными
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Пароль').fill('user123');

    // Нажимаем кнопку входа
    await page.getByRole('button', { name: 'Войти' }).click();

    // Проверяем, что произошло перенаправление на защищенный маршрут
    await expect(page).toHaveURL('/dashboard');
  });

  test('должен запрещать доступ к маршрутам с ограничением по роли', async ({ page }) => {
    // Входим как обычный пользователь
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Пароль').fill('user123');
    await page.getByRole('button', { name: 'Войти' }).click();

    // Пытаемся перейти на маршрут, требующий роль администратора
    await page.goto('/admin');

    // Проверяем, что произошло перенаправление на страницу 403
    await expect(page).toHaveURL('/forbidden');
    await expect(page.getByText('Доступ запрещен')).toBeVisible();
  });
});
