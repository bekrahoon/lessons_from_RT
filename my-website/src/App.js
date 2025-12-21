import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { BasketProvider, useBasket } from './contexts/BasketContext.js';
import { AuthProvider, useAuth } from './contexts/AuthContext.js';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import MovieList from './pages/Home/MovieList.jsx';
import MovieDetail from './pages/Home/MovieDetail.jsx';
import BasketList from './pages/Basket/basket_list.jsx';
import BasketDetail from './pages/Basket/basket_detail.jsx';
import CreateOrder from './pages/Orders/create_order.jsx';
import UpdateOrder from './pages/Orders/update_order.jsx';
import OrdersList from './pages/Orders/OrdersList.jsx';
import Register from './pages/Auth/Register.jsx';
import Login from './pages/Auth/Login.jsx';
import Profile from './pages/Auth/Profile.jsx';
import About from './pages/About/About.jsx';
import Contact from './pages/Contact/Contact.jsx';
import './styles/App.css';

function BasketIcon() {
  const { getTotalItems } = useBasket();
  const itemCount = getTotalItems();

  return (
    <Link to="/basket" className="basket-icon-link">
      <div className="basket-icon">
        🛒
        {itemCount > 0 && (
          <span className="basket-badge">{itemCount}</span>
        )}
      </div>
    </Link>
  );
}

function UserMenu() {
  const { currentUser, logout } = useAuth();

  if (!currentUser) {
    return (
      <div className="auth-buttons">
        <Link to="/login" className="auth-btn login-btn">Войти</Link>
        <Link to="/register" className="auth-btn register-btn">Регистрация</Link>
      </div>
    );
  }

  return (
    <div className="user-menu">
      <Link to="/profile" className="user-profile-link">
        <img 
          src={currentUser.avatar} 
          alt={currentUser.firstName}
          className="user-avatar-small"
        />
        <span className="user-name">{currentUser.firstName}</span>
      </Link>
      <button 
        className="logout-btn-small"
        onClick={() => {
          logout();
          window.location.href = '/';
        }}
        title="Выйти"
      >
        🚪
      </button>
    </div>
  );
}

function AppContent() {
  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">🎬</span>
            <h1>КиноМир</h1>
          </Link>
          <nav className="nav">
            <Link to="/">Главная</Link>
            <Link to="/basket">Корзина</Link>
            <Link to="/orders">Заказы</Link>
            <Link to="/about">О нас</Link>
            <Link to="/contacts">Контакты</Link>
          </nav>
          <div className="header-actions">
            <BasketIcon />
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contacts" element={<Contact />} />
          
          {/* Защищенные маршруты */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/basket" element={
            <ProtectedRoute>
              <BasketList />
            </ProtectedRoute>
          } />
          <Route path="/basket/:id" element={
            <ProtectedRoute>
              <BasketDetail />
            </ProtectedRoute>
          } />
          <Route path="/create-order" element={
            <ProtectedRoute>
              <CreateOrder />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <OrdersList />
            </ProtectedRoute>
          } />
          <Route path="/orders/:id" element={
            <ProtectedRoute>
              <UpdateOrder />
            </ProtectedRoute>
          } />
        </Routes>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>КиноМир</h3>
            <p>Ваш гид в мире кино</p>
          </div>
          <div className="footer-section">
            <h4>Навигация</h4>
            <ul>
              <li><Link to="/">Главная</Link></li>
              <li><Link to="/basket">Корзина</Link></li>
              <li><Link to="/orders">Заказы</Link></li>
              <li><Link to="/about">О нас</Link></li>
              <li><Link to="/contacts">Контакты</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Контакты</h4>
            <ul>
              <li>Email: info@kinоmir.com</li>
              <li>Тел: +996 999 089 884</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Следите за нами</h4>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon" title="Facebook">📘</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" title="Instagram">📸</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon" title="Twitter">🐦</a>
              <a href="https://t.me/movieshop" target="_blank" rel="noopener noreferrer" className="social-icon" title="Telegram">✈️</a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon" title="YouTube">📺</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 КиноМир. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <BasketProvider>
          <AppContent />
        </BasketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;