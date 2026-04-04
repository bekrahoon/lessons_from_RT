import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

/**
 * MIDDLEWARE: Защита роутов
 * Если пользователь не авторизован — редирект на /login
 */
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useSelector(state => state.auth);
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
