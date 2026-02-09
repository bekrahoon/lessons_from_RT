// src/components/PostList/PostList.jsx (новый компонент для LIST)
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
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        
        // Симуляция задержки 2 секунды
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="loading">Загрузка постов...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  return (
    <div className="post-list">
      {posts.map(post => (
        <Link to={`/post/${post.id}`} key={post.id} className="post-item">
          <h3>{post.title}</h3>
          <p>{post.body.slice(0, 100)}...</p>
        </Link>
      ))}
    </div>
  );
};

export default PostList;