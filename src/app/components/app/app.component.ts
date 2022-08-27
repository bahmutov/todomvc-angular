import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TodoLocalService } from '../../services/todo-local.service';
import { TodoRestService } from '../../services/todo-rest.service';
import { Observable } from 'rxjs';
import { TodoInterface } from '../../services/todo.interface';
import { TodoStateInterface } from '../../store/todo-state.interface';
import { onLoad } from '../../store/actions/todo.action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  todos$: Observable<TodoInterface[]>;

  // let's not use a state model
  // and instead struggle :)
  loading: boolean;
  loaded: boolean;

  constructor(private store: Store<TodoStateInterface>) {
    this.todos$ = this.store.select('todos');
  }

  ngOnInit() {
    const uri = window.location.search.substring(1);
    const params = new URLSearchParams(uri);
    const delay = parseFloat(params.get('delay') || '0');

    const loadTodos = () => {
      this.loading = true;

      TodoRestService.loadTodos()
        .then(todos => {
          console.log(
            `loaded ${todos.length} ${
              todos.length === 1 ? 'todo' : 'todos'
            }`
          );
          this.loaded = true;
          this.store.dispatch(onLoad(todos));

          // @ts-ignore
          if (window.Cypress) {
            // @ts-ignore
            window.todos = todos;
          }
        })
        .finally(() => {
          this.loading = false;
        });

      // this.store.dispatch(onLoad(TodoLocalService.loadTodos()));
      this.todos$.subscribe(todos =>
        TodoLocalService.storeTodos(todos)
      );
    };

    setTimeout(loadTodos, delay);
    setInterval(loadTodos, 60_000);
  }
}
