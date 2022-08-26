import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { TodoStateInterface } from '../../store/todo-state.interface';
import { onCreate } from '../../store/actions/todo.action';

const ENTER_KEY = 'Enter';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  title = '';

  constructor(private store: Store<TodoStateInterface>) {}

  handleChange(event: KeyboardEvent) {
    this.title = (event.target as HTMLInputElement).value;
  }

  handleSubmit(event: KeyboardEvent) {
    if (event.key !== ENTER_KEY) {
      return;
    }
    const title = this.title;
    const addTodoDelay = 0;
    if (addTodoDelay > 0) {
      setTimeout(() => {
        this.store.dispatch(onCreate(title));
      }, addTodoDelay);
    } else {
      // create the todo immediately
      this.store.dispatch(onCreate(title));
    }
    this.title = '';
  }
}
