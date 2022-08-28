import { defineConfig } from 'cypress';

const fs = require('fs');
const path = require('path');
const debug = require('debug')('cypress-workshop-basics');

const getDbFilename = () =>
  path.join(__dirname, 'data.json');

/**
 * Default object representing our "database" file in "data.json"
 */
const DEFAULT_DATA = {
  todos: []
};

const resetData = (dataToSet = DEFAULT_DATA) => {
  const dbFilename = getDbFilename();
  debug(
    'reset data file %s with %o',
    dbFilename,
    dataToSet
  );
  if (!dataToSet) {
    console.error(
      'Cannot save empty object in %s',
      dbFilename
    );
    throw new Error(
      'Cannot save empty object in resetData'
    );
  }
  const str = JSON.stringify(dataToSet, null, 2) + '\n';
  fs.writeFileSync(dbFilename, str, 'utf8');
};

export default defineConfig({
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack'
    },
    experimentalSingleTabRunMode: true,
    specPattern: 'src/**/*.cy.ts',
    // hide the answer test files
    excludeSpecPattern: '**/*answer*.cy.ts'
  },

  e2e: {
    baseUrl: 'http://localhost:9100',
    env: {
      api: 'http://localhost:3000'
    },
    viewportWidth: 1000,
    viewportHeight: 1200,
    // hide the answer test files
    excludeSpecPattern: '**/*answer*.cy.ts',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        // saves given or default empty data object into todomvc/data.json file
        // if the server is watching this file, next reload should show the updated values
        resetData(dataToSet = DEFAULT_DATA) {
          resetData(dataToSet);

          // cy.task handlers should always return something
          // otherwise it might be an accidental return
          return null;
        }
      });
    }
  }
});
