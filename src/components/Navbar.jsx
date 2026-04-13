import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '../store/index.js';
import './Navbar.css';

export default function Navbar() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { pathname } = useLocation();
  const { currentUser } = useSelector(s => s.auth);

  const logout = () => { dispatch(logoutUser()); navigate('/login'); };

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-logo">
          Task<span>Flow</span>
        </Link>

        <div className="navbar-right">
          {currentUser ? (
            <>
              <Link to="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
                Задачи
              </Link>
              <div className="nav-user">
                <span className="nav-avatar">{currentUser.avatar}</span>
                <span className="nav-username">{currentUser.username}</span>
              </div>
              <button className="nav-logout" onClick={logout}>Выйти</button>
            </>
          ) : (
            <>
              <Link to="/login"    className={`nav-link ${pathname === '/login'    ? 'active' : ''}`}>Войти</Link>
              <Link to="/register" className="nav-register">Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
