import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBasket } from '../../contexts/BasketContext';
import '../../styles/Basket.css';

function UpdateOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrder, deleteOrder } = useBasket();
  
  const order = orders.find(o => o.id === parseInt(id));

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'card',
    deliveryMethod: 'standard',
    notes: '',
    status: 'pending',
  });

  const [errors, setErrors] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (order) {
      setFormData({
        fullName: order.fullName || '',
        email: order.email || '',
        phone: order.phone || '',
        address: order.address || '',
        city: order.city || '',
        postalCode: order.postalCode || '',
        paymentMethod: order.paymentMethod || 'card',
        deliveryMethod: order.deliveryMethod || 'standard',
        notes: order.notes || '',
        status: order.status || 'pending',
      });
    }
  }, [order]);

  if (!order) {
    return (
      <div className="order-empty">
        <h2>Заказ не найден</h2>
        <Link to="/orders" className="btn btn-primary">
          К списку заказов
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Введите ФИО';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }

    const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите телефон';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Некорректный номер телефона';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Введите адрес';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Введите город';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    updateOrder(order.id, formData);
    alert('Заказ успешно обновлен!');
    navigate('/orders');
  };

  const handleDelete = () => {
    deleteOrder(order.id);
    alert('Заказ удален!');
    navigate('/orders');
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'В обработке', class: 'status-pending', icon: '⏳' },
      confirmed: { text: 'Подтвержден', class: 'status-confirmed', icon: '✅' },
      shipping: { text: 'Доставляется', class: 'status-shipping', icon: '🚚' },
      delivered: { text: 'Доставлен', class: 'status-delivered', icon: '📦' },
      cancelled: { text: 'Отменен', class: 'status-cancelled', icon: '❌' },
    };
    const badge = badges[status] || badges.pending;
    return badge;
  };

  const getTotalPrice = () => {
    return order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="update-order-container">
      <div className="order-header">
        <div>
          <h2>Редактирование заказа #{order.id}</h2>
          <p className="order-date">
            Создан: {new Date(order.createdAt).toLocaleString('ru-RU')}
          </p>
        </div>
        <Link to="/orders" className="back-link">← К списку заказов</Link>
      </div>

      <div className="order-content">
        <form className="order-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>📊 Статус заказа</h3>
            <div className="status-selector">
              {['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'].map(status => {
                const badge = getStatusBadge(status);
                return (
                  <label key={status} className="status-option">
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={formData.status === status}
                      onChange={handleChange}
                    />
                    <span className={`status-badge ${badge.class}`}>
                      {badge.icon} {badge.text}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="form-section">
            <h3>📋 Контактная информация</h3>
            <div className="form-group">
              <label htmlFor="fullName">ФИО *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={errors.fullName ? 'error' : ''}
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Телефон *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>📍 Адрес доставки</h3>
            <div className="form-group">
              <label htmlFor="address">Адрес *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={errors.address ? 'error' : ''}
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">Город *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={errors.city ? 'error' : ''}
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="postalCode">Индекс</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>🚚 Способ доставки</h3>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="standard"
                  checked={formData.deliveryMethod === 'standard'}
                  onChange={handleChange}
                />
                <span>Стандартная доставка (3-5 дней) - Бесплатно</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="express"
                  checked={formData.deliveryMethod === 'express'}
                  onChange={handleChange}
                />
                <span>Экспресс доставка (1-2 дня) - $9.99</span>
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3>💳 Способ оплаты</h3>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={handleChange}
                />
                <span>💳 Банковская карта</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={formData.paymentMethod === 'cash'}
                  onChange={handleChange}
                />
                <span>💵 Наличными при получении</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={formData.paymentMethod === 'online'}
                  onChange={handleChange}
                />
                <span>🌐 Онлайн оплата</span>
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3>📝 Комментарий к заказу</h3>
            <div className="form-group">
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              💾 Сохранить изменения
            </button>
            <button 
              type="button"
              className="btn btn-danger"
              onClick={() => setShowDeleteConfirm(true)}
            >
              🗑️ Удалить заказ
            </button>
          </div>
        </form>

        <div className="order-sidebar">
          <div className="order-summary-card">
            <h3>Товары в заказе</h3>
            <div className="summary-items">
              {order.items.map(item => (
                <div key={item.id} className="summary-item">
                  <div className="item-info">
                    <span className="item-name">{item.title}</span>
                    <span className="item-meta">
                      {item.year} • {item.genre}
                    </span>
                  </div>
                  <div className="item-pricing">
                    <span className="item-qty">× {item.quantity}</span>
                    <span className="item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row">
              <span>Товары:</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Доставка:</span>
              <span>{formData.deliveryMethod === 'express' ? '$9.99' : 'Бесплатно'}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-total">
              <span>Итого:</span>
              <span className="total-price">
                ${(getTotalPrice() + (formData.deliveryMethod === 'express' ? 9.99 : 0)).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Подтверждение удаления</h3>
            <p>Вы уверены, что хотите удалить заказ #{order.id}?</p>
            <p className="warning-text">Это действие нельзя будет отменить.</p>
            <div className="modal-actions">
              <button 
                className="btn btn-danger"
                onClick={handleDelete}
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

export default UpdateOrder;