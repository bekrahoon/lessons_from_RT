import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toggleTodo, deleteTodo, updateTodo } from '../store/index.js';
import InteractionBar from '../components/InteractionBar.jsx';
import './TodoDetail.css';

const PR_COLOR = { high: 'var(--red)', medium: 'var(--yellow)', low: 'var(--green)' };
const PR_LABEL = { high: '🔴 Высокий', medium: '🟡 Средний', low: '🟢 Низкий' };

export default function TodoDetail() {
  const { id }     = useParams();
  const dispatch   = useDispatch();
  const navigate   = useNavigate();

  // GET ID — находим задачу по id из URL через useSelector
  const todo = useSelector(s => s.todos.items.find(t => t.id === Number(id)));

  const [editing, setEditing] = useState(false);
  const [ef, setEf] = useState(null);

  if (!todo) return (
    <div className="detail-notfound">
      <span>🔍</span>
      <h2>Задача не найдена</h2>
      <p>ID #{id} не существует или была удалена</p>
      <Link to="/" className="back-link">← Вернуться к списку</Link>
    </div>
  );

  const startEdit = () => {
    setEf({ title: todo.title, description: todo.description, priority: todo.priority });
    setEditing(true);
  };

  const saveEdit = () => {
    if (!ef.title.trim()) return;
    dispatch(updateTodo({ id: todo.id, ...ef }));
    setEditing(false);
  };

  const handleDelete = () => {
    if (!confirm('Удалить эту задачу?')) return;
    dispatch(deleteTodo(todo.id));
    navigate('/');
  };

  return (
    <div className="detail-page container">
      <Link to="/" className="back-link">← Все задачи</Link>

      <div className="detail-card fade-up">

        {/* Заголовок карточки */}
        <div className="detail-top">
          <div className="detail-badges">
            <span className="badge-status" style={{
              background: todo.completed ? 'rgba(45,212,160,0.12)' : 'rgba(255,181,71,0.12)',
              color: todo.completed ? 'var(--green)' : 'var(--yellow)',
              borderColor: todo.completed ? 'rgba(45,212,160,0.25)' : 'rgba(255,181,71,0.25)',
            }}>
              {todo.completed ? '✓ Выполнено' : '⏳ В процессе'}
            </span>
            <span className="badge-priority"
              style={{ color: PR_COLOR[todo.priority], background: `${PR_COLOR[todo.priority]}18`, borderColor: `${PR_COLOR[todo.priority]}30` }}>
              {PR_LABEL[todo.priority]}
            </span>
          </div>
          <span className="detail-id">ID #{todo.id}</span>
        </div>

        {/* Редактирование или просмотр */}
        {editing ? (
          <div className="detail-edit">
            <input className="tf-input big"
              value={ef.title}
              onChange={e => setEf(p => ({...p, title: e.target.value}))} />
            <textarea className="tf-input tf-area"
              rows={5}
              value={ef.description}
              onChange={e => setEf(p => ({...p, description: e.target.value}))} />
            <div className="pr-row">
              {Object.keys(PR_LABEL).map(v => (
                <button key={v} type="button"
                  className={`pr-btn ${ef.priority === v ? 'active' : ''}`}
                  style={{'--c': PR_COLOR[v]}}
                  onClick={() => setEf(p => ({...p, priority: v}))}>
                  {PR_LABEL[v]}
                </button>
              ))}
            </div>
            <div className="tf-actions">
              <button className="btn-primary" onClick={saveEdit}>Сохранить</button>
              <button className="btn-ghost" onClick={() => setEditing(false)}>Отмена</button>
            </div>
          </div>
        ) : (
          <>
            <h1 className={`detail-title ${todo.completed ? 'done' : ''}`}>{todo.title}</h1>

            <div className="detail-desc">
              {todo.description
                ? <p>{todo.description}</p>
                : <p className="no-desc">Описание не добавлено</p>}
            </div>

            <div className="detail-meta">
              <MetaRow icon="📅" label="Создано"
                value={new Date(todo.createdAt).toLocaleString('ru-RU')} />
              {todo.updatedAt && (
                <MetaRow icon="✏️" label="Изменено"
                  value={new Date(todo.updatedAt).toLocaleString('ru-RU')} />
              )}
              <MetaRow icon="🏷" label="Приоритет" value={PR_LABEL[todo.priority]} />
              <MetaRow icon="📌" label="Статус"
                value={todo.completed ? 'Выполнено' : 'В процессе'} />
            </div>

            {/* Лайки, Избранное, Оценки — полный режим */}
            <InteractionBar todoId={todo.id} />
          </>
        )}

        {/* Кнопки действий */}
        {!editing && (
          <div className="detail-actions">
            <button
              className={`btn-toggle ${todo.completed ? 'undo' : ''}`}
              onClick={() => dispatch(toggleTodo(todo.id))}>
              {todo.completed ? '↩ Вернуть в работу' : '✓ Отметить выполненной'}
            </button>
            <button className="btn-ghost" onClick={startEdit}>✏️ Редактировать</button>
            <button className="btn-danger" onClick={handleDelete}>🗑 Удалить</button>
          </div>
        )}
      </div>
    </div>
  );
}

function MetaRow({ icon, label, value }) {
  return (
    <div className="meta-row">
      <span className="meta-icon">{icon}</span>
      <span className="meta-label">{label}</span>
      <span className="meta-value">{value}</span>
    </div>
  );
}
