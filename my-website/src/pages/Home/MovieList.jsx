import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBasket } from '../../contexts/BasketContext';
import { buildUrl, TMDB_ENDPOINTS, getImageUrl } from '../../config/tmdbConfig';

function MovieList() {
  const { addToBasket } = useBasket();
  const [addedMovies, setAddedMovies] = useState({});
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка фильмов при монтировании компонента
  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);

      // Получаем популярные фильмы
      const url = buildUrl(TMDB_ENDPOINTS.popular, { page: 1 });
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Преобразуем данные TMDB в нужный формат
      const formattedMovies = data.results.slice(0, 12).map(movie => ({
        id: movie.id,
        title: movie.title,
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A',
        description: movie.overview,
        director: 'Unknown', // TMDB не возвращает режиссера в списке, нужен отдельный запрос
        genre: movie.genre_ids[0] || 'Unknown', // Упрощенно берем первый жанр
        price: (Math.random() * 5 + 7).toFixed(2), // Генерируем случайную цену
        image: getImageUrl(movie.poster_path),
        backdrop: getImageUrl(movie.backdrop_path),
        rating: movie.vote_average,
        popularity: movie.popularity
      }));

      setMovies(formattedMovies);
    } catch (err) {
      console.error('Ошибка загрузки фильмов:', err);
      setError('Не удалось загрузить фильмы. Проверьте подключение к интернету.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToBasket = (movie, e) => {
    e.preventDefault();
    addToBasket(movie);
    
    // Показать анимацию
    setAddedMovies(prev => ({ ...prev, [movie.id]: true }));
    setTimeout(() => {
      setAddedMovies(prev => ({ ...prev, [movie.id]: false }));
    }, 2000);
  };

  // Загрузка
  if (loading) {
    return (
      <div className="movie-list-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка фильмов...</p>
        </div>
      </div>
    );
  }

  // Ошибка
  if (error) {
    return (
      <div className="movie-list-container">
        <div className="error-container">
          <h2>❌ Ошибка</h2>
          <p>{error}</p>
          <button onClick={fetchMovies} className="retry-btn">
            🔄 Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-list-container">
      <div className="catalog-header">
        <h2>Каталог фильмов</h2>
        <p className="catalog-subtitle">Выберите фильм для покупки</p>
        <div className="catalog-stats">
          <span>📊 {movies.length} фильмов доступно</span>
        </div>
      </div>
      
      <ul className="movie-grid">
        {movies.map(movie => (
          <li key={movie.id} className="movie-card">
            <Link to={`/movie/${movie.id}`} className="movie-card-link">
              <div className="movie-poster">
                {movie.image ? (
                  <img 
                    src={movie.image} 
                    alt={movie.title}
                    className="poster-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="poster-fallback" style={{ display: movie.image ? 'none' : 'flex' }}>
                  <span className="poster-icon">🎬</span>
                </div>
                <div className="movie-overlay">
                  <span className="view-details">Подробнее</span>
                </div>
                {movie.rating && (
                  <div className="movie-rating">
                    ⭐ {movie.rating.toFixed(1)}
                  </div>
                )}
              </div>
              <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-year">{movie.year}</p>
                <div className="movie-meta">
                  <span className="movie-genre">🎭 Фильм</span>
                </div>
                <div className="movie-price">
                  <span className="price-tag">${movie.price}</span>
                </div>
              </div>
            </Link>
            <button 
              className={`add-to-basket-btn ${addedMovies[movie.id] ? 'added' : ''}`}
              onClick={(e) => handleAddToBasket(movie, e)}
            >
              {addedMovies[movie.id] ? '✓ Добавлено' : '🛒 В корзину'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MovieList;