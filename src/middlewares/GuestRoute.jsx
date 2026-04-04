import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

/**
 * MIDDLEWARE: Страницы только для гостей
 * Если пользователь авторизован — редирект на главную
 */
const GuestRoute = ({ children }) => {
  const { currentUser } = useSelector(state => state.auth);
  if (currentUser) return <Navigate to="/" replace />;
  return children;
};

export default GuestRoute;
