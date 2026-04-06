import { configureStore, createSlice } from '@reduxjs/toolkit';
import { runMiddlewares, registrationMiddlewares, loginMiddlewares } from './middlewares/authMiddleware';

// ─── Counter slice (существующий) ────────────────────────────
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: state => { state.value += 1; }
  }
});

// ─── Auth slice ───────────────────────────────────────────────
const getStoredSession = () => {
  try { return JSON.parse(localStorage.getItem('sf_session') || 'null'); }
  catch { return null; }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    currentUser: getStoredSession(),
    error: null,
  },
  reducers: {
    registerUser: (state, action) => {
      state.error = null;
      const error = runMiddlewares(registrationMiddlewares, action.payload);
      if (error) { state.error = error; return; }

      const users = JSON.parse(localStorage.getItem('sf_users') || '[]');
      const newUser = {
        id: Date.now(),
        username: action.payload.username.trim(),
        email: action.payload.email.trim(),
        password: action.payload.password,
        balance: 1000,
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('sf_users', JSON.stringify([...users, newUser]));
      const session = { ...newUser }; delete session.password;
      localStorage.setItem('sf_session', JSON.stringify(session));
      state.currentUser = session;
    },

    loginUser: (state, action) => {
      state.error = null;
      const error = runMiddlewares(loginMiddlewares, action.payload);
      if (error) { state.error = error; return; }

      const users = JSON.parse(localStorage.getItem('sf_users') || '[]');
      const user = users.find(u => u.username === action.payload.username.trim());
      const session = { ...user }; delete session.password;
      localStorage.setItem('sf_session', JSON.stringify(session));
      state.currentUser = session;
    },

    logoutUser: (state) => {
      localStorage.removeItem('sf_session');
      state.currentUser = null;
      state.error = null;
    },

    clearAuthError: (state) => { state.error = null; },
  }
});

// ─── Todo slice ───────────────────────────────────────────────
const getStoredTodos = () => {
  try { return JSON.parse(localStorage.getItem('sf_todos') || '[]'); }
  catch { return []; }
};

const saveTodos = (todos) => {
  localStorage.setItem('sf_todos', JSON.stringify(todos));
};

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    items: getStoredTodos(),   // READ — загружаем из localStorage
    loading: false,
    error: null,
  },
  reducers: {
    // CREATE
    addTodo: (state, action) => {
      const { title, description, priority } = action.payload;
      if (!title.trim()) return;
      const newTodo = {
        id: Date.now(),
        title: title.trim(),
        description: description?.trim() || '',
        priority: priority || 'medium',   // low | medium | high
        completed: false,
        createdAt: new Date().toISOString(),
      };
      state.items.unshift(newTodo);
      saveTodos(state.items);
    },

    // UPDATE — изменить заголовок / описание / приоритет
    updateTodo: (state, action) => {
      const { id, title, description, priority } = action.payload;
      const todo = state.items.find(t => t.id === id);
      if (!todo) return;
      if (title !== undefined) todo.title = title.trim();
      if (description !== undefined) todo.description = description.trim();
      if (priority !== undefined) todo.priority = priority;
      saveTodos(state.items);
    },

    // TOGGLE completed
    toggleTodo: (state, action) => {
      const todo = state.items.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodos(state.items);
      }
    },

    // DELETE
    deleteTodo: (state, action) => {
      state.items = state.items.filter(t => t.id !== action.payload);
      saveTodos(state.items);
    },

    // GET ID — просто селектор, но можно хранить selectedId
    setSelectedTodo: (state, action) => {
      state.selectedId = action.payload;
    },
  },
});

export const { increment } = counterSlice.actions;
export const { registerUser, loginUser, logoutUser, clearAuthError } = authSlice.actions;
export const { addTodo, updateTodo, toggleTodo, deleteTodo, setSelectedTodo } = todoSlice.actions;

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    auth: authSlice.reducer,
    todos: todoSlice.reducer,
  }
});
