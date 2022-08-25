/// <reference types="cypress" />
/* eslint-disable no-unused-vars */

beforeEach(() => {
  cy.visit('/');
});

// optional test data attribute selector helper
// const tid = id => `[data-cy="${id}"]`
/**
 * Adds a todo item
 * @param {string} text
 */
const addItem = text => {
  // write cy commands here to add the new item
};
it('adds two items', () => {
  // addItem('first item');
  // addItem('second item');
  // fill the selector
  // maybe use "tid" function
  // cy.get('...').should('have.length', 2);
});

export {};
