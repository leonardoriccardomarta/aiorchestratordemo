import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: null,
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // Disable server verification for testing
    experimentalRunAllSpecs: true,
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfig: {
        // Vite configuration for component testing
        server: {
          port: 5174,
        },
      },
    },
  },
}); 