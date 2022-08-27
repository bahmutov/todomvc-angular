// ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
// note, we are not resetting the server before each test
// ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️

// see https://on.cypress.io/intercept
// and https://cypress.tips/courses/network-testing

// https://github.com/bahmutov/cy-spok
import spok from 'cy-spok';

// @ts-ignore
import threeTodos from '../../fixtures/three-items.json';

// Tip: fully print objects in the assertions messages
chai.config.truncateThreshold = 300;

const api = Cypress.env('api');
expect(api, 'api url').to.be.a('string');

it('starts with zero items (waits)', () => {
  cy.visit('/');
  cy.wait(1000);
  cy.get('li.todo').should('have.length', 0);
});

it('starts with zero items (network wait)', () => {
  // spy on route `GET /todos`
  cy.intercept('GET', '/todos').as('todos');
  // THEN visit the page
  cy.visit('/');
  // wait for `GET /todos` response
  cy.wait('@todos')
    // inspect the server's response
    .its('response.body')
    // hmm, why is the returned length 0?
    // tip: browser caching
    .should('have.length', 0);
  // then check the DOM
  // note that we don't have to use "cy.wait(...).then(...)"
  // because all Cypress commands are flattened into a single chain
  // automatically. Thus just write "cy.wait(); cy.get();" naturally
  cy.get('li.todo').should('have.length', 0);
});

it('starts with zero items (delay)', () => {
  // spy on the network call GET /todos
  cy.intercept('GET', '/todos').as('todos');
  // visit the page with /?delay=2000 query parameter
  // this will delay the GET /todos call by 2 seconds
  cy.visit('/?delay=2000');
  // wait for todos call
  cy.wait('@todos');
  // confirm there are no items on the page
  cy.get('li.todo').should('have.length', 0);
});

it('posts new item to the server', () => {
  // spy on the network call GET /todos
  cy.intercept('GET', '/todos').as('todos');
  // and spy on adding the new todo
  cy.intercept('POST', '/todos').as('new-item');
  cy.visit('/');
  cy.wait('@todos');
  cy.get('.new-todo').type('test api{enter}');
  cy.wait('@new-item')
    .its('request.body')
    .should('have.contain', {
      title: 'test api',
      completed: false
    });
});

it('deletes an item on the server', () => {
  cy.fixture('three-items').then(todos => {
    cy.request('POST', api + '/reset', { todos });
  });

  cy.intercept('DELETE', '/todos/*').as('remove-item');
  cy.visit('/');
  cy.get('.todo')
    .should('have.length', 3)
    .first()
    .find('.destroy')
    .click({ force: true });
  cy.wait('@remove-item');
});

it('deletes an item on the server (imported fixture)', () => {
  cy.request('POST', api + '/reset', {
    todos: threeTodos
  });

  cy.intercept('DELETE', '/todos/' + threeTodos[0].id).as(
    'remove-item'
  );
  cy.visit('/');
  cy.get('.todo')
    .should('have.length', 3)
    .first()
    .find('.destroy')
    .click({ force: true });
  cy.wait('@remove-item');
  // only the 2nd and the 3rd items remain
  threeTodos.slice(1).forEach(todo => {
    cy.contains('li.todo', todo.title);
  });

  cy.log('**delete the other items**');
  cy.intercept('DELETE', '/todos/*').as('remove');
  cy.get('li.todo .destroy')
    .should('have.length', 2)
    .click({ multiple: true, force: true });
  // there should be two network calls

  cy.wait('@remove');
  cy.wait('@remove');
});

it('starts with zero items (delay plus render delay)', () => {
  // spy on the GET /todos call and give it an alias
  cy.intercept('GET', '/todos').as('todos');
  // visit the page with query parameters
  // to delay the GET call and delay rendering the received items
  // /?delay=2000&renderDelay=1500
  cy.visit('/?delay=2000&renderDelay=1500');
  // wait for the network call to happen
  cy.wait('@todos');
  // confirm there are no todos
  // Question: can the items appear on the page
  // AFTER you have checked?
  cy.get('li.todo').should('have.length', 0);
});

it('starts with zero items (check loaded class)', () => {
  // cy.visit('/')
  // or use delays to simulate the delayed load
  cy.visit('/?delay=2000');
  // the application sets "loaded" class on the body
  // in the test we can check for this class.
  // Increase the command timeout to prevent flaky tests
  cy.get('#app', { timeout: 7_000 }).should(
    'have.class',
    'loaded'
  );
  // then check the number of items
  cy.get('li.todo').should('have.length', 0);
});

it('starts with zero items (check the window property)', () => {
  // use delays to simulate the delayed load and render
  cy.visit('/?delay=2000&renderDelay=1500');
  // the application code sets the "window.todos"
  // when it finishes loading the items
  // (see app.component.ts)
  //  if (window.Cypress) {
  //    window.todos = todos
  //  }
  // thus we can check from the test if the "window"
  // object has property "todos"
  // https://on.cypress.io/window
  // https://on.cypress.io/its
  // cy.window().its('todos', { timeout: 7_000 });
  // Alternative check
  cy.window().should('have.property', 'todos');
  // then check the number of items rendered on the page
  cy.get('li.todo').should('have.length', 0);
});

it('starts with N items', () => {
  // use delays to simulate the delayed load and render
  cy.visit('/?delay=2000&renderDelay=1500');
  // access the loaded Todo items
  // from the window object
  // using https://on.cypress.io/window
  cy.window()
    // you can drill down nested properties using "."
    // https://on.cypress.io/its
    // "todos.length"
    .its('todos.length')
    .then(n => {
      // then check the number of items
      // rendered on the page - it should be the same
      // as "todos.length"
      cy.get('li.todo').should('have.length', n);
    });
});

it('starts with N items and checks the page', () => {
  // use delays to simulate the delayed load and render
  cy.visit('/?delay=2000&renderDelay=1500');
  // access the loaded Todo items
  // from the window object
  // https://on.cypress.io/window
  // https://on.cypress.io/its "todos"
  cy.window()
    .its('todos')
    // use https://on.cypress.io/then callback
    .then(todos => {
      // then check the number of items on the page
      // it should be the same as "window.todos" length
      cy.get('li.todo').should('have.length', todos.length);
      // go through the list of items
      // and for each item confirm it is rendered correctly
      // and the "completed" class is set correctly
      todos.forEach(todo => {
        if (todo.completed) {
          cy.contains('.todo', todo.title).should(
            'have.class',
            'completed'
          );
        } else {
          cy.contains('.todo', todo.title).should(
            'not.have.class',
            'completed'
          );
        }
      });
    });
});

it('starts with zero items (stubbed response)', () => {
  // start Cypress network server
  // spy on route `GET /todos`
  // THEN visit the page
  cy.intercept('GET', '/todos', []).as('todos');
  cy.visit('/');
  cy.wait('@todos') // wait for `GET /todos` response
    // inspect the server's response
    .its('response.body')
    .should('have.length', 0);
  // then check the DOM
  cy.get('li.todo').should('have.length', 0);
});

it('starts with zero items (fixture)', () => {
  // stub route `GET /todos`, return data from fixture file
  // THEN visit the page
  cy.intercept('GET', '/todos', {
    fixture: 'empty-list.json'
  }).as('todos');
  cy.visit('/');
  cy.wait('@todos') // wait for `GET /todos` response
    // inspect the server's response
    .its('response.body')
    .should('have.length', 0);
  // then check the DOM
  cy.get('li.todo').should('have.length', 0);
});

it('posts new item to the server response', () => {
  cy.intercept('POST', '/todos').as('new-item');
  cy.visit('/');
  cy.get('.new-todo').type('test api{enter}');
  cy.wait('@new-item')
    .its('response.body')
    .should('have.contain', {
      title: 'test api',
      completed: false
    });
});

it('confirms the request and the response', () => {
  // spy on "POST /todos", save as alias
  cy.intercept('POST', '/todos').as('new-item');
  cy.visit('/');
  cy.get('.new-todo').type('test api{enter}');
  // wait for the intercept and verify its request body
  cy.wait('@new-item')
    .its('request.body')
    .should('deep.include', {
      title: 'test api',
      completed: false
    });
  // get the same intercept again and verify its response body
  cy.get('@new-item')
    .its('response.body')
    .should('deep.include', {
      title: 'test api',
      completed: false
    });
});

it('loads several items from a fixture', () => {
  // stub route `GET /todos` with data from a fixture file
  // THEN visit the page
  cy.intercept('GET', '/todos', { fixture: 'two-items' });
  cy.visit('/');
  // then check the DOM: some items should be marked completed
  // we can do this in a variety of ways
  cy.get('li.todo').should('have.length', 2);
  cy.get('li.todo.completed').should('have.length', 1);
  cy.contains('.todo', 'first item from fixture')
    .should('not.have.class', 'completed')
    .find('.toggle')
    .should('not.be.checked');
  cy.contains('.todo.completed', 'second item from fixture')
    .find('.toggle')
    .should('be.checked');
});

it('handles 404 when loading todos', () => {
  // when the app tries to load items
  // set it up to fail
  cy.intercept(
    {
      method: 'GET',
      pathname: '/todos'
    },
    {
      body: 'test does not allow it',
      statusCode: 404,
      delayMs: 2000
    }
  );
  cy.visit('/', {
    // spy on console.error because we expect app would
    // print the error message there
    onBeforeLoad: win => {
      cy.spy(win.console, 'error').as('console-error');
    }
  });
  // observe external effect from the app - console.error(...)
  cy.get('@console-error').should(
    'have.been.calledWithExactly',
    'test does not allow it'
  );
});

it('shows loading element', () => {
  // delay XHR to "/todos" by a few seconds
  // and respond with an empty list
  // https://on.cypress.io/intercept
  cy.intercept('GET', '/todos', {
    delay: 2000,
    body: []
  }).as('todos');
  cy.visit('/');
  // shows Loading element
  cy.get('.loading').should('be.visible');
  // wait for the network call to complete
  // https://on.cypress.io/wait
  cy.wait('@todos');
  // now the Loading element should go away
  cy.get('.loading').should('not.exist');
});

it('handles todos with blank title', () => {
  cy.intercept('GET', '/todos', [
    {
      id: '123',
      title: '  ',
      completed: false
    }
  ]);

  cy.visit('/');
  cy.get('li.todo')
    .should('have.length', 1)
    .first()
    .should('not.have.class', 'completed')
    .find('label')
    .should('have.text', '  ');
});

it('can rewrite HTML and CSS', () => {
  // intercept "GET /" request for the HTML document
  // let the request continue to the server
  // when it gets the response, change something in the body
  // of the response which is the HTML text
  cy.intercept('GET', '/', req => {
    req.continue(res => {
      res.body = res.body.replace(
        '<app-root></app-root>',
        '<div class="test-message">This is a test</div><app-root></app-root>'
      );
    });
  }).as('html');
  // intercept the "GET styles.css" request
  // and add more classes to the returned CSS
  cy.intercept('GET', 'styles.css', req => {
    delete req.headers['If-None-Match'];
    req.continue(res => {
      delete res.headers.etag;
      res.body += `.test-message {
        color: #f0f;
        font-weight: bold;
        font-size: 78pt;
        position: absolute;
        left: 200px;
        top: 600px;
        z-index: 1000;
        width: 100%;
        transform: rotate(-45deg);
      }`;
    });
  }).as('css');
  // visit the page and confirm the HTML and the CSS
  // were intercepted successfully
  cy.visit('/');
  cy.wait('@html');
  cy.wait('@css');
  // confirm the changed HTML is present on the page
  cy.contains('This is a test');
});

// a test that confirms a specific network call is NOT made
// until the application adds a new item
it('does not make POST /todos request on load', () => {
  // a cy.spy() creates a "pass-through" function
  // that can function as a network interceptor that does nothing
  cy.intercept('POST', '/todos', cy.spy().as('post'));
  cy.visit('/');
  // in order to confirm the network call was not made
  // we need to wait for something to happen, like the application
  // loading or some time passing
  cy.wait(1000);
  cy.get('@post').should('not.have.been.called');
  // add a new item through the page UI
  cy.get('.new-todo').type('a new item{enter}');
  // now the network call should have been made
  cy.get('@post')
    .should('have.been.calledOnce')
    // confirm the network call was made with the correct data
    // get the first object to the first call
    .its('args.0.0.body')
    .should('deep.include', {
      title: 'a new item',
      completed: false
    });
});

describe('spying on load', () => {
  // use "beforeEach" callback to cleanly create a random
  // number of todos for each test
  beforeEach(() => {
    // reset the data on the server
    cy.request('POST', api + '/reset', { todos: [] });
    // create a random number of todos using cy.request
    // tip: use can use Lodash methods to draw a random number
    // look at the POST /todos calls the application sends
    Cypress._.times(Cypress._.random(10), k => {
      cy.request('POST', api + '/todos', {
        title: `todo ${k}`,
        completed: false,
        id: `id-${k}`
      });
    });
  });

  it('shows the items loaded from the server', () => {
    // spy on the route `GET /todos` to know how many items to expect
    cy.intercept('GET', '/todos', req => {
      // make sure the request is NOT cached by the browser
      // because we want to see the list of items in the response
      // Tip: to prevent the server from returning "304 Not Modified"
      // remove the caching headers from the outgoing request
      delete req.headers['if-none-match'];
    }).as('getTodos');
    cy.visit('/');
    // wait for the network call to happen
    // confirm the response is 200, read the number of items
    // and compare to the number of displayed todos
    cy.wait('@getTodos')
      .its('response')
      .then(response => {
        expect(response.statusCode).to.eq(200);
        cy.get('.todo').should(
          'have.length',
          response.body.length
        );
      });
  });
});

describe('refactor example', () => {
  it('confirms the right Todo item is sent to the server', () => {
    cy.intercept('GET', '/todos', []).as('todos');
    cy.visit('/');
    cy.intercept('POST', '/todos').as('postTodo');
    const title = 'new todo';
    const completed = false;
    cy.get('.new-todo').type(title + '{enter}');
    cy.wait('@postTodo')
      .its('response', { timeout: 0 })
      // using the assertion "deep.include"
      // instead of "have.property" to avoid
      // changing the subject value
      .should('deep.include', { statusCode: 201 })
      .its('body')
      .should('deep.include', { title, completed })
      .its('id')
      .then(id => {
        cy.log(`new item id: ${id}`);
        cy.request(api + '/todos/' + id)
          .its('body')
          .should('deep.equal', {
            id,
            title,
            completed
          });
      });
  });

  // Bonus: want even better assertions? use cy-spok
  // https://github.com/bahmutov/cy-spok
  it('confirms the item using cy-spok', () => {
    cy.intercept('GET', '/todos', []).as('todos');
    cy.visit('/');
    cy.intercept('POST', '/todos').as('postTodo');
    const title = 'new todo';
    const completed = false;
    cy.get('.new-todo').type(title + '{enter}');
    cy.wait('@postTodo')
      .its('response', { timeout: 0 })
      .should(
        spok({
          statusCode: 201,
          body: {
            id: spok.string,
            title,
            completed
          }
        })
      )
      .its('body.id')
      .then(id => {
        cy.log(`new item id: ${id}`);
        cy.request(api + '/todos/' + id)
          .its('body')
          .should('deep.equal', {
            id,
            title,
            completed
          });
      });
  });
});

it('controls the item ID generator', () => {
  // stub the initial GET /todos load
  // https://on.cypress.io/intercept
  // give it an alias "todos"
  cy.intercept('GET', '/todos', []).as('todos');
  // visit the page and wait for the todos intercept
  cy.visit('/');
  cy.wait('@todos');
  // stub the "POST /todos" network call
  // and give it an alias "postTodo"
  cy.intercept('POST', '/todos', {}).as('postTodo');
  // get the application's window object
  // https://on.cypress.io/window
  cy.window().then(win => {
    // stub the win.Math.random() method
    // so it always returns number 0.123
    // https://on.cypress.io/stub
    // give the stub an alias "random"
    // Tip: all stubs and spies are reset before each test
    cy.stub(win.Math, 'random').as('random').returns(0.123);
  });
  // type the new todo into the UI
  cy.get('.new-todo').type('control randomness{enter}');
  // wait for the "postTodo" call to happen
  // and confirm its full request body object
  cy.wait('@postTodo')
    .its('request.body')
    .should('deep.equal', {
      id: '123',
      title: 'control randomness',
      completed: false
    });
  // confirm it was no coincidence, and our stub was used
  // by getting the stub by its alias "random"
  // and checking that it was called once
  cy.get('@random').should('have.been.calledOnce');
});

describe('test periodic loading', () => {
  // application periodically loads todos from the server
  // we do not want to wait 1 minute for the load call
  // instead we want to speed up the application's clock
  it('loads todos every minute', () => {
    // note that the interceptors are matched in reverse order
    // thus we put the last interceptor first
    // answer the 3rd and all other calls with one two
    cy.intercept(
      {
        method: 'GET',
        url: '/todos',
        times: 1
      },
      {
        body: [
          { id: 1, title: 'use cy.clock', completed: true }
        ]
      }
    ).as('load3');
    // answer the 2nd call with three items
    cy.intercept(
      {
        method: 'GET',
        url: '/todos',
        times: 1
      },
      { fixture: 'three-items.json' }
    ).as('load2');
    // answer the first call with two items
    cy.intercept(
      {
        method: 'GET',
        url: '/todos',
        times: 1
      },
      { fixture: 'two-items.json' }
    ).as('load1');
    // leave the date unchanged, and only "freeze" the setInterval function
    cy.clock(null, ['setInterval']);
    cy.visit('/');
    cy.wait('@load1');
    cy.get('li.todo').should('have.length', 2);
    // make the application think an entire minute has passed
    cy.tick(60000);
    cy.wait('@load2');
    cy.get('li.todo').should('have.length', 3);
    // another minute passes
    cy.tick(60000);
    cy.wait('@load3');
    cy.get('li.todo')
      .should('have.length', 1)
      .contains('.todo', 'use cy.clock');
  });
});
