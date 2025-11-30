import React from 'react';
import { useParams, Link } from 'react-router-dom';

// Те же статические данные
const movies = [
  { id: 1, title: 'Inception', year: 2010, description: 'A thief who steals corporate secrets through dream-sharing technology.', director: 'Christopher Nolan', genre: 'Sci-Fi' },
  { id: 2, title: 'The Matrix', year: 1999, description: 'A computer hacker learns about the true nature of his reality.', director: 'Wachowski Sisters', genre: 'Action' },
  { id: 3, title: 'Interstellar', year: 2014, description: 'A team of explorers travel through a wormhole in space.', director: 'Christopher Nolan', genre: 'Adventure' },
];

function MovieDetail() {
  const { id } = useParams();
  const movie = movies.find(m => m.id === parseInt(id));

  if (!movie) {
    return <div>Фильм не найден!</div>;
  }

  return (
    <div>
      <h2>{movie.title} ({movie.year})</h2>
      <p><strong>Описание:</strong> {movie.description}</p>
      <p><strong>Режиссёр:</strong> {movie.director}</p>
      <p><strong>Жанр:</strong> {movie.genre}</p>
      <Link to="/">Назад к списку</Link>
    </div>
  );
}

export default MovieDetail;