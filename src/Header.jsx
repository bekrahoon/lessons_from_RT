import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from './store';
import './styles/Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const count = useSelector(state => state.counter.value);
  const { currentUser } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-text">SPIN</span>
          <span className="logo-accent">FORGE</span>
        </Link>

        <nav className="nav">
          <Link to="/" className="nav-link">Главная</Link>
          <Link to="/games" className="nav-link">Игры</Link>
          <Link to="/roulette" className="nav-link">Рулетка</Link>
          <Link to="/leaderboard" className="nav-link">Лидерборд</Link>
          <Link to="/community" className="nav-link">Сообщество</Link>
        </nav>

        <div className="header-right">
          {currentUser ? (
            <>
              <div className="balance">
                <span className="balance-label">Баланс</span>
                <span className="balance-value">
                  {currentUser.balance ?? count * 100} <span className="coin">⚡</span>
                </span>
              </div>

              <div className="user-info">
                <span className="user-avatar">{currentUser.username[0].toUpperCase()}</span>
                <span className="user-name">{currentUser.username}</span>
              </div>

              <button className="logout-btn" onClick={handleLogout}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="profile-btn">Регистрация</Link>
              <Link to="/login" className="login-btn">Войти</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;