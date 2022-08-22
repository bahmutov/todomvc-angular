import { resetTodos } from '../../support/utils';

/**
 * Adds a todo item
 * @param {string} text
 */
const addItem = text => {
  cy.get('.new-todo').type(`${text}{enter}`);
};

beforeEach(() => {
  // reset all existing todos
  resetTodos();
  cy.visit('localhost:9100');
});

it('can add many items', () => {
  // assumes there are no items at the beginning
  const N = 5;
  for (let k = 0; k < N; k += 1) {
    addItem(`item ${k}`);
  }
  // check number of items
  cy.get('li.todo').should('have.length', 5);
});

export {};
