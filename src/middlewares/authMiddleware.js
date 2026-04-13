// ─────────────────────────────────────────────────────────────────
//  AUTH MIDDLEWARES
//  Каждый middleware — чистая функция: (payload) => string | null
//  Возвращает строку ошибки или null (ок)
// ─────────────────────────────────────────────────────────────────

// Запускает цепочку middlewares, останавливается на первой ошибке
export const runMiddlewares = (middlewares, payload) => {
  for (const mw of middlewares) {
    const error = mw(payload);
    if (error) return error;
  }
  return null;
};

// Вспомогалка чтения пользователей
const getUsers = () => {
  try { return JSON.parse(localStorage.getItem('tf_users') || '[]'); }
  catch { return []; }
};

// ─── Middlewares РЕГИСТРАЦИИ ──────────────────────────────────────
export const registrationMiddlewares = [
  // 1. Все поля обязательны
  ({ username, email, password, confirmPassword }) => {
    if (!username?.trim() || !email?.trim() || !password || !confirmPassword)
      return 'Заполните все поля';
  },
  // 2. Длина логина
  ({ username }) => {
    if (username.trim().length < 3)
      return 'Логин: минимум 3 символа';
  },
  // 3. Символы логина
  ({ username }) => {
    if (!/^[a-zA-Z0-9_]+$/.test(username.trim()))
      return 'Логин: только латиница, цифры и _';
  },
  // 4. Формат email
  ({ email }) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return 'Введите корректный e-mail';
  },
  // 5. Минимальная длина пароля
  ({ password }) => {
    if (password.length < 6)
      return 'Пароль: минимум 6 символов';
  },
  // 6. Заглавная буква
  ({ password }) => {
    if (!/[A-Z]/.test(password))
      return 'Пароль должен содержать хотя бы одну заглавную букву';
  },
  // 7. Цифра в пароле
  ({ password }) => {
    if (!/[0-9]/.test(password))
      return 'Пароль должен содержать хотя бы одну цифру';
  },
  // 8. Совпадение паролей
  ({ password, confirmPassword }) => {
    if (password !== confirmPassword)
      return 'Пароли не совпадают';
  },
  // 9. Уникальность логина
  ({ username }) => {
    if (getUsers().find(u => u.username === username.trim()))
      return 'Этот логин уже занят';
  },
  // 10. Уникальность email
  ({ email }) => {
    if (getUsers().find(u => u.email === email.trim()))
      return 'Этот e-mail уже зарегистрирован';
  },
];

// ─── Middlewares АВТОРИЗАЦИИ ──────────────────────────────────────
export const loginMiddlewares = [
  // 1. Поля заполнены
  ({ username, password }) => {
    if (!username?.trim() || !password)
      return 'Введите логин и пароль';
  },
  // 2. Пользователь существует
  ({ username }) => {
    if (!getUsers().find(u => u.username === username.trim()))
      return 'Пользователь с таким логином не найден';
  },
  // 3. Проверка пароля
  ({ username, password }) => {
    const user = getUsers().find(u => u.username === username.trim());
    if (user && user.password !== password)
      return 'Неверный пароль';
  },
];
