import React from 'react';
import '../../styles/About.css';

function About() {
  return (
    <div className="about-page">
      <div className="about-container">
        {/* Hero Section */}
        <section className="about-hero">
          <h1>О нашем проекте</h1>
          <p className="about-subtitle">
            КиноМир - это современная платформа для покупки и просмотра фильмов онлайн
          </p>
        </section>

        {/* Main Content */}
        <section className="about-content">
          <div className="about-grid">
            {/* О проекте */}
            <div className="about-card">
              <div className="card-icon">🎬</div>
              <h2>Наша миссия</h2>
              <p>
                Мы создали КиноМир, чтобы предоставить пользователям удобный доступ к лучшим фильмам. 
                Наша платформа объединяет любителей кино со всего мира и предлагает широкий выбор 
                контента на любой вкус.
              </p>
            </div>

            {/* Технологии */}
            <div className="about-card">
              <div className="card-icon">⚛️</div>
              <h2>Технологии</h2>
              <p>
                Проект разработан с использованием современных веб-технологий: React для создания 
                интерактивного интерфейса, React Router для навигации, и LocalStorage для хранения 
                данных. Дизайн адаптирован для всех устройств.
              </p>
            </div>

            {/* Команда */}
            <div className="about-card">
              <div className="card-icon">👥</div>
              <h2>Наша команда</h2>
              <p>
                Над проектом работала команда энтузиастов, которые любят кино и технологии. 
                Мы постоянно улучшаем платформу, добавляем новые функции и следим за качеством 
                сервиса.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2>Что мы предлагаем</h2>
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">🎯</span>
              <h3>Широкий выбор</h3>
              <p>Каталог лучших фильмов разных жанров и эпох</p>
            </div>

            <div className="feature-item">
              <span className="feature-icon">💳</span>
              <h3>Удобная покупка</h3>
              <p>Простой процесс оформления заказа в несколько кликов</p>
            </div>

            <div className="feature-item">
              <span className="feature-icon">📱</span>
              <h3>Адаптивность</h3>
              <p>Работает на всех устройствах - от смартфона до компьютера</p>
            </div>

            <div className="feature-item">
              <span className="feature-icon">🔐</span>
              <h3>Безопасность</h3>
              <p>Ваши данные защищены и хранятся конфиденциально</p>
            </div>

            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <h3>Быстрая загрузка</h3>
              <p>Оптимизированная производительность для лучшего опыта</p>
            </div>

            <div className="feature-item">
              <span className="feature-icon">🎨</span>
              <h3>Современный дизайн</h3>
              <p>Красивый и интуитивно понятный интерфейс</p>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="stats-section">
          <h2>КиноМир в цифрах</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Фильмов в каталоге</div>
            </div>

            <div className="stat-card">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Довольных пользователей</div>
            </div>

            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Доступ к контенту</div>
            </div>

            <div className="stat-card">
              <div className="stat-number">100%</div>
              <div className="stat-label">Качество HD</div>
            </div>
          </div>
        </section>

        {/* History Section */}
        <section className="history-section">
          <h2>Наша история</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-year">2023</div>
              <div className="timeline-content">
                <h3>Начало пути</h3>
                <p>Запуск проекта КиноМир. Первая версия с базовым функционалом.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-year">2024</div>
              <div className="timeline-content">
                <h3>Развитие</h3>
                <p>Добавлены новые функции: корзина, личный кабинет, система заказов.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-year">2025</div>
              <div className="timeline-content">
                <h3>Расширение</h3>
                <p>Интеграция с TMDB API, добавление постеров фильмов, улучшенный дизайн.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <h2>Наши ценности</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>🎯 Качество</h3>
              <p>Мы предлагаем только лучший контент и сервис высочайшего уровня</p>
            </div>

            <div className="value-card">
              <h3>💡 Инновации</h3>
              <p>Постоянно внедряем новые технологии для улучшения пользовательского опыта</p>
            </div>

            <div className="value-card">
              <h3>🤝 Честность</h3>
              <p>Прозрачные цены, никаких скрытых платежей и подписок</p>
            </div>

            <div className="value-card">
              <h3>❤️ Клиентоориентированность</h3>
              <p>Слушаем наших пользователей и работаем над их пожеланиями</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2>Присоединяйтесь к КиноМиру!</h2>
          <p>Начните свое кинопутешествие уже сегодня</p>
          <div className="cta-buttons">
            <a href="/register" className="cta-btn primary">Зарегистрироваться</a>
            <a href="/" className="cta-btn secondary">Смотреть каталог</a>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;