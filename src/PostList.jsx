import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles/PostList.css';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const localPosts = JSON.parse(localStorage.getItem('posts')) || [];
        if (localPosts.length > 0) {
          setPosts(localPosts);
          setLoading(false);
          return;
        }

        // Пробуем API, но если ошибка — используем пустой массив
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        await new Promise(resolve => setTimeout(resolve, 2000));
        setPosts(data);
        localStorage.setItem('posts', JSON.stringify(data));
      } catch (err) {
        setError(err.message);
        setPosts([]);  // Пустой список если API не работает
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Удалить пост?')) return;
    try {
      const newPosts = posts.filter(post => post.id !== id);
      setPosts(newPosts);
      localStorage.setItem('posts', JSON.stringify(newPosts));
      window.location.reload();
    } catch (err) {
      alert('Ошибка удаления: ' + err.message);
    }
  };

  if (loading) return <div className="loading">Загрузка постов...</div>;
  if (error) return <div className="error">Ошибка загрузки постов: {error}. Работает только локально.</div>;

  return (
    <div className="post-list">
      {posts.map(post => (
        <div key={post.id} className="post-item">
          <Link to={`/post/${post.id}`}>
            <h3>{post.title}</h3>
            <p>{post.body.slice(0, 100)}...</p>
          </Link>
          <button className="delete-btn" onClick={() => handleDelete(post.id)}>Удалить</button>
        </div>
      ))}
    </div>
  );
};

export default PostList;