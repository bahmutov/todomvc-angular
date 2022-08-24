import { TodoInterface } from './todo.interface';

const API_URL = 'http://localhost:3000';
const TODOS_URL = `${API_URL}/todos`;

export class TodoRestService {
  static async loadTodos(): Promise<TodoInterface[]> {
    // return JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const res = await fetch(TODOS_URL);
    if (!res.ok) {
      console.error('could not load todos');
      const message = await res.text();
      console.error(message);
      throw new Error(message);
    }
    const todos = await res.json();
    // console.log(todos);
    return todos;
  }

  static async storeTodos(todos: TodoInterface[]) {
    console.log('storeTodos');
    await fetch(`${API_URL}/reset`, {
      method: 'POST',
      body: JSON.stringify({ todos })
    });
    // window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
  }
}
