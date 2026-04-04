// ─────────────────────────────────────────────────────────────
//  AUTH MIDDLEWARES
//  Каждый middleware — чистая функция (payload) => string | null
//  null = ок, string = текст ошибки
// ─────────────────────────────────────────────────────────────

// Вспомогательная функция запуска цепочки middlewares
export const runMiddlewares = (middlewares, payload) => {
  for (const mw of middlewares) {
    const error = mw(payload);
    if (error) return error; // останавливаемся на первой ошибке
  }
  return null;
};

// ─── Middlewares регистрации ──────────────────────────────────

export const registrationMiddlewares = [
  // 1. Все поля заполнены
  ({ username, email, password, confirmPassword }) => {
    if (!username?.trim() || !email?.trim() || !password?.trim() || !confirmPassword?.trim()) {
      return 'Все поля обязательны для заполнения';
    }
  },

  // 2. Длина логина
  ({ username }) => {
    if (username.trim().length < 3) {
      return 'Логин должен содержать минимум 3 символа';
    }
  },

  // 3. Логин только латиница/цифры/_
  ({ username }) => {
    if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      return 'Логин: только латинские буквы, цифры и _';
    }
  },

  // 4. Формат email
  ({ email }) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return 'Введите корректный e-mail';
    }
  },

  // 5. Длина пароля
  ({ password }) => {
    if (password.length < 6) {
      return 'Пароль должен содержать минимум 6 символов';
    }
  },

  // 6. Заглавная буква в пароле
  ({ password }) => {
    if (!/[A-Z]/.test(password)) {
      return 'Пароль должен содержать хотя бы одну заглавную букву';
    }
  },

  // 7. Цифра в пароле
  ({ password }) => {
    if (!/[0-9]/.test(password)) {
      return 'Пароль должен содержать хотя бы одну цифру';
    }
  },

  // 8. Подтверждение пароля
  ({ password, confirmPassword }) => {
    if (password !== confirmPassword) {
      return 'Пароли не совпадают';
    }
  },

  // 9. Уникальность логина
  ({ username }) => {
    const users = JSON.parse(localStorage.getItem('sf_users') || '[]');
    if (users.find(u => u.username === username.trim())) {
      return 'Пользователь с таким логином уже существует';
    }
  },

  // 10. Уникальность email
  ({ email }) => {
    const users = JSON.parse(localStorage.getItem('sf_users') || '[]');
    if (users.find(u => u.email === email.trim())) {
      return 'Пользователь с таким e-mail уже зарегистрирован';
    }
  },
];

// ─── Middlewares авторизации ──────────────────────────────────

export const loginMiddlewares = [
  // 1. Поля заполнены
  ({ username, password }) => {
    if (!username?.trim() || !password?.trim()) {
      return 'Введите логин и пароль';
    }
  },

  // 2. Пользователь существует
  ({ username }) => {
    const users = JSON.parse(localStorage.getItem('sf_users') || '[]');
    if (!users.find(u => u.username === username.trim())) {
      return 'Пользователь не найден';
    }
  },

  // 3. Пароль верный
  ({ username, password }) => {
    const users = JSON.parse(localStorage.getItem('sf_users') || '[]');
    const user = users.find(u => u.username === username.trim());
    if (user && user.password !== password) {
      return 'Неверный пароль';
    }
  },
];
