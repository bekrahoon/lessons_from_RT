import { useDispatch, useSelector } from 'react-redux';
import {
  toggleLike, toggleFavorite, rateItem,
  selectLikeCount, selectIsLiked,
  selectIsFavorited, selectUserRating,
  selectAvgRating, selectRatingCount,
} from '../store/index.js';
import './InteractionBar.css';

// ─── Звёздный рейтинг ─────────────────────────────────────────────
function StarRating({ todoId, userId, compact = false }) {
  const dispatch    = useDispatch();
  const userRating  = useSelector(selectUserRating(todoId, userId));
  const avgRating   = useSelector(selectAvgRating(todoId));
  const ratingCount = useSelector(selectRatingCount(todoId));

  return (
    <div className={`star-block ${compact ? 'compact' : ''}`}>
      {/* Строка звёзд для голосования */}
      <div className="stars-row">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            className={`star-btn ${n <= userRating ? 'filled' : ''}`}
            onClick={() => dispatch(rateItem({ todoId, userId, rating: n }))}
            title={`Оценить: ${n}`}
          >
            ★
          </button>
        ))}
      </div>

      {/* Средняя оценка */}
      <div className="avg-rating">
        <span className="avg-value">{avgRating > 0 ? avgRating : '—'}</span>
        {avgRating > 0 && (
          <span className="avg-count">({ratingCount} {declRating(ratingCount)})</span>
        )}
      </div>
    </div>
  );
}

function declRating(n) {
  if (n % 10 === 1 && n % 100 !== 11) return 'оценка';
  if ([2,3,4].includes(n % 10) && ![12,13,14].includes(n % 100)) return 'оценки';
  return 'оценок';
}

// ─── Главный компонент InteractionBar ─────────────────────────────
export default function InteractionBar({ todoId, compact = false }) {
  const dispatch = useDispatch();

  // useSelector — читаем данные из Redux store
  const { currentUser } = useSelector(s => s.auth);
  const userId     = currentUser?.id;

  const likeCount  = useSelector(selectLikeCount(todoId));
  const isLiked    = useSelector(selectIsLiked(todoId, userId));
  const isFavorited = useSelector(selectIsFavorited(todoId, userId));

  if (!userId) return null; // не авторизован — не показываем

  return (
    <div className={`interaction-bar ${compact ? 'compact' : ''}`}>

      {/* 1. ЛАЙК */}
      <button
        className={`ib-btn like-btn ${isLiked ? 'active' : ''}`}
        onClick={() => dispatch(toggleLike({ todoId, userId }))}
        title={isLiked ? 'Убрать лайк' : 'Поставить лайк'}
      >
        <span className="ib-icon">{isLiked ? '❤️' : '🤍'}</span>
        {!compact && <span className="ib-label">{likeCount > 0 ? likeCount : ''}</span>}
        {compact  && likeCount > 0 && <span className="ib-count">{likeCount}</span>}
      </button>

      {/* 2. ИЗБРАННОЕ */}
      <button
        className={`ib-btn fav-btn ${isFavorited ? 'active' : ''}`}
        onClick={() => dispatch(toggleFavorite({ todoId, userId }))}
        title={isFavorited ? 'Убрать из избранного' : 'В избранное'}
      >
        <span className="ib-icon">{isFavorited ? '⭐' : '☆'}</span>
        {!compact && <span className="ib-label">{isFavorited ? 'В избранном' : 'В избранное'}</span>}
      </button>

      {/* 3+4. ОЦЕНКА + СРЕДНЯЯ ОЦЕНКА */}
      {!compact && (
        <div className="ib-rating">
          <span className="ib-rating-label">Оценить:</span>
          <StarRating todoId={todoId} userId={userId} />
        </div>
      )}

      {compact && (
        <div className="ib-rating-compact">
          <StarRating todoId={todoId} userId={userId} compact />
        </div>
      )}
    </div>
  );
}
