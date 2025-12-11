import React from 'react';
import { Link } from 'react-router-dom';
import { useBasket } from './BasketContext';
import './Basket.css';

function BasketList() {
  const { basket, removeFromBasket, updateQuantity, getTotalPrice, getTotalItems } = useBasket();

  if (basket.length === 0) {
    return (
      <div className="basket-empty">
        <div className="empty-icon">🛒</div>
        <h2>Ваша корзина пуста</h2>
        <p>Добавьте фильмы в корзину, чтобы продолжить покупку</p>
        <Link to="/" className="btn btn-primary">
          Перейти к каталогу
        </Link>
      </div>
    );
  }

  return (
    <div className="basket-container">
      <div className="basket-header">
        <h2>Корзина покупок</h2>
        <div className="basket-summary">
          <span className="items-count">Товаров: {getTotalItems()}</span>
        </div>
      </div>

      <div className="basket-content">
        <div className="basket-items">
          {basket.map(item => (
            <div key={item.id} className="basket-item">
              <div className="item-image">
                <span className="movie-icon">🎬</span>
              </div>
              
              <div className="item-details">
                <Link to={`/basket/${item.id}`} className="item-title">
                  {item.title}
                </Link>
                <p className="item-year">{item.year}</p>
                <p className="item-genre">{item.genre}</p>
              </div>

              <div className="item-price">
                <span className="price-label">Цена:</span>
                <span className="price-value">${item.price}</span>
              </div>

              <div className="item-quantity">
                <button 
                  className="qty-btn"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                  min="1"
                  className="qty-input"
                />
                <button 
                  className="qty-btn"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>

              <div className="item-subtotal">
                <span className="subtotal-label">Сумма:</span>
                <span className="subtotal-value">${(item.price * item.quantity).toFixed(2)}</span>
              </div>

              <button 
                className="btn-remove"
                onClick={() => removeFromBasket(item.id)}
                title="Удалить"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <div className="basket-sidebar">
          <div className="order-summary">
            <h3>Итого</h3>
            <div className="summary-row">
              <span>Товары ({getTotalItems()}):</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Доставка:</span>
              <span>Бесплатно</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-total">
              <span>Всего:</span>
              <span className="total-amount">${getTotalPrice().toFixed(2)}</span>
            </div>
            <Link to="/create-order" className="btn btn-checkout">
              Оформить заказ
            </Link>
            <Link to="/" className="btn btn-secondary">
              Продолжить покупки
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BasketList;