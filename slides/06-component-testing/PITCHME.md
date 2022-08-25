## ☀️ Part 6: Component Testing

### 📚 You will learn

- how to write an Angular Component Test
- how to spy on or stub an application method

+++

## Cypress v10.5.0

![Cypress Angular Component Testing announcement](./img/ng.png)

[https://www.cypress.io/blog/2022/08/15/cypress-10-5-0-introducing-angular-component-testing/](https://www.cypress.io/blog/2022/08/15/cypress-10-5-0-introducing-angular-component-testing/)

+++

## Testing Types

- End-to-End testing
- API testing using "cy.request" calls <!-- .element: class="fragment" -->
- Unit testing <!-- .element: class="fragment" -->
- Component testing <!-- .element: class="fragment" -->

+++

## Testing type comparison

![Testing types comparison](./img/testing-types.png)

[https://on.cypress.io/testing-types](https://on.cypress.io/testing-types)

---

- close the `todomvc` app 🤯
- `npx cypress open`

Component tests live close to their components in the "src" folder

+++

![Pick component testing type](./img/pick-component-testing.png)

+++

## 💡 Quickly switch the testing type

![Switch between E2E and component tests](./img/switch.png)

---

## Angular component testing doc

![Angular quick start](./img/angular-doc.png)

[https://docs.cypress.io/guides/component-testing/quickstart-angular](https://docs.cypress.io/guides/component-testing/quickstart-angular)

---

## The first Item component test

Spec file `src/app/components/item/item.cy.ts`

⌨️ Implement the test "mounts the component"

```js
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
  // confirm the page contains ".todo"
  // with text todo.title
  // and it is incomplete
});
```

+++

## Mount the template

```js
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
```

+++

## Mount a template to match app CSS

How does the app apply its CSS? Can you make the template HTML in the test "shows an item with style" match it?

![Test with the DOM structure matching CSS](./img/style.png)

Note:
Show the devtools and how "src/styles.css" is fetched - because it comes via angular.json file automatically read by the Cypress dev server.

+++

```js
it('shows an item with style', () => {
  const todo = {
    id: '101',
    title: 'Write code here',
    completed: true
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
    .should('have.class', 'completed')
    .find('.toggle')
    .should('be.checked');
});
```

---

## Component calls handleUpdate

The list component mounts the item component like this

```html
<app-item
  *ngFor="let todo of (visibleTodos$ | async)"
  [todo]="todo"
  (remove)="handleRemove($event)"
  (update)="handleUpdate($event)"
></app-item>
```

It passes the `update` property

+++

⌨️ write the test "calls the update to complete the item"

Use [cy.stub](https://on.cypress.io/stub) and [cy.as](https://on.cypress.io/as)

![The update test](./img/update-test.png)

+++

```js
it('calls the update to complete the item', () => {
  const todo = {
    id: '101',
    title: 'Write code here',
    completed: false
  };
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
  cy.get('@handleUpdate')
    .should('have.been.calledOnce')
    .its('firstCall.args.0', { timeout: 0 })
    .should('deep.equal', {
      id: '101',
      completed: true
    });
});
```

+++

Why isn't the Todo item look "completed"?

![Missing completed class](./img/missing-completed.png)

It is missing the class `completed` that gives the strike through decoration

+++

⌨️ Implement the test "updates the component when the data changes"

![Item component gets the completed class](./img/completed.png)

Note:
The component simply reflects the data passed. We need to update the `todo` component we pass as a prop.

+++

```js
it('updates the component when the data changes', () => {
  const todo = {
    id: '101',
    title: 'Write code here',
    completed: false
  };
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
  cy.contains('li.todo', 'Write code here')
    .find('.toggle')
    .should('not.be.checked');
  cy.get('.toggle').check().should('be.checked');
  cy.get('.todo').should('have.class', 'completed');
  cy.get('@handleUpdate').should('have.been.calledOnce');
});
```
