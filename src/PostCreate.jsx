import PostForm from './PostForm';

const PostCreate = () => {
  return (
    <div className="container" style={{ padding: '100px 40px' }}>
      <h2 className="section-title">Создать новый пост</h2>
      <PostForm />
    </div>
  );
};

export default PostCreate;