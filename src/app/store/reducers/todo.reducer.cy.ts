import { createTodoReducer } from './todo.reducer';
import {
  onCreate,
  onLoad,
  onRemove,
  onUpdate
} from '../actions/todo.action';

chai.config.truncateThreshold = 300;

describe('todosReducer', () => {
  it('should set list of items on load', () => {
    const expectedTodos = [
      { id: 'e2bb892a', name: 'Demo', completed: false }
    ];

    const todos = createTodoReducer()(
      [],
      onLoad(expectedTodos)
    );

    expect(todos).to.deep.equal(expectedTodos);
    expect(todos.length).to.equal(1);
    expect(todos).to.deep.contain(expectedTodos[0]);
  });

  it('should create new todo', () => {
    cy.intercept(
      {
        method: 'POST',
        pathname: '/todos'
      },
      {}
    )
      .as('new-item')
      .then(() => {
        // why do we put "createTodoReduced" into cy.then callback?
        const todos = createTodoReducer()(
          [],
          onCreate('Demo')
        );

        expect(todos.length).to.equal(1);
        expect(todos[0].id).to.be.a('string');
        expect(todos[0].title).to.equal('Demo');
        expect(todos[0].completed).to.equal(false);
      });
  });

  it('should create new todo (wrapped objects)', () => {
    cy.intercept(
      {
        method: 'POST',
        pathname: '/todos'
      },
      {}
    )
      .as('new-item')
      .then(() => {
        // why do we put "createTodoReduced" into cy.then callback?
        cy.wrap(createTodoReducer()([], onCreate('Demo')))
          .should('be.an', 'array')
          .and('have.length', 1)
          .its(0)
          .should('deep.include', {
            title: 'Demo',
            completed: false
          })
          .and('have.property', 'id')
          // assertion "have.property" changes the current subject
          // to the value of that property
          .should('be.a', 'string');
      });
  });

  it('creates a new todo with deterministic ID', () => {
    // how is the new id assigned to the items?
    cy.stub(window.Math, 'random').returns('0.123');
    cy.intercept(
      {
        method: 'POST',
        pathname: '/todos'
      },
      {}
    )
      .as('new-item')
      .then(() => {
        // why do we put "createTodoReduced" into cy.then callback?
        cy.wrap(createTodoReducer()([], onCreate('Demo')))
          .should('be.an', 'array')
          .and('have.length', 1)
          .its(0)
          .should('deep.include', {
            id: '123',
            title: 'Demo',
            completed: false
          });
      });
  });

  // it('should update existing todo', () => {
  //   const initialState = [
  //     { id: 'e2bb892a', name: 'Demo', completed: false }
  //   ];

  //   const todos = createTodoReducer()(
  //     initialState,
  //     onUpdate({ id: 'e2bb892a', name: 'Demo2' })
  //   );

  //   expect(todos[0].name).toEqual('Demo2');
  // });

  // it('should remove existing todo', () => {
  //   const initialState = [
  //     { id: 'e2bb892a', name: 'Demo', completed: false }
  //   ];

  //   const todos = createTodoReducer()(
  //     initialState,
  //     onRemove('e2bb892a')
  //   );

  //   expect(todos.length).toEqual(0);
  // });
});
