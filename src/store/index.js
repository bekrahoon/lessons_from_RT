import { configureStore, createSlice } from '@reduxjs/toolkit';
import {
  runMiddlewares,
  registrationMiddlewares,
  loginMiddlewares,
} from '../middlewares/authMiddleware';

// ── helpers ───────────────────────────────────────────────────────
const ls = {
  get: (key, def) => { try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? def; } catch { return def; } },
  set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),
  del: (key) => localStorage.removeItem(key),
};

// ═══════════════════════════════════════════════════════════════════
//  AUTH SLICE
// ═══════════════════════════════════════════════════════════════════
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    currentUser: ls.get('tf_session', null),
    error: null,
  },
  reducers: {
    // РЕГИСТРАЦИЯ — проходит через registrationMiddlewares
    registerUser(state, { payload }) {
      state.error = null;
      const err = runMiddlewares(registrationMiddlewares, payload);
      if (err) { state.error = err; return; }

      const users = ls.get('tf_users', []);
      const newUser = {
        id: Date.now(),
        username: payload.username.trim(),
        email:    payload.email.trim(),
        password: payload.password,
        avatar:   payload.username.trim()[0].toUpperCase(),
        createdAt: new Date().toISOString(),
      };
      ls.set('tf_users', [...users, newUser]);

      const session = { ...newUser };
      delete session.password;
      ls.set('tf_session', session);
      state.currentUser = session;
    },

    // АВТОРИЗАЦИЯ — проходит через loginMiddlewares
    loginUser(state, { payload }) {
      state.error = null;
      const err = runMiddlewares(loginMiddlewares, payload);
      if (err) { state.error = err; return; }

      const users = ls.get('tf_users', []);
      const user = users.find(u => u.username === payload.username.trim());
      const session = { ...user };
      delete session.password;
      ls.set('tf_session', session);
      state.currentUser = session;
    },

    // ВЫХОД
    logoutUser(state) {
      ls.del('tf_session');
      state.currentUser = null;
      state.error = null;
    },

    clearAuthError(state) { state.error = null; },
  },
});

// ═══════════════════════════════════════════════════════════════════
//  TODO SLICE
// ═══════════════════════════════════════════════════════════════════
const PRIORITIES = { high: 3, medium: 2, low: 1 };

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    items: ls.get('tf_todos', []),
  },
  reducers: {
    // CREATE
    addTodo(state, { payload }) {
      if (!payload.title?.trim()) return;
      state.items.unshift({
        id:          Date.now(),
        title:       payload.title.trim(),
        description: payload.description?.trim() || '',
        priority:    payload.priority || 'medium',
        completed:   false,
        createdAt:   new Date().toISOString(),
      });
      ls.set('tf_todos', state.items);
    },

    // UPDATE
    updateTodo(state, { payload }) {
      const t = state.items.find(x => x.id === payload.id);
      if (!t) return;
      if (payload.title       !== undefined) t.title       = payload.title.trim();
      if (payload.description !== undefined) t.description = payload.description.trim();
      if (payload.priority    !== undefined) t.priority    = payload.priority;
      t.updatedAt = new Date().toISOString();
      ls.set('tf_todos', state.items);
    },

    // TOGGLE completed
    toggleTodo(state, { payload }) {
      const t = state.items.find(x => x.id === payload);
      if (t) { t.completed = !t.completed; ls.set('tf_todos', state.items); }
    },

    // DELETE
    deleteTodo(state, { payload }) {
      state.items = state.items.filter(x => x.id !== payload);
      ls.set('tf_todos', state.items);
    },
  },
});

// ═══════════════════════════════════════════════════════════════════
//  INTERACTIONS SLICE — Лайки, Избранное, Оценки
// ═══════════════════════════════════════════════════════════════════
// Структура state:
//  likes:     { [todoId]: [userId, ...] }
//  favorites: { [todoId]: [userId, ...] }
//  ratings:   { [todoId]: { [userId]: 1..5 } }

const interactionsSlice = createSlice({
  name: 'interactions',
  initialState: {
    likes:     ls.get('tf_likes',     {}),
    favorites: ls.get('tf_favorites', {}),
    ratings:   ls.get('tf_ratings',   {}),
  },
  reducers: {

    // 1. ЛАЙК — переключение like по todoId + userId
    toggleLike(state, { payload: { todoId, userId } }) {
      const key = String(todoId);
      if (!state.likes[key]) state.likes[key] = [];

      const idx = state.likes[key].indexOf(userId);
      if (idx === -1) {
        state.likes[key].push(userId);          // поставить лайк
      } else {
        state.likes[key].splice(idx, 1);        // убрать лайк
      }
      ls.set('tf_likes', state.likes);
    },

    // 2. ИЗБРАННОЕ — переключение favorite по todoId + userId
    toggleFavorite(state, { payload: { todoId, userId } }) {
      const key = String(todoId);
      if (!state.favorites[key]) state.favorites[key] = [];

      const idx = state.favorites[key].indexOf(userId);
      if (idx === -1) {
        state.favorites[key].push(userId);      // добавить в избранное
      } else {
        state.favorites[key].splice(idx, 1);    // убрать из избранного
      }
      ls.set('tf_favorites', state.favorites);
    },

    // 3. ОЦЕНКА — выставить рейтинг 1–5 от userId для todoId
    rateItem(state, { payload: { todoId, userId, rating } }) {
      const key = String(todoId);
      if (!state.ratings[key]) state.ratings[key] = {};

      if (state.ratings[key][userId] === rating) {
        // повторный клик по той же звезде — снять оценку
        delete state.ratings[key][userId];
      } else {
        state.ratings[key][userId] = rating;    // поставить оценку
      }
      ls.set('tf_ratings', state.ratings);
    },

  },
});

// ── Selectors ─────────────────────────────────────────────────────

// Количество лайков у задачи
export const selectLikeCount = (todoId) => (state) =>
  (state.interactions.likes[String(todoId)] || []).length;

// Лайкнул ли текущий пользователь
export const selectIsLiked = (todoId, userId) => (state) =>
  (state.interactions.likes[String(todoId)] || []).includes(userId);

// В избранном ли у текущего пользователя
export const selectIsFavorited = (todoId, userId) => (state) =>
  (state.interactions.favorites[String(todoId)] || []).includes(userId);

// Оценка конкретного пользователя (0 = не оценил)
export const selectUserRating = (todoId, userId) => (state) =>
  state.interactions.ratings[String(todoId)]?.[userId] || 0;

// Средняя оценка по всем пользователям
export const selectAvgRating = (todoId) => (state) => {
  const rMap = state.interactions.ratings[String(todoId)] || {};
  const vals = Object.values(rMap);
  if (!vals.length) return 0;
  return (vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1);
};

// Количество оценок
export const selectRatingCount = (todoId) => (state) =>
  Object.keys(state.interactions.ratings[String(todoId)] || {}).length;

// ─────────────────────────────────────────────────────────────────
export const { registerUser, loginUser, logoutUser, clearAuthError } = authSlice.actions;
export const { addTodo, updateTodo, toggleTodo, deleteTodo }         = todoSlice.actions;
export const { toggleLike, toggleFavorite, rateItem }                = interactionsSlice.actions;

export const store = configureStore({
  reducer: {
    auth:         authSlice.reducer,
    todos:        todoSlice.reducer,
    interactions: interactionsSlice.reducer,
  },
});
