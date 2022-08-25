import { ItemComponent } from './item.component';

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
