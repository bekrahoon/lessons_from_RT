import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/Auth.css';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Очистка ошибки при изменении поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }

    // Пароль
    if (!formData.password) {
      newErrors.password = 'Введите пароль';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      login(formData.email, formData.password);
      
      // Показываем уведомление
      alert('Вход выполнен успешно!');
      
      // Переход на страницу, откуда пришли, или на главную
      navigate(from, { replace: true });
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container login-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Вход</h1>
            <p>Войдите в свой аккаунт</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="example@mail.com"
                autoComplete="email"
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            {/* Пароль */}
            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                  placeholder="Введите пароль"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            {/* Запомнить меня и забыли пароль */}
            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span>Запомнить меня</span>
              </label>
              <Link to="/forgot-password" className="forgot-password-link">
                Забыли пароль?
              </Link>
            </div>

            {/* Ошибка отправки */}
            {errors.submit && (
              <div className="submit-error">{errors.submit}</div>
            )}

            {/* Кнопка отправки */}
            <button type="submit" className="auth-submit-btn">
              Войти
            </button>

            {/* Разделитель */}
            <div className="auth-divider">
              <span>или</span>
            </div>

            {/* Социальные сети */}
            <div className="social-login">
              <button type="button" className="social-btn google-btn">
                <span className="social-icon">🌐</span>
                Войти через Google
              </button>
              <button type="button" className="social-btn facebook-btn">
                <span className="social-icon">📘</span>
                Войти через Facebook
              </button>
            </div>

            {/* Ссылка на регистрацию */}
            <div className="auth-footer">
              <p>
                Нет аккаунта?{' '}
                <Link to="/register" className="auth-link">
                  Зарегистрироваться
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Дополнительная информация */}
        <div className="auth-info">
          <h3>Добро пожаловать!</h3>
          <p>Войдите, чтобы получить доступ ко всем функциям:</p>
          <ul>
            <li>🎬 Покупайте любимые фильмы</li>
            <li>🛒 Управляйте корзиной</li>
            <li>📦 Отслеживайте заказы</li>
            <li>⭐ Сохраняйте избранное</li>
            <li>🎁 Получайте скидки</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Login;