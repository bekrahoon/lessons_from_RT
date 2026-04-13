import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addTodo, updateTodo, toggleTodo, deleteTodo } from '../store/index.js';
import InteractionBar from '../components/InteractionBar.jsx';
import './TodoPage.css';

const PR_COLOR = { high: 'var(--red)', medium: 'var(--yellow)', low: 'var(--green)' };
const PR_LABEL = { high: '🔴 Высокий', medium: '🟡 Средний', low: '🟢 Низкий' };

// ─── Форма CREATE ─────────────────────────────────────────────────
function AddForm({ onDone }) {
  const dispatch = useDispatch();
  const [f, setF] = useState({ title: '', description: '', priority: 'medium' });
  const [err, setErr] = useState('');

  const submit = e => {
    e.preventDefault();
    if (!f.title.trim()) { setErr('Введите название'); return; }
    dispatch(addTodo(f));
    onDone();
  };

  return (
    <div className="todo-form-wrap fade-up">
      <h3>Новая задача</h3>
      <form onSubmit={submit}>
        <input
          className={`tf-input ${err ? 'err' : ''}`}
          placeholder="Название *"
          value={f.title}
          onChange={e => { setF(p => ({...p, title: e.target.value})); setErr(''); }}
        />
        {err && <span className="tf-err">{err}</span>}

        <textarea
          className="tf-input tf-area"
          placeholder="Описание (необязательно)"
          value={f.description}
          rows={3}
          onChange={e => setF(p => ({...p, description: e.target.value}))}
        />

        <div className="pr-row">
          {Object.keys(PR_LABEL).map(v => (
            <button key={v} type="button"
              className={`pr-btn ${f.priority === v ? 'active' : ''}`}
              style={{'--c': PR_COLOR[v]}}
              onClick={() => setF(p => ({...p, priority: v}))}>
              {PR_LABEL[v]}
            </button>
          ))}
        </div>

        <div className="tf-actions">
          <button type="submit" className="btn-primary">Создать</button>
          <button type="button" className="btn-ghost" onClick={onDone}>Отмена</button>
        </div>
      </form>
    </div>
  );
}

// ─── Карточка TODO (READ + UPDATE inline + DELETE + GET ID) ───────
function TodoCard({ todo }) {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [ef, setEf] = useState({ title: todo.title, description: todo.description, priority: todo.priority });

  const save = () => {
    if (!ef.title.trim()) return;
    dispatch(updateTodo({ id: todo.id, ...ef }));
    setEditing(false);
  };

  if (editing) return (
    <div className="todo-card editing fade-up">
      <input className="tf-input"
        value={ef.title}
        onChange={e => setEf(p => ({...p, title: e.target.value}))} />
      <textarea className="tf-input tf-area" rows={2}
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
        <button className="btn-primary small" onClick={save}>Сохранить</button>
        <button className="btn-ghost small" onClick={() => setEditing(false)}>Отмена</button>
      </div>
    </div>
  );

  return (
    <div className={`todo-card ${todo.completed ? 'done' : ''}`}>
      <div className="todo-card-top">
        {/* TOGGLE completed */}
        <button className={`check-btn ${todo.completed ? 'checked' : ''}`}
          onClick={() => dispatch(toggleTodo(todo.id))}>
          {todo.completed ? '✓' : ''}
        </button>

        <div className="todo-body">
          <span className="todo-title">{todo.title}</span>
          {todo.description && (
            <span className="todo-desc">
              {todo.description.length > 70 ? todo.description.slice(0,70)+'…' : todo.description}
            </span>
          )}
        </div>

        <span className="pr-dot" style={{ background: PR_COLOR[todo.priority] }}
          title={PR_LABEL[todo.priority]} />
      </div>

      <div className="todo-card-bottom">
        <span className="todo-date">
          {new Date(todo.createdAt).toLocaleDateString('ru-RU')}
        </span>
        <div className="card-btns">
          {/* GET ID — Detail */}
          <Link to={`/todo/${todo.id}`} className="icon-btn detail" title="Подробнее">👁</Link>
          {/* UPDATE */}
          <button className="icon-btn edit" title="Редактировать" onClick={() => setEditing(true)}>✏️</button>
          {/* DELETE */}
          <button className="icon-btn del" title="Удалить"
            onClick={() => { if(confirm('Удалить задачу?')) dispatch(deleteTodo(todo.id)); }}>
            🗑
          </button>
        </div>
      </div>

      {/* Лайки, Избранное, Оценки — compact режим */}
      <InteractionBar todoId={todo.id} compact />
    </div>
  );
}

// ─── Главная страница TODO ────────────────────────────────────────
const FILTERS = [
  { key: 'all',    label: 'Все' },
  { key: 'active', label: 'Активные' },
  { key: 'done',   label: 'Выполненные' },
];

export default function TodoPage() {
  // READ — useSelector читает из Redux store
  const todos = useSelector(s => s.todos.items);
  const { currentUser } = useSelector(s => s.auth);

  const [showForm, setShowForm] = useState(false);
  const [filter,   setFilter]   = useState('all');
  const [search,   setSearch]   = useState('');
  const [sort,     setSort]     = useState('newest');

  // Фильтрация + поиск + сортировка
  const visible = todos
    .filter(t => {
      if (filter === 'active') return !t.completed;
      if (filter === 'done')   return t.completed;
      return true;
    })
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'newest') return b.id - a.id;
      if (sort === 'oldest') return a.id - b.id;
      const pr = { high: 3, medium: 2, low: 1 };
      return pr[b.priority] - pr[a.priority];
    });

  const total  = todos.length;
  const done   = todos.filter(t => t.completed).length;
  const active = total - done;

  return (
    <div className="todo-page container">

      {/* Заголовок */}
      <div className="todo-header">
        <div>
          <h1>Мои задачи</h1>
          <p>Привет, <b>{currentUser?.username}</b> 👋</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(s => !s)}>
          {showForm ? '✕ Закрыть' : '+ Новая задача'}
        </button>
      </div>

      {/* Статистика */}
      <div className="todo-stats">
        <Stat label="Всего" value={total}  color="var(--text2)" />
        <Stat label="Активных" value={active} color="var(--yellow)" />
        <Stat label="Готово"   value={done}   color="var(--green)" />
        <div className="stat-progress">
          <div className="stat-bar">
            <div className="stat-fill"
              style={{ width: total ? `${(done/total)*100}%` : '0%' }} />
          </div>
          <span>{total ? Math.round((done/total)*100) : 0}% завершено</span>
        </div>
      </div>

      {/* Форма CREATE */}
      {showForm && <AddForm onDone={() => setShowForm(false)} />}

      {/* Фильтры и поиск */}
      <div className="todo-controls">
        <input className="tf-search" placeholder="🔍 Поиск..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <div className="filter-tabs">
          {FILTERS.map(f => (
            <button key={f.key}
              className={`filter-tab ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}>
              {f.label}
            </button>
          ))}
        </div>
        <select className="sort-sel" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="newest">Сначала новые</option>
          <option value="oldest">Сначала старые</option>
          <option value="priority">По приоритету</option>
        </select>
      </div>

      {/* Список READ */}
      {visible.length === 0 ? (
        <div className="todo-empty">
          <span>📭</span>
          <p>{search ? 'Ничего не найдено' : filter === 'done' ? 'Нет выполненных задач' : 'Создайте свою первую задачу!'}</p>
        </div>
      ) : (
        <div className="todo-grid">
          {visible.map(t => <TodoCard key={t.id} todo={t} />)}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="stat-item">
      <span className="stat-val" style={{ color }}>{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}
