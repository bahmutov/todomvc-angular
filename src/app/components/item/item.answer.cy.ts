/// <reference types="cypress-real-events" />
import { ItemComponent } from './item.component';
import 'cypress-real-events/support';

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

it('calls the update to complete the item', () => {
  const todo = {
    id: '101',
    title: 'Write code here',
    completed: false
  };
  // mount the component
  // and pass the (update) property that will receive the update event
  // you can create a function to pass as "update"
  // using https://on.cypress.io/stub
  // give the stub an alias using "cy.as" command
  // https://on.cypress.io/as
  cy.mount(
    `
      <ul class="todo-list">
        <app-item [todo]="todo" (update)="handleUpdate($event)"></app-item>
      </ul>
    `,
    {
      declarations: [ItemComponent],
      componentProperties: {
        todo,
        handleUpdate: cy.stub().as('handleUpdate')
      }
    }
  );
  // confirm the Todo is present and check the toggle
  cy.contains('li.todo', 'Write code here')
    .find('.toggle')
    .should('not.be.checked');
  cy.get('.toggle').check().should('be.checked');
  // get the update stub using its alias
  // confirm it was called once
  // get its property "firstCall.args.0"
  // and confirm it is the expected object
  cy.get('@handleUpdate')
    .should('have.been.calledOnce')
    .its('firstCall.args.0', { timeout: 0 })
    .should('deep.equal', {
      id: '101',
      completed: true
    });
});

it('updates the component when the data changes', () => {
  const todo = {
    id: '101',
    title: 'Write code here',
    completed: false
  };
  // mount the component
  // and pass the (update) property a function
  // that sets the todo.completed to the passed value
  // give the update stub alias "handleUpdate"
  // https://on.cypress.io/stub with "callsFake"
  // https://glebbahmutov.com/cypress-examples/commands/spies-stubs-clocks.html
  cy.mount(
    `
      <ul class="todo-list">
        <app-item [todo]="todo" (update)="handleUpdate($event)"></app-item>
      </ul>
    `,
    {
      declarations: [ItemComponent],
      componentProperties: {
        todo,
        handleUpdate: cy
          .stub()
          .as('handleUpdate')
          .callsFake(
            ({ completed }) => (todo.completed = completed)
          )
      }
    }
  );
  // confirm the Todo is present and check the toggle
  cy.contains('li.todo', 'Write code here')
    .find('.toggle')
    .should('not.be.checked');
  cy.get('.toggle').check().should('be.checked');
  // confirm the todo element has class completed
  cy.get('.todo').should('have.class', 'completed');
  // confirm the handle stub was called once
  cy.get('@handleUpdate').should('have.been.calledOnce');
});

it('should notify about remove button', () => {
  const todo = {
    id: '101',
    title: 'Write code here',
    completed: false
  };
  // mount the component
  // and pass the (remove) property a stub function
  // with an alias "handleRemove"
  cy.mount(
    `
      <ul class="todo-list">
        <app-item [todo]="todo" (remove)="handleRemove($event)"></app-item>
      </ul>
    `,
    {
      declarations: [ItemComponent],
      componentProperties: {
        todo,
        handleRemove: cy.stub().as('handleRemove')
      }
    }
  );
  // find the Todo destroy button and click on it
  cy.contains('li.todo', 'Write code here')
    .realHover()
    // to make the test clear
    .wait(1000)
    .find('.destroy')
    .should('be.visible')
    .click();
  // confirm the handleRemove stub was called with the right ID
  cy.get('@handleRemove').should(
    'be.calledOnceWithExactly',
    todo.id
  );
});

it('yields the component and the Angular TestBed utils', () => {
  const todo = {
    id: '101',
    title: 'Write code here',
    completed: false
  };
  // mount the component, pass the todo property
  // and console.log the yielded value
  // cy.mount(...).then(console.log)
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
  )
    .then(console.log)
    .then(({ component }) => {
      component.todo.completed = true;
    });
  cy.get('.todo').should('have.class', 'completed');
});
