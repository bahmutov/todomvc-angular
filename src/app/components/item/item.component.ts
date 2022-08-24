import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { TodoInterface } from '../../services/todo.interface';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html'
})
export class ItemComponent implements OnChanges {
  editing = false;

  title = '';

  @Input()
  public todo: TodoInterface;

  @Output()
  remove = new EventEmitter<string>();

  @Output()
  update = new EventEmitter<TodoInterface>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes.todo) {
      this.title = changes.todo.currentValue.title;
    }
  }

  handleRemove() {
    this.remove.emit(this.todo.id);
  }

  handleBlur() {
    this.update.emit({
      id: this.todo.id,
      title: this.title
    });
    this.editing = false;
  }

  handleEdit() {
    this.editing = true;
  }

  handleCompleted() {
    this.update.emit({
      id: this.todo.id,
      completed: !this.todo.completed
    });
  }
}
