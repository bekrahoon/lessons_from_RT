import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { BasketProvider, useBasket } from './BasketContext';
import { AuthProvider, useAuth } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import MovieList from './MovieList';
import MovieDetail from './MovieDetail.js';
import BasketList from './basket_list';
import BasketDetail from './basket_detail';
import CreateOrder from './create_order';
import UpdateOrder from './update_order';
import OrdersList from './OrdersList';
import Register from './Register';
import Login from './Login';
import Profile from './Profile';
import './App.css';

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
            </ul>
          </div>
          <div className="footer-section">
            <h4>Контакты</h4>
            <ul>
              <li>Email: info@kinоmir.com</li>
              <li>Тел: +996 XXX XXX XXX</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Следите за нами</h4>
            <div className="social-links">
              <a href="/" className="social-icon">📘</a>
              <a href="/" className="social-icon">📸</a>
              <a href="/" className="social-icon">🐦</a>
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