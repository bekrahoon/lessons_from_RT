import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Auth.css';

function Profile() {
  const navigate = useNavigate();
  const { currentUser, updateProfile, deleteAccount, logout } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    dateOfBirth: currentUser?.dateOfBirth || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Введите имя';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Введите фамилию';
    }

    const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите телефон';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Некорректный номер телефона';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    try {
      updateProfile(formData);
      setIsEditing(false);
      alert('Профиль успешно обновлен!');
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      dateOfBirth: currentUser?.dateOfBirth || '',
    });
    setIsEditing(false);
    setErrors({});
  };

  const handleDeleteAccount = () => {
    deleteAccount();
    alert('Ваш аккаунт был удален');
    navigate('/');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указано';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateAge = (dateString) => {
    if (!dateString) return null;
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  if (!currentUser) {
    return (
      <div className="profile-page">
        <div className="profile-empty">
          <h2>Пожалуйста, войдите в систему</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Левая панель с аватаром */}
        <div className="profile-sidebar">
          <div className="profile-avatar-section">
            <img 
              src={currentUser.avatar} 
              alt={`${currentUser.firstName} ${currentUser.lastName}`}
              className="profile-avatar"
            />
            <h2>{currentUser.firstName} {currentUser.lastName}</h2>
            <p className="profile-email">{currentUser.email}</p>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-label">Дата регистрации</span>
                <span className="stat-value">
                  {new Date(currentUser.createdAt).toLocaleDateString('ru-RU')}
                </span>
              </div>
              {currentUser.dateOfBirth && (
                <div className="stat-item">
                  <span className="stat-label">Возраст</span>
                  <span className="stat-value">{calculateAge(currentUser.dateOfBirth)} лет</span>
                </div>
              )}
            </div>
          </div>

          <div className="profile-actions">
            <button 
              className="profile-action-btn logout-btn"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              🚪 Выйти
            </button>
          </div>
        </div>

        {/* Основной контент */}
        <div className="profile-main">
          <div className="profile-header">
            <h1>Личная информация</h1>
            {!isEditing && (
              <button 
                className="edit-profile-btn"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Редактировать
              </button>
            )}
          </div>

          <div className="profile-form">
            {isEditing ? (
              // Режим редактирования
              <div className="edit-mode">
                <div className="form-row">
                  <div className="form-group">
                    <label>Имя</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={errors.firstName ? 'error' : ''}
                    />
                    {errors.firstName && (
                      <span className="error-message">{errors.firstName}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Фамилия</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={errors.lastName ? 'error' : ''}
                    />
                    {errors.lastName && (
                      <span className="error-message">{errors.lastName}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Email (нельзя изменить)</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="disabled-input"
                  />
                </div>

                <div className="form-group">
                  <label>Телефон</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && (
                    <span className="error-message">{errors.phone}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Дата рождения (нельзя изменить)</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    disabled
                    className="disabled-input"
                  />
                </div>

                {errors.submit && (
                  <div className="submit-error">{errors.submit}</div>
                )}

                <div className="edit-actions">
                  <button 
                    className="save-btn"
                    onClick={handleSave}
                  >
                    💾 Сохранить
                  </button>
                  <button 
                    className="cancel-btn"
                    onClick={handleCancel}
                  >
                    ❌ Отмена
                  </button>
                </div>
              </div>
            ) : (
              // Режим просмотра
              <div className="view-mode">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Имя:</span>
                    <span className="info-value">{currentUser.firstName}</span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Фамилия:</span>
                    <span className="info-value">{currentUser.lastName}</span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{currentUser.email}</span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Телефон:</span>
                    <span className="info-value">{currentUser.phone}</span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Дата рождения:</span>
                    <span className="info-value">{formatDate(currentUser.dateOfBirth)}</span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Дата регистрации:</span>
                    <span className="info-value">{formatDate(currentUser.createdAt)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Опасная зона */}
          <div className="danger-zone">
            <h3>Опасная зона</h3>
            <p>После удаления аккаунта все ваши данные будут безвозвратно утеряны</p>
            <button 
              className="delete-account-btn"
              onClick={() => setShowDeleteConfirm(true)}
            >
              🗑️ Удалить аккаунт
            </button>
          </div>
        </div>
      </div>

      {/* Модальное окно подтверждения удаления */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>⚠️ Подтверждение удаления</h3>
            <p>Вы действительно хотите удалить свой аккаунт?</p>
            <p className="warning-text">
              Это действие необратимо. Все ваши данные, заказы и история будут удалены.
            </p>
            <div className="modal-actions">
              <button 
                className="btn btn-danger"
                onClick={handleDeleteAccount}
              >
                Да, удалить
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;