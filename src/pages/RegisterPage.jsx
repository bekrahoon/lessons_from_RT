import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, clearAuthError } from '../store/index.js';
import './Auth.css';

// Клиентские правила для подсказок в реальном времени
const RULES = {
  username: [
    { test: v => v.length >= 3,              msg: 'Минимум 3 символа' },
    { test: v => /^[a-zA-Z0-9_]*$/.test(v), msg: 'Только латиница, цифры, _' },
  ],
  email: [
    { test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Некорректный e-mail' },
  ],
  password: [
    { test: v => v.length >= 6,    msg: 'Минимум 6 символов' },
    { test: v => /[A-Z]/.test(v),  msg: 'Нужна заглавная буква' },
    { test: v => /[0-9]/.test(v),  msg: 'Нужна хотя бы одна цифра' },
  ],
  confirmPassword: [
    { test: (v, all) => v === all.password, msg: 'Пароли не совпадают' },
  ],
};

const checkField = (name, value, all) => {
  for (const r of RULES[name] || [])
    if (!r.test(value, all)) return r.msg;
  return null;
};

// Индикатор силы пароля
function PasswordMeter({ password }) {
  if (!password) return null;
  let score = 0;
  if (password.length >= 6)         score++;
  if (password.length >= 10)        score++;
  if (/[A-Z]/.test(password))       score++;
  if (/[0-9]/.test(password))       score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const colors = ['#ff5c6a','#ff5c6a','#ffb547','#ffb547','#2dd4a0','#4f8bff'];
  const labels = ['','Слабый','Слабый','Средний','Сильный','Отлично'];
  return (
    <div className="password-meter">
      <div className="meter-bars">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="meter-bar"
            style={{ background: i <= score ? colors[score] : 'var(--border2)' }} />
        ))}
      </div>
      <span style={{ color: colors[score], fontSize: 11 }}>{labels[score]}</span>
    </div>
  );
}

export default function RegisterPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { currentUser, error } = useSelector(s => s.auth);

  const [form,   setForm]   = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [errs,   setErrs]   = useState({});
  const [touched, setTouched] = useState({});
  const [showPw,  setShowPw] = useState(false);

  useEffect(() => { if (currentUser) navigate('/'); }, [currentUser, navigate]);
  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  const onChange = e => {
    const { name, value } = e.target;
    const next = { ...form, [name]: value };
    setForm(next);
    if (error) dispatch(clearAuthError());
    if (touched[name])
      setErrs(p => ({ ...p, [name]: checkField(name, value, next) }));
  };

  const onBlur = e => {
    const { name, value } = e.target;
    setTouched(p => ({ ...p, [name]: true }));
    setErrs(p => ({ ...p, [name]: checkField(name, value, form) }));
  };

  const onSubmit = e => {
    e.preventDefault();
    const newErrs = {};
    Object.keys(RULES).forEach(k => {
      const err = checkField(k, form[k] || '', form);
      if (err) newErrs[k] = err;
    });
    setErrs(newErrs);
    setTouched({ username: true, email: true, password: true, confirmPassword: true });
    if (Object.keys(newErrs).length) return;
    // → Dispatch: проходит через registrationMiddlewares в store
    dispatch(registerUser(form));
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-up">
        <div className="auth-head">
          <h1>Создать аккаунт</h1>
          <p>Заполните форму для регистрации</p>
        </div>

        {/* Визуализация middleware-пайплайна */}
        <div className="mw-box">
          <span className="mw-label">⚙ Middleware-цепочка регистрации</span>
          <div className="mw-chain">
            {['Поля','Логин','Email','Пароль','Совпадение','Уникальность'].map((s,i) => (
              <span key={i} className="mw-node">{s}</span>
            ))}
          </div>
        </div>

        {error && <div className="auth-alert">{error}</div>}

        <form className="auth-form" onSubmit={onSubmit} noValidate>

          <Field label="Логин" name="username" value={form.username}
            onChange={onChange} onBlur={onBlur}
            placeholder="game_user_01"
            error={errs.username} />

          <Field label="E-mail" name="email" type="email" value={form.email}
            onChange={onChange} onBlur={onBlur}
            placeholder="you@example.com"
            error={errs.email} />

          <div className="field">
            <label>Пароль</label>
            <div className="input-wrap">
              <input
                name="password"
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={onChange}
                onBlur={onBlur}
                placeholder="Мин. 6 симв., A-Z, 0-9"
                className={errs.password ? 'err' : ''}
              />
              <button type="button" className="eye" onClick={() => setShowPw(p => !p)}>
                {showPw ? '🙈' : '👁'}
              </button>
            </div>
            <PasswordMeter password={form.password} />
            {errs.password && <span className="ferr">{errs.password}</span>}
          </div>

          <div className="field">
            <label>Подтверждение пароля</label>
            <div className="input-wrap">
              <input
                name="confirmPassword"
                type={showPw ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={onChange}
                onBlur={onBlur}
                placeholder="Повторите пароль"
                className={errs.confirmPassword ? 'err' : ''}
              />
            </div>
            {errs.confirmPassword && <span className="ferr">{errs.confirmPassword}</span>}
          </div>

          <button className="auth-btn" type="submit">Зарегистрироваться</button>
        </form>

        <p className="auth-switch">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, name, type = 'text', value, onChange, onBlur, placeholder, error }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input name={name} type={type} value={value}
        onChange={onChange} onBlur={onBlur}
        placeholder={placeholder}
        className={error ? 'err' : ''} />
      {error && <span className="ferr">{error}</span>}
    </div>
  );
}
