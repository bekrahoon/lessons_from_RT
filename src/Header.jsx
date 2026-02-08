import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './styles/Header.css';

const Header = () => {
  const count = useSelector(state => state.counter.value); // можно потом заменить на реальный баланс

  return (
    <header className="header">
      <div className="header-container">
        {/* Логотип */}
        <Link to="/" className="logo">
          <span className="logo-text">SPIN</span>
          <span className="logo-accent">FORGE</span>
        </Link>

        {/* Навигация */}
        <nav className="nav">
          <Link to="/" className="nav-link">Главная</Link>
          <Link to="/games" className="nav-link">Игры</Link>
          <Link to="/roulette" className="nav-link">Рулетка</Link>
          <Link to="/leaderboard" className="nav-link">Лидерборд</Link>
          <Link to="/community" className="nav-link">Сообщество</Link>
        </nav>

        {/* Правая часть */}
        <div className="header-right">
          <div className="balance">
            <span className="balance-label">Баланс</span>
            <span className="balance-value">{count * 100} <span className="coin">⚡</span></span>
          </div>

          <Link to="/profile" className="profile-btn">
            Профиль
          </Link>

          <button className="login-btn">
            Войти
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;