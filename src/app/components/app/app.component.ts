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

  constructor(private store: Store<TodoStateInterface>) {
    this.todos$ = this.store.select('todos');
  }

  ngOnInit() {
    TodoRestService.loadTodos().then(todos => {
      this.store.dispatch(onLoad(todos));
    });

    // this.store.dispatch(onLoad(TodoLocalService.loadTodos()));
    this.todos$.subscribe(todos => TodoLocalService.storeTodos(todos));
  }
}
