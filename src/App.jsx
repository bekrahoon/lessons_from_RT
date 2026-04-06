import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Header from './Header';
import PostList from './PostList';
import UserList from './UserList';
import TodoList from './TodoList';
import PostDetail from './PostDetail';
import PostEdit from './PostEdit';
import PostCreate from './PostCreate';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TodoDetail from './pages/TodoDetail';
import ProtectedRoute from './middlewares/ProtectedRoute';
import GuestRoute from './middlewares/GuestRoute';
import { useSelector } from 'react-redux';

function App() {
  const [reloadKey, setReloadKey] = useState(0);
  const { currentUser } = useSelector(state => state.auth);

  return (
    <>
      <Header />

      <div style={{ paddingTop: '80px' }}>
        <Routes>

          {/* ── Главная ── */}
          <Route path="/" element={
            <div className="container">
              <section className="section">
                <h2 className="section-title">Последние посты (с CRUD)</h2>

                {/* Кнопка «Создать» только для авторизованных */}
                {currentUser ? (
                  <Link to="/create" style={{
                    display: 'block',
                    textAlign: 'center',
                    background: '#222',
                    color: 'white',
                    padding: '12px 32px',
                    borderRadius: '50px',
                    maxWidth: '200px',
                    margin: '0 auto 32px'
                  }}>Создать новый</Link>
                ) : (
                  <p style={{ textAlign: 'center', color: '#666', marginBottom: 32 }}>
                    <Link to="/login" style={{ color: '#00ff9d' }}>Войдите</Link>, чтобы создавать посты
                  </p>
                )}

                <PostList key={reloadKey} onReload={() => setReloadKey(prev => prev + 1)} />
              </section>

              <section className="section">
                <h2 className="section-title">Топ пользователей</h2>
                <UserList />
              </section>

              <section className="section">
                <h2 className="section-title">Активные задачи</h2>
                <TodoList />
              </section>
            </div>
          } />

          {/* ── Auth роуты (только для гостей) ── */}
          <Route path="/login" element={
            <GuestRoute><LoginPage /></GuestRoute>
          } />
          <Route path="/register" element={
            <GuestRoute><RegisterPage /></GuestRoute>
          } />

          {/* ── Защищённые роуты (только для авторизованных) ── */}
          <Route path="/create" element={
            <ProtectedRoute><PostCreate /></ProtectedRoute>
          } />
          <Route path="/edit/:id" element={
            <ProtectedRoute><PostEdit /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <div className="container" style={{ padding: '100px 40px', textAlign: 'center' }}>
                <h2 className="section-title">Профиль: {currentUser?.username}</h2>
                <div style={{
                  background: '#111', border: '1px solid #222', borderRadius: 16,
                  padding: 32, maxWidth: 400, margin: '0 auto', textAlign: 'left'
                }}>
                  {[
                    ['Логин', currentUser?.username],
                    ['E-mail', currentUser?.email],
                    ['Баланс', `${currentUser?.balance} ⚡`],
                    ['Роль', currentUser?.role],
                    ['Дата регистрации', currentUser?.createdAt
                      ? new Date(currentUser.createdAt).toLocaleDateString('ru-RU') : '—'],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #222' }}>
                      <span style={{ color: '#666', fontSize: 14 }}>{k}</span>
                      <span style={{ fontWeight: 600 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ProtectedRoute>
          } />

          {/* ── Публичные роуты ── */}
          {/* GET ID — Todo Detail */}
          <Route path="/todo/:id" element={<TodoDetail />} />

          <Route path="/post/:id" element={
            <div className="container" style={{ padding: '100px 40px' }}><PostDetail /></div>
          } />
          <Route path="/games" element={
            <div className="container" style={{ padding: 100, textAlign: 'center' }}><h2>Игры — скоро...</h2></div>
          } />
          <Route path="/roulette" element={
            <div className="container" style={{ padding: 100, textAlign: 'center' }}><h2>Мультиплеер рулетка — уже в разработке</h2></div>
          } />
          <Route path="/leaderboard" element={
            <div className="container" style={{ padding: 100, textAlign: 'center' }}><h2>Лидерборд</h2></div>
          } />
          <Route path="/community" element={
            <div className="container" style={{ padding: 100, textAlign: 'center' }}><h2>Сообщество</h2></div>
          } />

          {/* 404 */}
          <Route path="*" element={
            <div className="container" style={{ padding: 100, textAlign: 'center' }}>
              <h2 style={{ color: '#ff4d4d' }}>404 — Страница не найдена</h2>
              <Link to="/" style={{ color: '#00ff9d', marginTop: 16, display: 'inline-block' }}>На главную</Link>
            </div>
          } />

        </Routes>
      </div>
    </>
  );
}

export default App;
