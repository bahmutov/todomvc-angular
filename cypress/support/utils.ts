export const resetTodos = () => {
  // our REST api runs at the URL we pass to Cypress
  // via "env" block in the cypress config file
  const api = Cypress.env('api');
  expect(api, 'api url').to.be.a('string');
  cy.request('POST', `${api}/reset`, { todos: [] });
};
