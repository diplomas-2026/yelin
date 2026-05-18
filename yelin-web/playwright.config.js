const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 180_000,
  fullyParallel: false,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'https://yelin.danbel.ru',
    viewport: { width: 1440, height: 1024 },
    screenshot: 'off',
    trace: 'off',
  },
});
