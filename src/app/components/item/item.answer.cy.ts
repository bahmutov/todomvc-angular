import { ItemComponent } from './item.component';

// https://on.cypress.io/component-testing/mounting-angular

it('mounts the component', () => {
  const todo = {
    id: '101',
    title: 'Write code',
    completed: false
  };
  // use cy.mount command from
  // cypress/support/component.ts
  // to mount the ItemComponent
  // with options componentProperties { todo }
  cy.mount(ItemComponent, {
    componentProperties: {
      todo
    }
  });
  // confirm the page contains ".todo"
  // with text todo.title
  // and it is incomplete
  cy.contains('.todo', todo.title)
    .find('.toggle')
    .should('not.be.checked');
});

it('mounts the template', () => {
  const todo = {
    id: '101',
    title: 'Write code here',
    completed: false
  };
  // use cy.mount to mount an HTML template
  // cy.mount('<app-item [todo]="todo"></app-item>'
  // and pass the ItemComponent declaration
  // plus component properties with todo
  cy.mount('<app-item [todo]="todo"></app-item>', {
    declarations: [ItemComponent],
    componentProperties: {
      todo
    }
  });
  // confirm the page contains ".todo"
  // with text todo.title
  // and it is incomplete
  cy.contains('li.todo', 'Write code here')
    .find('.toggle')
    .should('not.be.checked');
});

it('shows an item with style', () => {
  const todo = {
    id: '101',
    title: 'Write code here',
    completed: true
  };
  // use cy.mount to mount an HTML template matching the app
  // cy.mount('<...><app-item [todo]="todo"></app-item><...>'
  // and pass the ItemComponent declaration
  // plus component properties with todo
  cy.mount(
    `
      <ul class="todo-list">
        <app-item [todo]="todo"></app-item>
      </ul>
    `,
    {
      declarations: [ItemComponent],
      componentProperties: {
        todo
      }
    }
  );
  // confirm the page contains ".todo"
  // with text todo.title
  // and it is a complete todo
  cy.contains('li.todo', 'Write code here')
    .should('have.class', 'completed')
    .find('.toggle')
    .should('be.checked');
});
