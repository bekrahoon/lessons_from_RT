import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './styles/PostDetail.css';


const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const localPosts = JSON.parse(localStorage.getItem('posts')) || [];
        const localPost = localPosts.find(p => p.id == id);
        if (localPost) {
          setPost(localPost);
          setLoading(false);
          return;
        }

        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        await new Promise(resolve => setTimeout(resolve, 1500));
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Удалить пост?')) return;
    try {
      // Для local-IDs не делаем fetch
      if (!`${id}`.startsWith('local-')) {
        await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, { method: 'DELETE' });
      }
      const localPosts = JSON.parse(localStorage.getItem('posts')) || [];
      const updatedPosts = localPosts.filter(p => p.id != id);
      localStorage.setItem('posts', JSON.stringify(updatedPosts));
      navigate('/');
      setTimeout(() => window.location.reload(), 100);
    } catch (err) {
      alert('Ошибка удаления: ' + err.message);
    }
  };

  if (loading) return <div className="loading">Загрузка детали поста...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;
  if (!post) return null;

  return (
    <div className="post-detail">
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <p className="author">Автор ID: {post.userId}</p>
      <Link to={`/edit/${post.id}`} className="edit-btn">Редактировать</Link>
      <button className="delete-btn" onClick={handleDelete}>Удалить</button>
    </div>
  );
};

export default PostDetail;