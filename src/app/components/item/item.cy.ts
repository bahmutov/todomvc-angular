import { ItemComponent } from './item.component';

it('shows an item', () => {
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
  cy.get('@update').should('have.been.calledOnceWithExactly', {
    id: '101',
    completed: true
  });
});
