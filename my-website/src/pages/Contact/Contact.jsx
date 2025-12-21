import React, { useState } from 'react';
import '../../styles/Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Очистить ошибку при изменении
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Введите ваше имя';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Введите тему сообщения';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Введите сообщение';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Сообщение должно содержать минимум 10 символов';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Симуляция отправки
    console.log('Form submitted:', formData);
    
    setSubmitted(true);
    
    // Очистить форму
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });

    // Скрыть уведомление через 5 секунд
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        {/* Hero Section */}
        <section className="contact-hero">
          <h1 className="contact-title">Свяжитесь с нами</h1>
          <p className="contact-subtitle">
            Мы всегда готовы ответить на ваши вопросы и помочь
          </p>
        </section>

        {/* Success Notification */}
        {submitted && (
          <div className="success-notification">
            <span className="success-icon">✓</span>
            <span>Спасибо! Ваше сообщение успешно отправлено</span>
          </div>
        )}

        <div className="contact-content">
          {/* Contact Info */}
          <section className="contact-info-section">
            <h2>Наши контакты</h2>
            
            <div className="contact-cards">
              <div className="contact-card">
                <div className="contact-icon">📧</div>
                <h3>Email</h3>
                <a href="mailto:info@movieshop.com">info@movieshop.com</a>
                <a href="mailto:support@movieshop.com">support@movieshop.com</a>
              </div>

              <div className="contact-card">
                <div className="contact-icon">📱</div>
                <h3>Телефон</h3>
                <a href="tel:+996555123456">+996 (555) 123-456</a>
                <a href="tel:+996777987654">+996 (777) 987-654</a>
              </div>

              <div className="contact-card">
                <div className="contact-icon">📍</div>
                <h3>Адрес</h3>
                <p>г. Бишкек, ул. Чуй 123</p>
                <p>Офис 456, 4 этаж</p>
              </div>

              <div className="contact-card">
                <div className="contact-icon">🕐</div>
                <h3>Часы работы</h3>
                <p>Пн-Пт: 9:00 - 18:00</p>
                <p>Сб-Вс: 10:00 - 16:00</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="social-media-section">
              <h3>Мы в соцсетях</h3>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link facebook">
                  <span className="social-icon">📘</span>
                  <span>Facebook</span>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link instagram">
                  <span className="social-icon">📷</span>
                  <span>Instagram</span>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link twitter">
                  <span className="social-icon">🐦</span>
                  <span>Twitter</span>
                </a>
                <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="social-link telegram">
                  <span className="social-icon">✈️</span>
                  <span>Telegram</span>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link youtube">
                  <span className="social-icon">📺</span>
                  <span>YouTube</span>
                </a>
                <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="social-link whatsapp">
                  <span className="social-icon">💬</span>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </section>

          {/* Contact Form */}
          <section className="contact-form-section">
            <h2>Форма обратной связи</h2>
            <p className="form-description">
              Есть вопрос или предложение? Напишите нам, и мы обязательно ответим!
            </p>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">
                  Ваше имя <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Введите ваше имя"
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="subject">
                  Тема сообщения <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="О чем ваше сообщение?"
                  className={errors.subject ? 'error' : ''}
                />
                {errors.subject && <span className="error-message">{errors.subject}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="message">
                  Сообщение <span className="required">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Напишите ваше сообщение..."
                  rows="6"
                  className={errors.message ? 'error' : ''}
                />
                {errors.message && <span className="error-message">{errors.message}</span>}
              </div>

              <button type="submit" className="submit-btn">
                <span>Отправить сообщение</span>
                <span className="btn-icon">📤</span>
              </button>
            </form>
          </section>
        </div>

        {/* FAQ Section */}
        <section className="faq-section">
          <h2>Часто задаваемые вопросы</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>❓ Как купить фильм?</h3>
              <p>
                Выберите фильм из каталога, нажмите "Добавить в корзину", затем перейдите в корзину 
                и оформите заказ.
              </p>
            </div>

            <div className="faq-item">
              <h3>💳 Какие способы оплаты?</h3>
              <p>
                Мы принимаем банковские карты (Visa, MasterCard), электронные кошельки и 
                банковские переводы.
              </p>
            </div>

            <div className="faq-item">
              <h3>📦 Как получить фильм?</h3>
              <p>
                После оплаты вы получите ссылку на скачивание или доступ к онлайн-просмотру 
                на ваш email.
              </p>
            </div>

            <div className="faq-item">
              <h3>🔄 Можно ли вернуть деньги?</h3>
              <p>
                Да, мы предоставляем возврат средств в течение 14 дней при наличии 
                обоснованной причины.
              </p>
            </div>

            <div className="faq-item">
              <h3>🎬 Какое качество фильмов?</h3>
              <p>
                Все фильмы доступны в качестве HD (720p) и Full HD (1080p). Некоторые также 
                в 4K.
              </p>
            </div>

            <div className="faq-item">
              <h3>🌍 Есть ли субтитры?</h3>
              <p>
                Да, большинство фильмов имеют субтитры на русском, английском и других языках.
              </p>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="support-section">
          <div className="support-content">
            <div className="support-icon">💬</div>
            <h2>Нужна помощь?</h2>
            <p>
              Наша служба поддержки работает 24/7 и всегда готова помочь вам с любыми вопросами
            </p>
            <div className="support-buttons">
              <a href="mailto:support@movieshop.com" className="support-btn email">
                <span>📧</span> Написать на email
              </a>
              <a href="tel:+996555123456" className="support-btn phone">
                <span>📞</span> Позвонить
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Contact;