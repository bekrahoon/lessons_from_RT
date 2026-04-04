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

export const { increment } = counterSlice.actions;
export const { registerUser, loginUser, logoutUser, clearAuthError } = authSlice.actions;

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    auth: authSlice.reducer,
  }
});
