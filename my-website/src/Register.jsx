import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Auth.css';

function Register() {
  const navigate = useNavigate();
  const { register, isEmailTaken } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Очистка ошибки при изменении поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Имя
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Введите имя';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'Имя должно содержать минимум 2 символа';
    }

    // Фамилия
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Введите фамилию';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Фамилия должна содержать минимум 2 символа';
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    } else if (isEmailTaken(formData.email)) {
      newErrors.email = 'Email уже используется';
    }

    // Телефон
    const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите телефон';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Некорректный номер телефона';
    }

    // Дата рождения
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Выберите дату рождения';
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 13) {
        newErrors.dateOfBirth = 'Вам должно быть минимум 13 лет';
      } else if (age > 120) {
        newErrors.dateOfBirth = 'Некорректная дата рождения';
      }
    }

    // Пароль
    if (!formData.password) {
      newErrors.password = 'Введите пароль';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Пароль должен содержать хотя бы одну заглавную букву';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Пароль должен содержать хотя бы одну цифру';
    }

    // Подтверждение пароля
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Подтвердите пароль';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
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
      // Убираем confirmPassword перед сохранением
      const { confirmPassword, ...userData } = formData;
      
      register(userData);
      
      // Показываем уведомление
      alert('Регистрация прошла успешно! Добро пожаловать!');
      
      // Переход на главную
      navigate('/');
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, text: '', color: '' };

    let strength = 0;
    
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

    const levels = [
      { strength: 0, text: '', color: '' },
      { strength: 1, text: 'Очень слабый', color: '#ff4444' },
      { strength: 2, text: 'Слабый', color: '#ff8800' },
      { strength: 3, text: 'Средний', color: '#ffbb00' },
      { strength: 4, text: 'Хороший', color: '#88cc00' },
      { strength: 5, text: 'Отличный', color: '#00cc44' },
      { strength: 6, text: 'Превосходный', color: '#00aa00' },
    ];

    return levels[Math.min(strength, 6)];
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Регистрация</h1>
            <p>Создайте аккаунт для покупки фильмов</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Имя и Фамилия */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Имя *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? 'error' : ''}
                  placeholder="Иван"
                />
                {errors.firstName && (
                  <span className="error-message">{errors.firstName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Фамилия *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? 'error' : ''}
                  placeholder="Иванов"
                />
                {errors.lastName && (
                  <span className="error-message">{errors.lastName}</span>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="example@mail.com"
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            {/* Телефон */}
            <div className="form-group">
              <label htmlFor="phone">Телефон *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? 'error' : ''}
                placeholder="+996 XXX XXX XXX"
              />
              {errors.phone && (
                <span className="error-message">{errors.phone}</span>
              )}
            </div>

            {/* Дата рождения */}
            <div className="form-group">
              <label htmlFor="dateOfBirth">Дата рождения *</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={errors.dateOfBirth ? 'error' : ''}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.dateOfBirth && (
                <span className="error-message">{errors.dateOfBirth}</span>
              )}
            </div>

            {/* Пароль */}
            <div className="form-group">
              <label htmlFor="password">Пароль *</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                  placeholder="Минимум 6 символов"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {formData.password && (
                <div className="password-strength">
                  <div 
                    className="password-strength-bar"
                    style={{ 
                      width: `${(passwordStrength.strength / 6) * 100}%`,
                      backgroundColor: passwordStrength.color 
                    }}
                  ></div>
                  <span style={{ color: passwordStrength.color }}>
                    {passwordStrength.text}
                  </span>
                </div>
              )}
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            {/* Подтверждение пароля */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Подтвердите пароль *</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'error' : ''}
                  placeholder="Повторите пароль"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>

            {/* Ошибка отправки */}
            {errors.submit && (
              <div className="submit-error">{errors.submit}</div>
            )}

            {/* Кнопка отправки */}
            <button type="submit" className="auth-submit-btn">
              Зарегистрироваться
            </button>

            {/* Ссылка на вход */}
            <div className="auth-footer">
              <p>
                Уже есть аккаунт?{' '}
                <Link to="/login" className="auth-link">
                  Войти
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Дополнительная информация */}
        <div className="auth-info">
          <h3>Преимущества регистрации</h3>
          <ul>
            <li>🎬 Доступ к каталогу фильмов</li>
            <li>🛒 Персональная корзина покупок</li>
            <li>📦 История заказов</li>
            <li>⭐ Избранные фильмы</li>
            <li>🎁 Специальные предложения</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Register;