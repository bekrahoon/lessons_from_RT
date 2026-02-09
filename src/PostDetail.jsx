import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './styles/PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        
        // Симуляция задержки 1.5 секунды
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

  if (loading) return <div className="loading">Загрузка детали поста...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;
  if (!post) return null;

  return (
    <div className="post-detail">
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <p className="author">Автор ID: {post.userId}</p>
    </div>
  );
};

export default PostDetail;