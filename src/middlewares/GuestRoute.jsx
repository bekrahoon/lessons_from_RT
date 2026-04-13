import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// MIDDLEWARE: пускает только гостей (не авторизованных)
const GuestRoute = ({ children }) => {
  const { currentUser } = useSelector(s => s.auth);
  return currentUser ? <Navigate to="/" replace /> : children;
};

export default GuestRoute;
