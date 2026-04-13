import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, clearAuthError } from '../store/index.js';
import './Auth.css';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, error } = useSelector(s => s.auth);

  const [form,   setForm]   = useState({ username: '', password: '' });
  const [errs,   setErrs]   = useState({});
  const [showPw, setShowPw] = useState(false);
  const [shake,  setShake]  = useState(false);

  useEffect(() => { if (currentUser) navigate('/'); }, [currentUser, navigate]);
  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  // Анимация карточки при ошибке
  useEffect(() => {
    if (error) { setShake(true); setTimeout(() => setShake(false), 500); }
  }, [error]);

  const onChange = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    setErrs(p => ({ ...p, [name]: null }));
    if (error) dispatch(clearAuthError());
  };

  const onSubmit = e => {
    e.preventDefault();
    const newErrs = {};
    if (!form.username.trim()) newErrs.username = 'Введите логин';
    if (!form.password)        newErrs.password = 'Введите пароль';
    if (Object.keys(newErrs).length) { setErrs(newErrs); return; }

    // → Dispatch: проходит через loginMiddlewares в store
    dispatch(loginUser(form));
  };

  return (
    <div className="auth-page">
      <div className={`auth-card fade-up ${shake ? 'shake' : ''}`}>
        <div className="auth-head">
          <h1>Добро пожаловать</h1>
          <p>Войдите в свой аккаунт</p>
        </div>

        {/* Middleware-пайплайн */}
        <div className="mw-box">
          <span className="mw-label">⚙ Middleware-цепочка входа</span>
          <div className="mw-chain">
            {['Поля','Пользователь','Пароль'].map((s,i) => (
              <span key={i} className="mw-node">{s}</span>
            ))}
          </div>
        </div>

        {error && <div className="auth-alert">{error}</div>}

        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <div className="field">
            <label>Логин</label>
            <input
              name="username"
              value={form.username}
              onChange={onChange}
              placeholder="Ваш логин"
              className={errs.username || error ? 'err' : ''}
              autoComplete="username"
            />
            {errs.username && <span className="ferr">{errs.username}</span>}
          </div>

          <div className="field">
            <label>Пароль</label>
            <div className="input-wrap">
              <input
                name="password"
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={onChange}
                placeholder="Ваш пароль"
                className={errs.password || error ? 'err' : ''}
                autoComplete="current-password"
              />
              <button type="button" className="eye" onClick={() => setShowPw(p => !p)}>
                {showPw ? '🙈' : '👁'}
              </button>
            </div>
            {errs.password && <span className="ferr">{errs.password}</span>}
          </div>

          <button className="auth-btn" type="submit">Войти</button>
        </form>

        <p className="auth-switch">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}
