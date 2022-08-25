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
  // stub the "POST /todos" network call
  // and give it the alias "new-todo"
  // enter new todo "clean up" using the UI
  // confirm the network call "new-todo"
  // has happened with the expected parameters
});
