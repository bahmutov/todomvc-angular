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

## First Item component test

Spec file `src/app/components/item/item.cy.ts`

⌨️ Implement the test "mounts the component"

```js
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
