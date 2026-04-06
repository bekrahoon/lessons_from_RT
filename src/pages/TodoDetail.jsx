import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toggleTodo, deleteTodo } from '../store';

const PRIORITY_COLOR = { high: '#ff4d4d', medium: '#f0c040', low: '#00ff9d' };
const PRIORITY_LABEL = { high: '🔴 Высокий', medium: '🟡 Средний', low: '🟢 Низкий' };

// GET ID — находим todo по id из URL
const TodoDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useSelector — читаем конкретный todo по id
  const todo = useSelector(state =>
    state.todos.items.find(t => t.id === Number(id))
  );

  if (!todo) return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h2 style={{ color: '#ff4d4d', marginBottom: 16 }}>Задача не найдена</h2>
      <Link to="/" style={{ color: '#00ff9d' }}>← На главную</Link>
    </div>
  );

  const handleDelete = () => {
    if (!window.confirm('Удалить задачу?')) return;
    dispatch(deleteTodo(todo.id));
    navigate('/');
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '100px 20px 40px' }}>

      {/* Навигация */}
      <Link to="/" style={{ color: '#666', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>
        ← Назад к задачам
      </Link>

      {/* Карточка */}
      <div style={{
        background: '#111', border: '1px solid #222', borderRadius: 20,
        padding: 36, boxShadow: '0 0 40px rgba(0,255,157,0.05)'
      }}>
        {/* Статус */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <span style={{
            padding: '4px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700,
            background: todo.completed ? 'rgba(0,255,157,0.1)' : 'rgba(240,192,64,0.1)',
            color: todo.completed ? '#00ff9d' : '#f0c040',
            border: `1px solid ${todo.completed ? '#00ff9d44' : '#f0c04044'}`,
          }}>
            {todo.completed ? '✓ Выполнено' : '⏳ В процессе'}
          </span>

          <span style={{
            padding: '4px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700,
            background: `${PRIORITY_COLOR[todo.priority]}18`,
            color: PRIORITY_COLOR[todo.priority],
            border: `1px solid ${PRIORITY_COLOR[todo.priority]}44`,
          }}>
            {PRIORITY_LABEL[todo.priority]}
          </span>
        </div>

        {/* ID */}
        <p style={{ color: '#444', fontSize: 12, marginBottom: 8 }}>ID: #{todo.id}</p>

        {/* Заголовок */}
        <h1 style={{
          fontSize: 26, fontWeight: 800, marginBottom: 16,
          textDecoration: todo.completed ? 'line-through' : 'none',
          color: todo.completed ? '#555' : '#e0e0e0',
          lineHeight: 1.3,
        }}>
          {todo.title}
        </h1>

        {/* Описание */}
        {todo.description ? (
          <p style={{ color: '#888', fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
            {todo.description}
          </p>
        ) : (
          <p style={{ color: '#444', fontSize: 14, fontStyle: 'italic', marginBottom: 28 }}>
            Описание не добавлено
          </p>
        )}

        {/* Дата */}
        <div style={{ color: '#555', fontSize: 13, marginBottom: 32, paddingTop: 20, borderTop: '1px solid #222' }}>
          Создано: {new Date(todo.createdAt).toLocaleString('ru-RU')}
        </div>

        {/* Действия */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            onClick={() => dispatch(toggleTodo(todo.id))}
            style={{
              flex: 1, minWidth: 140, padding: '12px 0', borderRadius: 50,
              background: todo.completed ? 'rgba(240,192,64,0.15)' : 'linear-gradient(90deg,#00ff9d,#00b8ff)',
              color: todo.completed ? '#f0c040' : '#000',
              border: todo.completed ? '1px solid #f0c04044' : 'none',
              fontWeight: 700, cursor: 'pointer', fontSize: 14,
            }}
          >
            {todo.completed ? '↩ Вернуть в работу' : '✓ Отметить выполненной'}
          </button>

          <Link
            to={`/?edit=${todo.id}`}
            onClick={() => navigate('/')}
            style={{
              flex: 1, minWidth: 120, padding: '12px 0', borderRadius: 50,
              background: 'transparent', color: '#aaa',
              border: '1px solid #333', fontWeight: 600, fontSize: 14,
              textAlign: 'center', cursor: 'pointer',
            }}
          >
            ✏️ Редактировать
          </Link>

          <button
            onClick={handleDelete}
            style={{
              padding: '12px 24px', borderRadius: 50,
              background: 'rgba(255,77,77,0.1)', color: '#ff6b6b',
              border: '1px solid rgba(255,77,77,0.3)',
              fontWeight: 600, cursor: 'pointer', fontSize: 14,
            }}
          >
            🗑 Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoDetail;
