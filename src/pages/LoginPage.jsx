import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, clearAuthError } from '../store';
import '../styles/Auth.css';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, error } = useSelector(state => state.auth);

  const [form, setForm] = useState({ username: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [shake, setShake] = useState(false);

  // Если уже залогинен — на главную
  useEffect(() => {
    if (currentUser) navigate('/');
  }, [currentUser, navigate]);

  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  // Анимация ошибки
  useEffect(() => {
    if (error) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }, [error]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    setFieldErrors(p => ({ ...p, [name]: null }));
    if (error) dispatch(clearAuthError());
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errors = {};
    if (!form.username.trim()) errors.username = 'Введите логин';
    if (!form.password.trim()) errors.password = 'Введите пароль';
    if (Object.keys(errors).length) { setFieldErrors(errors); return; }

    // Middleware в store: проверка существования + пароля
    dispatch(loginUser({ username: form.username, password: form.password }));
  };

  return (
    <div className="auth-page">
      <div className={`auth-card ${shake ? 'shake' : ''}`}>
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <span className="logo-text">SPIN</span><span className="logo-accent">FORGE</span>
          </Link>
          <h1 className="auth-title">Вход</h1>
          <p className="auth-subtitle">Добро пожаловать обратно</p>
        </div>

        {/* Middleware pipeline */}
        <div className="mw-pipeline">
          <span className="mw-label">⚙ Middleware проверки</span>
          <div className="mw-steps">
            {['Поля', 'Пользователь', 'Пароль'].map((s, i) => (
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
              placeholder="Ваш логин"
              className={fieldErrors.username || error ? 'input-error' : ''}
              autoComplete="username"
            />
            {fieldErrors.username && <span className="field-error">{fieldErrors.username}</span>}
          </div>

          <div className="auth-field">
            <label>Пароль</label>
            <div className="input-group">
              <input
                name="password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="Ваш пароль"
                className={fieldErrors.password || error ? 'input-error' : ''}
                autoComplete="current-password"
              />
              <button type="button" className="eye-btn" onClick={() => setShowPass(p => !p)}>
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
            {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
          </div>

          <button type="submit" className="auth-btn">Войти</button>

          <p className="auth-switch">
            Нет аккаунта?{' '}
            <Link to="/register" className="auth-link">Зарегистрироваться</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
