import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBasket } from './BasketContext';

// Статические данные (можно заменить на API)
const movies = [
  { id: 1, title: 'Inception', year: 2010, description: 'A thief who steals corporate secrets through dream-sharing technology.', director: 'Christopher Nolan', genre: 'Sci-Fi', price: 9.99 },
  { id: 2, title: 'The Matrix', year: 1999, description: 'A computer hacker learns about the true nature of his reality.', director: 'Wachowski Sisters', genre: 'Action', price: 8.99 },
  { id: 3, title: 'Interstellar', year: 2014, description: 'A team of explorers travel through a wormhole in space.', director: 'Christopher Nolan', genre: 'Adventure', price: 10.99 },
  { id: 4, title: 'The Dark Knight', year: 2008, description: 'Batman faces the Joker in a battle for Gotham\'s soul.', director: 'Christopher Nolan', genre: 'Action', price: 9.49 },
  { id: 5, title: 'Pulp Fiction', year: 1994, description: 'Various interconnected stories of crime in Los Angeles.', director: 'Quentin Tarantino', genre: 'Crime', price: 7.99 },
  { id: 6, title: 'The Shawshank Redemption', year: 1994, description: 'Two imprisoned men bond over years, finding redemption.', director: 'Frank Darabont', genre: 'Drama', price: 8.49 },
];

function MovieList() {
  const { addToBasket } = useBasket();
  const [addedMovies, setAddedMovies] = useState({});

  const handleAddToBasket = (movie, e) => {
    e.preventDefault();
    addToBasket(movie);
    
    // Показать анимацию
    setAddedMovies(prev => ({ ...prev, [movie.id]: true }));
    setTimeout(() => {
      setAddedMovies(prev => ({ ...prev, [movie.id]: false }));
    }, 2000);
  };

  return (
    <div className="movie-list-container">
      <h2>Каталог фильмов</h2>
      <p className="catalog-subtitle">Выберите фильм для покупки</p>
      
      <ul className="movie-grid">
        {movies.map(movie => (
          <li key={movie.id} className="movie-card">
            <Link to={`/movie/${movie.id}`} className="movie-card-link">
              <div className="movie-poster">
                <span className="poster-icon">🎬</span>
                <div className="movie-overlay">
                  <span className="view-details">Подробнее</span>
                </div>
              </div>
              <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-year">{movie.year}</p>
                <div className="movie-meta">
                  <span className="movie-genre">🎭 {movie.genre}</span>
                  <span className="movie-director">🎬 {movie.director}</span>
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
export { movies };