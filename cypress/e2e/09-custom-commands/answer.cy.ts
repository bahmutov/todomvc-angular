beforeEach(function resetData() {
  const api = Cypress.env('api');
  expect(api, 'api url').to.be.a('string');
  cy.request('POST', api + '/reset', {
    todos: []
  });
});

beforeEach(function visitSite() {
  cy.visit('/');
});

// simple custom command
// Cypress.Commands.add('createTodo', todo => {
//   cy.get('.new-todo').type(`${todo}{enter}`);
// });

// // with better command log
// Cypress.Commands.add('createTodo', todo => {
//   cy.get('.new-todo', { log: false }).type(
//     `${todo}{enter}`,
//     { log: false }
//   );
//   cy.log('createTodo', todo);
// });

// with full command log
// const createTodo = todo => {
//   const cmd = Cypress.log({
//     name: 'create todo',
//     message: todo,
//     consoleProps() {
//       return {
//         'Create Todo': todo
//       };
//     }
//   });

//   cy.get('.new-todo', { log: false })
//     .type(`${todo}{enter}`, { log: false })
//     .then($el => {
//       cmd.set({ $el }).snapshot().end();
//     });
// };

// it('creates a todo', () => {
//   cy.createTodo('my first todo');
// });
