import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PostForm from './PostForm';

const PostEdit = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Сначала из localStorage
        const localPosts = JSON.parse(localStorage.getItem('posts')) || [];
        const localPost = localPosts.find(p => p.id == id);
        if (localPost) {
          setPost(localPost);
          setLoading(false);
          return;
        }

        // Если нет — с API
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

  if (loading) return <div className="loading">Загрузка поста для редактирования...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;
  if (!post) return null;

  return (
    <div className="container" style={{ padding: '100px 40px' }}>
      <h2 className="section-title">Редактировать пост</h2>
      <PostForm initialData={post} isEdit={true} />
    </div>
  );
};

export default PostEdit;