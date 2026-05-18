const fs = require('fs');
const path = require('path');
const { test, expect } = require('@playwright/test');

const OUTPUT_DIR = path.resolve(__dirname, '..', 'artifacts', 'screenshots');

const users = {
  admin: { email: 'admin@max-arh.local', password: 'admin123' },
  manager: { email: 'manager@max-arh.local', password: 'manager123' },
  engineer: { email: 'engineer@max-arh.local', password: 'engineer123' },
};

async function login(page, user) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Пароль').fill(user.password);
  await page.getByRole('button', { name: 'Войти' }).click();
  await expect(page.getByRole('heading', { name: 'Дашборд' })).toBeVisible();
}

async function shot(page, fileName) {
  await page.waitForLoadState('networkidle');
  await page.screenshot({
    path: path.join(OUTPUT_DIR, fileName),
    fullPage: true,
  });
}

test.beforeAll(() => {
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
});

test('capture key screens and states for all roles', async ({ page }) => {
  await login(page, users.admin);
  await shot(page, '01-admin-dashboard.png');

  await page.goto('/board');
  await expect(page.getByRole('heading', { name: 'Таск-менеджер проектов' })).toBeVisible();
  await shot(page, '02-admin-board.png');

  await page.goto('/projects');
  await expect(page.getByRole('heading', { name: 'Проекты' })).toBeVisible();
  await shot(page, '03-admin-projects-list.png');

  await page.goto('/projects/1');
  await expect(page.getByRole('heading', { name: 'Жилой комплекс на Лесной' })).toBeVisible();
  await shot(page, '04-admin-project-details-chat.png');

  await page.goto('/documents');
  await expect(page.getByRole('heading', { name: 'Документы' })).toBeVisible();
  await shot(page, '05-admin-documents-list.png');

  await page.goto('/documents/1');
  await expect(page.getByRole('heading', { name: 'Пояснительная записка' })).toBeVisible();
  await shot(page, '06-admin-document-details.png');

  await page.goto('/users');
  await expect(page.getByRole('heading', { name: 'Пользователи' })).toBeVisible();
  await shot(page, '07-admin-users-list.png');

  await page.goto('/users/1');
  await expect(page.getByRole('heading', { name: 'Администратор Системы' })).toBeVisible();
  await shot(page, '08-admin-user-details.png');

  await page.goto('/documents/new');
  await expect(page.getByRole('heading', { name: 'Добавление документа' })).toBeVisible();
  await shot(page, '09-admin-document-form.png');

  await page.getByRole('button', { name: 'Выйти' }).click();
  await expect(page.getByRole('heading', { name: 'АРХ-Контроль' })).toBeVisible();
  await shot(page, '10-login-page.png');

  await login(page, users.manager);
  await page.goto('/projects/new');
  await expect(page.getByRole('heading', { name: 'Создание проекта' })).toBeVisible();
  await shot(page, '11-manager-project-create-form.png');

  await page.goto('/users');
  await expect(page.getByRole('heading', { name: 'Пользователи' })).toBeVisible();
  await shot(page, '12-manager-users-page.png');

  await page.getByRole('button', { name: 'Выйти' }).click();
  await login(page, users.engineer);

  await page.goto('/board');
  await expect(page.getByRole('heading', { name: 'Таск-менеджер проектов' })).toBeVisible();
  await shot(page, '13-engineer-board.png');

  await page.goto('/users');
  await expect(page.getByRole('heading', { name: 'Пользователи' })).toBeVisible();
  await shot(page, '14-engineer-users-page.png');
});
