import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { BasketProvider, useBasket } from './BasketContext';
import MovieList from './MovieList';
import MovieDetail from './MovieDetail.js';
import BasketList from './basket_list';
import BasketDetail from './basket_detail';
import CreateOrder from './create_order';
import UpdateOrder from './update_order';
import OrdersList from './OrdersList';
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
          <BasketIcon />
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/basket" element={<BasketList />} />
          <Route path="/basket/:id" element={<BasketDetail />} />
          <Route path="/create-order" element={<CreateOrder />} />
          <Route path="/orders" element={<OrdersList />} />
          <Route path="/orders/:id" element={<UpdateOrder />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>КиноМир</h3>
            <p>Ваш гид в мире кино</p>
            <p>Работу выполнил Умуржанов Аба Бекрахун</p>
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
              <li>Email: KinoMir@planet.com</li>
              <li>Тел: +996 999 889 887</li>
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
          <p>&copy; 2025 КиноМир. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <BasketProvider>
        <AppContent />
      </BasketProvider>
    </Router>
  );
}

export default App;