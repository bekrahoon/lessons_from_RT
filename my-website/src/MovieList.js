// my-website/src/MovieList.js
import React from 'react';
import { Link } from 'react-router-dom';

// Статические данные (можно заменить на API)
const movies = [
  { id: 1, title: 'Inception', year: 2010, description: 'A thief who steals corporate secrets through dream-sharing technology.' },
  { id: 2, title: 'The Matrix', year: 1999, description: 'A computer hacker learns about the true nature of his reality.' },
  { id: 3, title: 'Interstellar', year: 2014, description: 'A team of explorers travel through a wormhole in space.' },
];

function MovieList() {
  return (
    <div>
      <h2>Список фильмов</h2>
      <ul>
        {movies.map(movie => (
          <li key={movie.id}>
            <Link to={`/movie/${movie.id}`}>
              {movie.title} ({movie.year})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MovieList;