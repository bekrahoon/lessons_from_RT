import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBasket } from '../../contexts/BasketContext';
import '../../styles/Basket.css';

function BasketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { basket, removeFromBasket, updateQuantity } = useBasket();
  
  const item = basket.find(item => item.id === parseInt(id));

  if (!item) {
    return (
      <div className="basket-detail-empty">
        <h2>Товар не найден в корзине</h2>
        <Link to="/basket" className="btn btn-primary">
          Вернуться к корзине
        </Link>
      </div>
    );
  }

  const handleRemove = () => {
    removeFromBasket(item.id);
    navigate('/basket');
  };

  return (
    <div className="basket-detail-container">
      <div className="breadcrumb">
        <Link to="/">Главная</Link>
        <span> / </span>
        <Link to="/basket">Корзина</Link>
        <span> / </span>
        <span>{item.title}</span>
      </div>

      <div className="basket-detail-content">
        <div className="detail-image-section">
          <div className="detail-image">
            <span className="detail-movie-icon">🎬</span>
          </div>
        </div>

        <div className="detail-info-section">
          <h1 className="detail-title">{item.title}</h1>
          <div className="detail-meta">
            <span className="meta-item">📅 {item.year}</span>
            <span className="meta-item">🎭 {item.genre}</span>
            <span className="meta-item">🎬 {item.director}</span>
          </div>

          <div className="detail-description">
            <h3>Описание:</h3>
            <p>{item.description}</p>
          </div>

          <div className="detail-price-section">
            <div className="price-info">
              <span className="price-label">Цена за единицу:</span>
              <span className="price-amount">${item.price}</span>
            </div>

            <div className="quantity-control">
              <label>Количество:</label>
              <div className="quantity-buttons">
                <button 
                  className="qty-btn-large"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                  min="1"
                  className="qty-input-large"
                />
                <button 
                  className="qty-btn-large"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="total-price">
              <span className="total-label">Итого:</span>
              <span className="total-amount">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          </div>

          <div className="detail-actions">
            <Link to="/basket" className="btn btn-primary">
              ← Вернуться к корзине
            </Link>
            <Link to="/create-order" className="btn btn-success">
              Оформить заказ
            </Link>
            <button 
              className="btn btn-danger"
              onClick={handleRemove}
            >
              🗑️ Удалить из корзины
            </button>
          </div>
        </div>
      </div>

      <div className="related-section">
        <h3>Также в вашей корзине</h3>
        <div className="related-items">
          {basket
            .filter(basketItem => basketItem.id !== item.id)
            .slice(0, 3)
            .map(relatedItem => (
              <Link 
                key={relatedItem.id}
                to={`/basket/${relatedItem.id}`}
                className="related-item"
              >
                <div className="related-icon">🎬</div>
                <div className="related-info">
                  <h4>{relatedItem.title}</h4>
                  <p>${relatedItem.price} × {relatedItem.quantity}</p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

export default BasketDetail;