import Header from './Header';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Header />

      <div style={{ paddingTop: '80px' }}>
        <Routes>
          <Route path="/" element={
            <div style={{ padding: '100px 40px', textAlign: 'center' }}>
              <h1 style={{ fontSize: '72px', marginBottom: '20px' }}>
                Добро пожаловать в <span style={{ background: 'linear-gradient(90deg, #00ff9d, #00b8ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SpinForge</span>
              </h1>
              <p style={{ fontSize: '24px', color: '#888', maxWidth: '600px', margin: '0 auto 40px' }}>
                Мультиплеерные игры. Быстрые дуэли. Реальные эмоции.
              </p>
              <button style={{
                background: 'linear-gradient(90deg, #00ff9d, #00b8ff)',
                color: '#000',
                padding: '18px 48px',
                fontSize: '18px',
                fontWeight: '700',
                borderRadius: '50px',
                border: 'none',
                cursor: 'pointer'
              }}>
                Играть сейчас
              </button>
            </div>
          } />

          {/* Заглушки для будущих страниц */}
          <Route path="/games" element={<div style={{ padding: 100, textAlign: 'center' }}><h2>Игры — скоро...</h2></div>} />
          <Route path="/roulette" element={<div style={{ padding: 100, textAlign: 'center' }}><h2>Мультиплеер рулетка — уже в разработке</h2></div>} />
          <Route path="/leaderboard" element={<div style={{ padding: 100, textAlign: 'center' }}><h2>Лидерборд</h2></div>} />
          <Route path="/community" element={<div style={{ padding: 100, textAlign: 'center' }}><h2>Сообщество</h2></div>} />
          <Route path="/profile" element={<div style={{ padding: 100, textAlign: 'center' }}><h2>Профиль пользователя</h2></div>} />
        </Routes>
      </div>
    </>
  );
}

export default App;