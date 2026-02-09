// src/App.jsx (обновлённый с несколькими контентами и LIST/DETAIL)
import { Routes, Route } from 'react-router-dom';
import Header from './Header';
import PostList from './PostList';
import UserList from './UserList';
import TodoList from './TodoList';
import PostDetail from './PostDetail';

function App() {
  return (
    <>
      <Header />

      <div style={{ paddingTop: '80px' }}>
        <Routes>
          <Route path="/" element={
            <div className="container">
              {/* Контент 1: LIST постов с DETAIL */}
              <section className="section">
                <h2 className="section-title">Последние посты (LIST/DETAIL)</h2>
                <PostList />
              </section>

              {/* Контент 2: Список пользователей */}
              <section className="section">
                <h2 className="section-title">Топ пользователей</h2>
                <UserList />
              </section>

              {/* Контент 3: Список задач */}
              <section className="section">
                <h2 className="section-title">Активные задачи</h2>
                <TodoList />
              </section>
            </div>
          } />

          <Route path="/post/:id" element={
            <div className="container" style={{ padding: '100px 40px' }}>
              <PostDetail />
            </div>
          } />

          {/* Заглушки для других страниц */}
          <Route path="/games" element={<div className="container" style={{ padding: 100, textAlign: 'center' }}><h2>Игры — скоро...</h2></div>} />
          <Route path="/roulette" element={<div className="container" style={{ padding: 100, textAlign: 'center' }}><h2>Мультиплеер рулетка — уже в разработке</h2></div>} />
          <Route path="/leaderboard" element={<div className="container" style={{ padding: 100, textAlign: 'center' }}><h2>Лидерборд</h2></div>} />
          <Route path="/community" element={<div className="container" style={{ padding: 100, textAlign: 'center' }}><h2>Сообщество</h2></div>} />
          <Route path="/profile" element={<div className="container" style={{ padding: 100, textAlign: 'center' }}><h2>Профиль пользователя</h2></div>} />
        </Routes>
      </div>
    </>
  );
}

export default App;