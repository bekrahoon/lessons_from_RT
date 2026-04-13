import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// MIDDLEWARE: пускает только авторизованных
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useSelector(s => s.auth);
  return currentUser ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
