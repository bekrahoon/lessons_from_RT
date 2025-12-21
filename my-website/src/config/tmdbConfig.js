// TMDB API Configuration

// ВАЖНО: Замените YOUR_API_KEY на ваш реальный ключ от TMDB
export const TMDB_API_KEY = '74d304f3a5cd3abbb8f713ac232b76ca'; // Получите на https://www.themoviedb.org/settings/api

export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// API Endpoints
export const TMDB_ENDPOINTS = {
  popular: `/movie/popular`,
  topRated: `/movie/top_rated`,
  nowPlaying: `/movie/now_playing`,
  upcoming: `/movie/upcoming`,
  search: `/search/movie`,
  movieDetails: (id) => `/movie/${id}`,
};

// Функция для построения URL
export const buildUrl = (endpoint, params = {}) => {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', TMDB_API_KEY);
  url.searchParams.append('language', 'ru-RU'); // Русский язык
  
  Object.keys(params).forEach(key => {
    url.searchParams.append(key, params[key]);
  });
  
  return url.toString();
};

// Функция для получения URL изображения
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};