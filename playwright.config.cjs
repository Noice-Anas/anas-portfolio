const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests', timeout: 90000, workers: 2, reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:8765', channel: process.env.CI ? undefined : 'chrome', trace: 'retain-on-failure' },
  webServer: { stdout: 'ignore', stderr: 'ignore', command: 'python3 -m http.server 8765 --bind 127.0.0.1 --directory _site', url: 'http://127.0.0.1:8765', reuseExistingServer: !process.env.CI }
});
