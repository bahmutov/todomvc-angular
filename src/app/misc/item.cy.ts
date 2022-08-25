import { ItemComponent } from '../components/item/item.component';

it('shows an item (no style)', () => {
  const todo = {
    id: '101',
    title: 'Write code',
    completed: false
  };
  cy.mount(ItemComponent, {
    componentProperties: {
      todo,
      // @ts-ignore
      update: {
        emit: cy.spy().as('update')
      }
      // we could stub the method completely
      // handleCompleted: cy.stub().as('handleCompleted')
    }
  });

  cy.get('.toggle').check();
  cy.get('@update').should(
    'have.been.calledOnceWithExactly',
    {
      id: '101',
      completed: true
    }
  );
});

it('shows an item', () => {
  const todo = {
    id: '101',
    title: 'Write code here',
    completed: false
  };
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
  cy.contains('li.todo', 'Write code here')
    .find('.toggle')
    .should('not.be.checked');
});

it('calls the update to complete the item', () => {
  const todo = {
    id: '101',
    title: 'Write code here',
    completed: false
  };
  cy.mount(
    `
      <ul class="todo-list">
        <app-item [todo]="todo" (update)="update.emit($event)"></app-item>
      </ul>
    `,
    {
      declarations: [ItemComponent],
      componentProperties: {
        todo,
        update: {
          emit: cy.spy().as('updateSpy')
        }
      }
    }
  );
  cy.contains('li.todo', 'Write code here')
    .find('.toggle')
    .should('not.be.checked');
  cy.get('.toggle').check();
  cy.get('@updateSpy')
    .should('have.been.calledOnce')
    .its('firstCall.args.0', { timeout: 0 })
    .should('deep.equal', {
      id: '101',
      completed: true
    });
});
