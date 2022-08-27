import { AppComponent } from './app.component';
import { HeaderComponent } from '../header/header.component';
import { ListComponent } from '../list/list.component';
import { ItemComponent } from '../item/item.component';
import { CopyRightComponent } from '../copy-right/copy-right.component';
import { FooterComponent } from '../footer/footer.component';
import { createStore } from '../../store';
import { FILTERS } from '../../constants/filter';
import { StoreModule } from '@ngrx/store';

it('shows the items', { viewportHeight: 700 }, () => {
  // create a store for testing
  // using a list of todos from a fixture file
  const store = createStore({
    todos: [],
    filter: FILTERS.all
  });

  // stub the GET /todos call with the fixture three-items.json
  // https://on.cypress.io/intercept

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
  //
  // stub the "POST /todos" network call
  // and give it the alias "new-todo"
  // enter new todo "clean up" using the UI
  // confirm the network call "new-todo"
  // has happened with the expected parameters
});

it('logs a message when adding a todo', () => {
  // create a store for testing
  // using a list of todos from a fixture file
  const store = createStore({
    todos: [],
    filter: FILTERS.all
  });

  // intercept GET /todos with []
  // intercept POST /todos with {}

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

  // spy on the "window.console.log" method
  // https://on.cypress.io/spy
  // and give it an alias "log"
  //
  // alternative: match the E2E syntax
  // for getting the window object
  // cy.window().then(win => {
  //   cy.spy(win.console, 'log').as('log');
  // });
  // type new todo and press enter
  // get the "log" alias
  // and confirm it was called with
  // expected two arguments
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
    // stub the "POST /todos" network call
    // and give it the alias "new-todo"
    // stub the window.Math object's "random" property
    // so it always returns the number 0.123
    // https://on.cypress.io/stub
    //
    // enter new todo "clean up" using the UI
    // confirm the network call "new-todo"
    // has happened with ALL known expected parameters
  }
);
