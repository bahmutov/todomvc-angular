export function resetData() {
  const api = Cypress.env('api');
  expect(api, 'api url').to.be.a('string');
  cy.request('POST', api + '/reset', {
    todos: []
  });
}

export function visitSite() {
  cy.visit('/');
}
