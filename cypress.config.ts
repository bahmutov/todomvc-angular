import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack'
    },
    specPattern: '**/*.cy.ts'
  },

  e2e: {
    baseUrl: 'http://localhost:9100',
    env: {
      api: 'http://localhost:3000'
    },
    // hide the answer test files
    // excludeSpecPattern: '**/answer*.cy.ts',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    }
  }
});
