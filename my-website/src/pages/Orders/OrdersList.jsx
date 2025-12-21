import React from 'react';
import { Link } from 'react-router-dom';
import { useBasket } from '../../contexts/BasketContext';
import '../../styles/Basket.css';


function OrdersList() {
  const { orders } = useBasket();

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'В обработке', class: 'status-pending', icon: '⏳' },
      confirmed: { text: 'Подтвержден', class: 'status-confirmed', icon: '✅' },
      shipping: { text: 'Доставляется', class: 'status-shipping', icon: '🚚' },
      delivered: { text: 'Доставлен', class: 'status-delivered', icon: '📦' },
      cancelled: { text: 'Отменен', class: 'status-cancelled', icon: '❌' },
    };
    return badges[status] || badges.pending;
  };

  const getTotalPrice = (order) => {
    const itemsTotal = order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryCost = order.deliveryMethod === 'express' ? 9.99 : 0;
    return itemsTotal + deliveryCost;
  };

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <div className="empty-icon">📦</div>
        <h2>У вас пока нет заказов</h2>
        <p>Оформите ваш первый заказ, чтобы увидеть его здесь</p>
        <Link to="/" className="btn btn-primary">
          К каталогу фильмов
        </Link>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2>Мои заказы</h2>
        <p className="orders-count">Всего заказов: {orders.length}</p>
      </div>

      <div className="orders-list">
        {orders.map(order => {
          const badge = getStatusBadge(order.status);
          return (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div className="order-info">
                  <h3>Заказ #{order.id}</h3>
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleString('ru-RU')}
                  </p>
                </div>
                <span className={`status-badge ${badge.class}`}>
                  {badge.icon} {badge.text}
                </span>
              </div>

              <div className="order-card-body">
                <div className="order-items-preview">
                  <h4>Товары ({order.items.length}):</h4>
                  <div className="items-list">
                    {order.items.slice(0, 3).map(item => (
                      <div key={item.id} className="item-preview">
                        <span className="item-icon">🎬</span>
                        <span className="item-title">{item.title}</span>
                        <span className="item-qty">× {item.quantity}</span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="item-more">
                        +{order.items.length - 3} больше
                      </div>
                    )}
                  </div>
                </div>

                <div className="order-details-preview">
                  <div className="detail-row">
                    <span className="detail-icon">👤</span>
                    <span>{order.fullName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-icon">📍</span>
                    <span>{order.city}, {order.address}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-icon">📞</span>
                    <span>{order.phone}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-icon">💳</span>
                    <span>
                      {order.paymentMethod === 'card' ? 'Банковская карта' :
                       order.paymentMethod === 'cash' ? 'Наличными' : 'Онлайн оплата'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="order-card-footer">
                <div className="order-total">
                  <span>Итого:</span>
                  <span className="total-amount">${getTotalPrice(order).toFixed(2)}</span>
                </div>
                <Link 
                  to={`/orders/${order.id}`}
                  className="btn btn-primary-small"
                >
                  Редактировать заказ
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrdersList;