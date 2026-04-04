import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/PostForm.css';



const PostForm = ({ initialData = {}, isEdit = false }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [body, setBody] = useState(initialData.body || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Симуляция задержки
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Сохраняем в localStorage (без API)
      const localPosts = JSON.parse(localStorage.getItem('posts')) || [];
      if (isEdit) {
        const updatedPosts = localPosts.map(p => p.id === initialData.id ? { ...p, title, body } : p);
        localStorage.setItem('posts', JSON.stringify(updatedPosts));
      } else {
        const localId = `local-${Date.now()}`;
        localPosts.unshift({ id: localId, userId: 1, title, body });
        localStorage.setItem('posts', JSON.stringify(localPosts));
      }

      navigate('/');
      setTimeout(() => window.location.reload(), 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>Заголовок</label>
      <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />

      <label>Текст</label>
      <textarea value={body} onChange={e => setBody(e.target.value)} required rows={6} />

      {error && <div className="error">{error}</div>}
      <button disabled={loading}>
        {loading ? 'Сохранение...' : isEdit ? 'Обновить' : 'Создать'}
      </button>
    </form>
  );
};

export default PostForm;