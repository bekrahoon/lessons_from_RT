import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBasket } from '../../contexts/BasketContext';
import { buildUrl, TMDB_ENDPOINTS, getImageUrl } from '../../config/tmdbConfig';

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToBasket } = useBasket();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState('');

  // Загрузка деталей фильма
  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Получаем детали фильма
      const url = buildUrl(TMDB_ENDPOINTS.movieDetails(id), {
        append_to_response: 'credits,videos' // Дополнительная информация
      });
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Получаем режиссера из credits
      const director = data.credits?.crew?.find(person => person.job === 'Director');

      // Форматируем данные
      const formattedMovie = {
        id: data.id,
        title: data.title,
        year: data.release_date ? new Date(data.release_date).getFullYear() : 'N/A',
        description: data.overview,
        director: director ? director.name : 'Unknown',
        genre: data.genres?.map(g => g.name).join(', ') || 'Unknown',
        price: (Math.random() * 5 + 7).toFixed(2),
        image: getImageUrl(data.poster_path),
        backdrop: getImageUrl(data.backdrop_path, 'original'),
        rating: data.vote_average,
        voteCount: data.vote_count,
        runtime: data.runtime,
        releaseDate: data.release_date,
        tagline: data.tagline,
        budget: data.budget,
        revenue: data.revenue,
        cast: data.credits?.cast?.slice(0, 5).map(actor => actor.name) || []
      };

      setMovie(formattedMovie);
    } catch (err) {
      console.error('Ошибка загрузки фильма:', err);
      setError('Не удалось загрузить информацию о фильме.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToBasket = () => {
    addToBasket(movie, quantity);
    setNotification('Фильм добавлен в корзину!');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleBuyNow = () => {
    addToBasket(movie, quantity);
    navigate('/basket');
  };

  // Загрузка
  if (loading) {
    return (
      <div className="movie-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка информации о фильме...</p>
        </div>
      </div>
    );
  }

  // Ошибка
  if (error || !movie) {
    return (
      <div className="movie-detail-page">
        <div className="error-container">
          <h2>❌ Ошибка</h2>
          <p>{error || 'Фильм не найден'}</p>
          <Link to="/" className="back-link-detail">← Вернуться к каталогу</Link>
        </div>
      </div>
    );
  }

  const totalPrice = (movie.price * quantity).toFixed(2);

  return (
    <div className="movie-detail-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Главная</Link> / {movie.title}
      </div>

      {/* Notification */}
      {notification && (
        <div className="notification success">
          {notification}
        </div>
      )}

      {/* Movie Detail */}
      <div className="movie-detail">
        {/* Poster */}
        <div className="movie-detail-image">
          <div className="detail-poster">
            {movie.image ? (
              <img 
                src={movie.image} 
                alt={movie.title}
                className="detail-poster-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="detail-poster-fallback" style={{ display: movie.image ? 'none' : 'flex' }}>
              <span className="detail-poster-icon">🎬</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="movie-detail-info">
          <h2>{movie.title}</h2>
          
          {movie.tagline && (
            <p className="movie-tagline">"{movie.tagline}"</p>
          )}

          {/* Meta tags */}
          <div className="detail-meta-tags">
            <span className="meta-tag">{movie.year}</span>
            {movie.runtime && <span className="meta-tag">{movie.runtime} мин</span>}
            {movie.rating && <span className="meta-tag">⭐ {movie.rating.toFixed(1)}/10</span>}
          </div>

          {/* Description */}
          <div className="detail-section">
            <h3>Описание</h3>
            <p>{movie.description || 'Описание недоступно'}</p>
          </div>

          {/* Info Grid */}
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Режиссер</span>
              <span className="info-value">{movie.director}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Жанр</span>
              <span className="info-value">{movie.genre}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Дата выхода</span>
              <span className="info-value">{movie.releaseDate || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Рейтинг</span>
              <span className="info-value">⭐ {movie.rating?.toFixed(1)} ({movie.voteCount} голосов)</span>
            </div>
          </div>

          {/* Cast */}
          {movie.cast && movie.cast.length > 0 && (
            <div className="detail-section">
              <h3>В ролях</h3>
              <p>{movie.cast.join(', ')}</p>
            </div>
          )}

          {/* Purchase Section */}
          <div className="purchase-section">
            <div className="price-block">
              <span className="price-label">Цена:</span>
              <span className="price-value">${movie.price}</span>
            </div>

            {/* Quantity Selector */}
            <div className="quantity-selector">
              <label>Количество:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => handleQuantityChange(-1)} 
                  className="qty-control-btn"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val >= 1 && val <= 99) setQuantity(val);
                  }}
                  className="qty-control-input"
                  min="1"
                  max="99"
                />
                <button 
                  onClick={() => handleQuantityChange(1)} 
                  className="qty-control-btn"
                  disabled={quantity >= 99}
                >
                  +
                </button>
              </div>
            </div>

            {/* Total Price */}
            <div className="total-price-block">
              <span>Итого:</span>
              <span className="total-price">${totalPrice}</span>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button onClick={handleAddToBasket} className="btn btn-add-basket">
                🛒 В корзину
              </button>
              <button onClick={handleBuyNow} className="btn btn-buy-now">
                ⚡ Купить сейчас
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Back Link */}
      <Link to="/" className="back-link-detail">
        ← Вернуться к каталогу
      </Link>
    </div>
  );
}

export default MovieDetail;