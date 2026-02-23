import { useState } from 'react';  // Добавили state для reload
import { Routes, Route, Link } from 'react-router-dom';
import Header from './Header';
import PostList from './PostList';
import UserList from './UserList';
import TodoList from './TodoList';
import PostDetail from './PostDetail';
import PostEdit from './PostEdit';
import PostCreate from './PostCreate';




function App() {
  const [reloadKey, setReloadKey] = useState(0);  // Для принудительного reload

  return (
    <>
      <Header />

      <div style={{ paddingTop: '80px' }}>
        <Routes>
          <Route path="/" element={
            <div className="container">
              <section className="section">
                <h2 className="section-title">Последние посты (с CRUD)</h2>
                <Link to="/create" style={{
                  display: 'block',
                  textAlign: 'center',
                  marginBottom: '32px',
                  background: '#222',
                  color: 'white',
                  padding: '12px 32px',
                  borderRadius: '50px',
                  maxWidth: '200px',
                  margin: '0 auto 32px'
                }}>Создать новый</Link>
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

          <Route path="/post/:id" element={<div className="container" style={{ padding: '100px 40px' }}><PostDetail /></div>} />
          <Route path="/edit/:id" element={<PostEdit />} />
          <Route path="/create" element={<PostCreate />} />

          {/* Заглушки */}
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