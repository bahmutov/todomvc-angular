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

it('enters 10 todos', function () {
  cy.get('.new-todo')
    .type('todo 0{enter}')
    .type('todo 1{enter}')
    .type('todo 2{enter}')
    .type('todo 3{enter}')
    .type('todo 4{enter}')
    .type('todo 5{enter}')
    .type('todo 6{enter}')
    .type('todo 7{enter}')
    .type('todo 8{enter}')
    .type('todo 9{enter}');
  cy.get('.todo').should('have.length', 10);
});
