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
