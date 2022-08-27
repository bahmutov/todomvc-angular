import { createReducer, on } from '@ngrx/store';
import { TodoInterface } from '../../services/todo.interface';
import {
  onClearCompleted,
  onCompleteAll,
  onCreate,
  onLoad,
  onRemove,
  onUpdate
} from '../actions/todo.action';
import {
  selectCompleted,
  selectNotCompleted
} from '../selectors/todo.selector';

const areAllCompleted = state =>
  state.length &&
  selectCompleted(state).length === state.length;

const API_URL = 'http://localhost:3000';
const TODOS_URL = `${API_URL}/todos`;

function randomId() {
  return Math.random().toString().substr(2, 10);
}

export const createTodoReducer = (
  initialState: TodoInterface[] = []
) =>
  createReducer(
    initialState,
    on(onLoad, (state: TodoInterface[], { todos }) => {
      return todos;
    }),
    on(onCreate, (state: TodoInterface[], { title }) => {
      // this is an effect, but whatever
      const newTodo = {
        id: randomId(),
        title,
        completed: false
      };
      fetch(TODOS_URL, {
        method: 'POST',
        body: JSON.stringify(newTodo),
        // mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(r => {
          if (r.ok) {
            console.log('added new todo', title);
          }
        })
        .catch(e => {
          console.error(e);
        });

      return [...state, newTodo];
    }),
    on(onUpdate, (state: TodoInterface[], { values }) => {
      return state.map(todo =>
        todo.id === values.id
          ? { ...todo, ...values }
          : todo
      );
    }),
    on(onRemove, (state: TodoInterface[], { id }) => {
      fetch(TODOS_URL + '/' + id, {
        method: 'DELETE'
      });
      return state.filter(todo => todo.id !== id);
    }),
    on(onCompleteAll, (state: TodoInterface[]) => {
      return state.map(todo => ({
        ...todo,
        ...{ completed: !areAllCompleted(state) }
      }));
    }),
    on(onClearCompleted, (state: TodoInterface[]) => {
      return selectNotCompleted(state);
    })
  );
