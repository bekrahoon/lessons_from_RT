import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import TodoPage from './pages/TodoPage.jsx';
import TodoDetail from './pages/TodoDetail.jsx';
import ProtectedRoute from './middlewares/ProtectedRoute.jsx';
import GuestRoute from './middlewares/GuestRoute.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Только для гостей */}
        <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

        {/* Только для авторизованных */}
        <Route path="/"         element={<ProtectedRoute><TodoPage /></ProtectedRoute>} />
        <Route path="/todo/:id" element={<ProtectedRoute><TodoDetail /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={
          <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center', gap:12, color:'var(--text3)' }}>
            <span style={{ fontSize:56 }}>🌌</span>
            <h2 style={{ color:'var(--text)' }}>404 — Страница не найдена</h2>
          </div>
        } />
      </Routes>
    </>
  );
}
