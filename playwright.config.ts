import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['line'], 
    ['allure-playwright', { outputFolder: 'reports/allure-results' }]
  ],
// use: {
//   launchOptions: {
//     slowMo: 1000, 
//   }
// }
});
