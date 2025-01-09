import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './test',  // The directory where test files are located
  retries: 2,       // Number of retries for failed tests
  reporter: 'dot',  // Choose a reporter for test results
  use: {
    // Configure browser context options
    headless: false, // Run tests with UI
    viewport: { width: 1280, height: 720 },
    video: 'on',  // This enables video recording
    trace: 'on',  // This enables trace recording
  },
});
