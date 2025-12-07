import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MovieList from './MovieList';
import MovieDetail from './MovieDetail.js';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="header">
          <div className="header-content">
            <div className="logo">
              <span className="logo-icon">🎬</span>
              <h1>КиноМир</h1>
            </div>
            <nav className="nav">
              <a href="/">Главная</a>
              <a href="/">Фильмы</a>
              <a href="/">О нас</a>
            </nav>
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<MovieList />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
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
                <li><a href="/">Главная</a></li>
                <li><a href="/">Фильмы</a></li>
                <li><a href="/">Жанры</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Контакты</h4>
              <ul>
                <li>Email: Umurzhanov_a@iuca.kg</li>
                <li>Тел: +996 999 089 884</li>
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
    </Router>
  );
}

export default App;