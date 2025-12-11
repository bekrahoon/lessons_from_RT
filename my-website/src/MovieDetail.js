import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBasket } from './BasketContext';
import { movies } from './MovieList';

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToBasket } = useBasket();
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  
  const movie = movies.find(m => m.id === parseInt(id));

  if (!movie) {
    return (
      <div className="movie-detail">
        <h2>Фильм не найден!</h2>
        <Link to="/" className="back-link">← Назад к списку</Link>
      </div>
    );
  }

  const handleAddToBasket = () => {
    addToBasket(movie, quantity);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleBuyNow = () => {
    addToBasket(movie, quantity);
    navigate('/basket');
  };

  return (
    <div className="movie-detail-page">
      {showNotification && (
        <div className="notification success">
          ✓ Товар добавлен в корзину!
        </div>
      )}

      <div className="breadcrumb">
        <Link to="/">Главная</Link>
        <span> / </span>
        <span>{movie.title}</span>
      </div>

      <div className="movie-detail">
        <div className="movie-detail-image">
          <div className="detail-poster">
            <span className="detail-poster-icon">🎬</span>
          </div>
        </div>

        <div className="movie-detail-info">
          <h2>{movie.title} ({movie.year})</h2>
          
          <div className="detail-meta-tags">
            <span className="meta-tag">🎭 {movie.genre}</span>
            <span className="meta-tag">📅 {movie.year}</span>
            <span className="meta-tag">⭐ 4.5/5</span>
          </div>

          <div className="detail-section">
            <h3>Описание:</h3>
            <p>{movie.description}</p>
          </div>

          <div className="detail-section">
            <h3>Информация о фильме:</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Режиссёр:</span>
                <span className="info-value">{movie.director}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Жанр:</span>
                <span className="info-value">{movie.genre}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Год выпуска:</span>
                <span className="info-value">{movie.year}</span>
              </div>
            </div>
          </div>

          <div className="purchase-section">
            <div className="price-block">
              <span className="price-label">Цена:</span>
              <span className="price-value">${movie.price}</span>
            </div>

            <div className="quantity-selector">
              <label>Количество:</label>
              <div className="quantity-controls">
                <button 
                  className="qty-control-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="qty-control-input"
                />
                <button 
                  className="qty-control-btn"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="total-price-block">
              <span>Итого:</span>
              <span className="total-price">${(movie.price * quantity).toFixed(2)}</span>
            </div>

            <div className="action-buttons">
              <button 
                className="btn btn-add-basket"
                onClick={handleAddToBasket}
              >
                🛒 Добавить в корзину
              </button>
              <button 
                className="btn btn-buy-now"
                onClick={handleBuyNow}
              >
                ⚡ Купить сейчас
              </button>
            </div>
          </div>

          <Link to="/" className="back-link-detail">← Назад к каталогу</Link>
        </div>
      </div>

      <div className="related-movies-section">
        <h3>Рекомендуем также:</h3>
        <div className="related-movies-grid">
          {movies
            .filter(m => m.id !== movie.id && m.genre === movie.genre)
            .slice(0, 3)
            .map(relatedMovie => (
              <Link 
                key={relatedMovie.id}
                to={`/movie/${relatedMovie.id}`}
                className="related-movie-card"
              >
                <div className="related-movie-poster">
                  <span className="related-poster-icon">🎬</span>
                </div>
                <div className="related-movie-info">
                  <h4>{relatedMovie.title}</h4>
                  <p>{relatedMovie.year}</p>
                  <span className="related-price">${relatedMovie.price}</span>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;