import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBasket } from '../../contexts/BasketContext';
import '../../styles/Basket.css';

function CreateOrder() {
  const navigate = useNavigate();
  const { basket, getTotalPrice, createOrder } = useBasket();
  
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
  });

  const [errors, setErrors] = useState({});

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

    if (basket.length === 0) {
      alert('Корзина пуста!');
      return;
    }

    if (!validateForm()) {
      return;
    }

    const order = createOrder(formData);
    alert(`Заказ #${order.id} успешно создан!`);
    navigate('/orders');
  };

  if (basket.length === 0) {
    return (
      <div className="order-empty">
        <h2>Корзина пуста</h2>
        <p>Добавьте товары в корзину перед оформлением заказа</p>
        <Link to="/" className="btn btn-primary">
          К каталогу фильмов
        </Link>
      </div>
    );
  }

  return (
    <div className="create-order-container">
      <div className="order-header">
        <h2>Оформление заказа</h2>
        <Link to="/basket" className="back-link">← Вернуться к корзине</Link>
      </div>

      <div className="order-content">
        <form className="order-form" onSubmit={handleSubmit}>
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
                placeholder="Иванов Иван Иванович"
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
                  placeholder="example@mail.com"
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
                  placeholder="+996 XXX XXX XXX"
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
                placeholder="Улица, дом, квартира"
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
                  placeholder="Бишкек"
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
                  placeholder="720000"
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
                placeholder="Дополнительная информация для курьера..."
                rows="4"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-checkout">
            Оформить заказ на ${getTotalPrice().toFixed(2)}
          </button>
        </form>

        <div className="order-sidebar">
          <div className="order-summary-card">
            <h3>Ваш заказ</h3>
            <div className="summary-items">
              {basket.map(item => (
                <div key={item.id} className="summary-item">
                  <span className="item-name">
                    {item.title} × {item.quantity}
                  </span>
                  <span className="item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
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
    </div>
  );
}

export default CreateOrder;