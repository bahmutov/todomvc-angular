import { AppComponent } from './app.component';
import { HeaderComponent } from '../header/header.component';
import { ListComponent } from '../list/list.component';
import { ItemComponent } from '../item/item.component';
import { CopyRightComponent } from '../copy-right/copy-right.component';
import { FooterComponent } from '../footer/footer.component';
import { createStore } from '../../store';
import { FILTERS } from '../../constants/filter';
import { StoreModule } from '@ngrx/store';

chai.config.truncateThreshold = 300;

it('shows the items', { viewportHeight: 700 }, () => {
  // create a store for testing
  // using a list of todos from a fixture file
  const store = createStore({
    todos: [],
    filter: FILTERS.all
  });

  // stub the GET /todos call with the fixture three-items.json
  // https://on.cypress.io/intercept
  cy.intercept('GET', '/todos', {
    fixture: 'three-items.json'
  }).as('todos');

  cy.mount(AppComponent, {
    declarations: [
      HeaderComponent,
      ListComponent,
      ItemComponent,
      CopyRightComponent,
      FooterComponent
    ],
    imports: [StoreModule.forRoot(store)]
  });
  // the app makes a call to load the todo items
  cy.wait('@todos');
  // stub the "POST /todos" network call
  // and give it the alias "new-todo"
  cy.intercept('POST', '/todos', {}).as('new-todo');
  // enter new todo "clean up" using the UI
  cy.get('.new-todo').type('clean up{enter}');
  cy.get('.todo').should('have.length', 4);
  // confirm the network call "new-todo"
  // has happened with the expected parameters
  cy.wait('@new-todo')
    .its('request.body')
    .should('deep.include', {
      title: 'clean up',
      completed: false
    });
});

it(
  'controls the new item ID',
  { viewportHeight: 700 },
  () => {
    // create a store for testing
    // using a list of todos from a fixture file
    const store = createStore({
      todos: [],
      filter: FILTERS.all
    });

    // stub the GET /todos call with the fixture three-items.json
    // https://on.cypress.io/intercept
    cy.intercept('GET', '/todos', {
      fixture: 'three-items.json'
    }).as('todos');

    cy.mount(AppComponent, {
      declarations: [
        HeaderComponent,
        ListComponent,
        ItemComponent,
        CopyRightComponent,
        FooterComponent
      ],
      imports: [StoreModule.forRoot(store)]
    });
    // the app makes a call to load the todo items
    cy.wait('@todos');
    // stub the "POST /todos" network call
    // and give it the alias "new-todo"
    cy.intercept('POST', '/todos', {}).as('new-todo');
    // stub the window.Math object's "random" property
    // so it always returns the number 0.123
    // https://on.cypress.io/stub
    cy.stub(window.Math, 'random').returns(0.123);
    // enter new todo "clean up" using the UI
    cy.get('.new-todo').type('clean up{enter}');
    cy.get('.todo').should('have.length', 4);
    // confirm the network call "new-todo"
    // has happened with the expected parameters
    cy.wait('@new-todo')
      .its('request.body')
      .should('deep.equal', {
        id: '123',
        title: 'clean up',
        completed: false
      });
  }
);
