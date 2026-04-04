import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, clearAuthError } from '../store';
import '../styles/Auth.css';

// Правила валидации полей (клиентская — для UI подсказок)
const FIELD_RULES = {
  username: [
    { test: v => v.length >= 3, msg: 'Минимум 3 символа' },
    { test: v => /^[a-zA-Z0-9_]+$/.test(v), msg: 'Только латиница, цифры, _' },
  ],
  email: [
    { test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Некорректный e-mail' },
  ],
  password: [
    { test: v => v.length >= 6, msg: 'Минимум 6 символов' },
    { test: v => /[A-Z]/.test(v), msg: 'Нужна заглавная буква' },
    { test: v => /[0-9]/.test(v), msg: 'Нужна хотя бы одна цифра' },
  ],
  confirmPassword: [
    { test: (v, all) => v === all.password, msg: 'Пароли не совпадают' },
  ],
};

const validateField = (name, value, allValues) => {
  const rules = FIELD_RULES[name] || [];
  for (const rule of rules) {
    if (!rule.test(value, allValues)) return rule.msg;
  }
  return null;
};

// Индикатор силы пароля
const PasswordStrength = ({ password }) => {
  if (!password) return null;
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = ['', 'Слабый', 'Слабый', 'Средний', 'Сильный', 'Очень сильный'];
  const colors = ['', '#ff4d4d', '#ff8c00', '#f0c040', '#00ff9d', '#00b8ff'];

  return (
    <div className="password-strength">
      <div className="strength-bars">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="strength-bar" style={{ background: i <= score ? colors[score] : '#333' }} />
        ))}
      </div>
      <span style={{ color: colors[score], fontSize: 12 }}>{levels[score]}</span>
    </div>
  );
};

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, error } = useSelector(state => state.auth);

  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [touched, setTouched] = useState({});

  // Если уже залогинен — на главную
  useEffect(() => {
    if (currentUser) navigate('/');
  }, [currentUser, navigate]);

  // Сброс глобальной ошибки при размонтировании
  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  const handleChange = e => {
    const { name, value } = e.target;
    const newForm = { ...form, [name]: value };
    setForm(newForm);

    if (touched[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: validateField(name, value, newForm) }));
    }
    if (error) dispatch(clearAuthError());
  };

  const handleBlur = e => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setFieldErrors(prev => ({ ...prev, [name]: validateField(name, value, form) }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Валидируем все поля
    const errors = {};
    Object.keys(FIELD_RULES).forEach(field => {
      const err = validateField(field, form[field] || '', form);
      if (err) errors[field] = err;
    });
    setFieldErrors(errors);
    setTouched({ username: true, email: true, password: true, confirmPassword: true });
    if (Object.keys(errors).length > 0) return;

    // Диспатчим — middleware в store проверит всё ещё раз
    dispatch(registerUser(form));
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <span className="logo-text">SPIN</span><span className="logo-accent">FORGE</span>
          </Link>
          <h1 className="auth-title">Регистрация</h1>
          <p className="auth-subtitle">Создайте аккаунт и получите 1000 ⚡ на старте</p>
        </div>

        {/* Визуализация middleware-цепочки */}
        <div className="mw-pipeline">
          <span className="mw-label">⚙ Middleware проверки</span>
          <div className="mw-steps">
            {['Поля', 'Логин', 'Email', 'Пароль', 'Уникальность'].map((s, i) => (
              <span key={i} className="mw-step">→ {s}</span>
            ))}
          </div>
        </div>

        {error && <div className="auth-error">⚠ {error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="auth-field">
            <label>Логин</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="game_master_99"
              className={fieldErrors.username ? 'input-error' : ''}
            />
            {fieldErrors.username && <span className="field-error">{fieldErrors.username}</span>}
          </div>

          <div className="auth-field">
            <label>E-mail</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="you@example.com"
              className={fieldErrors.email ? 'input-error' : ''}
            />
            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
          </div>

          <div className="auth-field">
            <label>Пароль</label>
            <div className="input-group">
              <input
                name="password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Мин. 6 символов, A-Z, 0-9"
                className={fieldErrors.password ? 'input-error' : ''}
              />
              <button type="button" className="eye-btn" onClick={() => setShowPass(p => !p)}>
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
            <PasswordStrength password={form.password} />
            {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
          </div>

          <div className="auth-field">
            <label>Подтверждение пароля</label>
            <input
              name="confirmPassword"
              type={showPass ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Повторите пароль"
              className={fieldErrors.confirmPassword ? 'input-error' : ''}
            />
            {fieldErrors.confirmPassword && <span className="field-error">{fieldErrors.confirmPassword}</span>}
          </div>

          <button type="submit" className="auth-btn">Создать аккаунт</button>

          <p className="auth-switch">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="auth-link">Войти</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
