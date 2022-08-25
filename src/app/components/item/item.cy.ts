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
  // cy.mount(..., { componentProperties { todo } } )
  //
  // confirm the page contains ".todo"
  // with text todo.title
  // and it is incomplete
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
  //
  // confirm the page contains ".todo"
  // with text todo.title
  // and it is incomplete
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
  //
  // confirm the page contains ".todo"
  // with text todo.title
  // and it is a complete todo
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
  //
  // confirm the Todo is present and check the toggle
  //
  // get the update stub using its alias
  // confirm it was called once
  // get its property "firstCall.args.0"
  // and confirm it is the expected object
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
  // ({ completed }) => todo.completed = completed
  //
  // confirm the Todo is present and check the toggle
  // confirm the todo element has class completed
  // confirm the handle stub was called once
});
