import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addTodo, updateTodo, toggleTodo, deleteTodo } from './store';
import './styles/TodoList.css';

const PRIORITIES = [
  { value: 'high',   label: '🔴 Высокий' },
  { value: 'medium', label: '🟡 Средний' },
  { value: 'low',    label: '🟢 Низкий'  },
];

const PRIORITY_COLOR = { high: '#ff4d4d', medium: '#f0c040', low: '#00ff9d' };

// ─── Форма CREATE ─────────────────────────────────────────────
function AddTodoForm() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Введите название задачи'); return; }
    dispatch(addTodo(form));
    setForm({ title: '', description: '', priority: 'medium' });
    setError('');
    setOpen(false);
  };

  if (!open) return (
    <button className="todo-add-btn" onClick={() => setOpen(true)}>
      + Новая задача
    </button>
  );

  return (
    <div className="todo-form-card">
      <h3 className="todo-form-title">Новая задача</h3>
      {error && <p className="todo-field-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          className="todo-input"
          placeholder="Название задачи *"
          value={form.title}
          onChange={e => { setForm(p => ({ ...p, title: e.target.value })); setError(''); }}
        />
        <textarea
          className="todo-input todo-textarea"
          placeholder="Описание (необязательно)"
          value={form.description}
          onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
          rows={3}
        />
        <div className="todo-priority-row">
          {PRIORITIES.map(p => (
            <button
              key={p.value}
              type="button"
              className={`priority-btn ${form.priority === p.value ? 'active' : ''}`}
              style={{ '--p-color': PRIORITY_COLOR[p.value] }}
              onClick={() => setForm(prev => ({ ...prev, priority: p.value }))}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="todo-form-actions">
          <button type="submit" className="todo-submit-btn">Создать</button>
          <button type="button" className="todo-cancel-btn" onClick={() => setOpen(false)}>Отмена</button>
        </div>
      </form>
    </div>
  );
}

// ─── Строка UPDATE (inline-редактирование) ───────────────────
function TodoItem({ todo }) {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: todo.title, description: todo.description, priority: todo.priority });

  const handleSave = () => {
    if (!editForm.title.trim()) return;
    dispatch(updateTodo({ id: todo.id, ...editForm }));
    setEditing(false);
  };

  if (editing) return (
    <li className="todo-item editing">
      <input
        className="todo-input"
        value={editForm.title}
        onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))}
      />
      <textarea
        className="todo-input todo-textarea"
        value={editForm.description}
        onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))}
        rows={2}
      />
      <div className="todo-priority-row">
        {PRIORITIES.map(p => (
          <button
            key={p.value}
            type="button"
            className={`priority-btn ${editForm.priority === p.value ? 'active' : ''}`}
            style={{ '--p-color': PRIORITY_COLOR[p.value] }}
            onClick={() => setEditForm(prev => ({ ...prev, priority: p.value }))}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="todo-item-actions">
        <button className="todo-save-btn" onClick={handleSave}>Сохранить</button>
        <button className="todo-cancel-btn" onClick={() => setEditing(false)}>Отмена</button>
      </div>
    </li>
  );

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-item-top">
        {/* TOGGLE */}
        <button
          className={`todo-check ${todo.completed ? 'checked' : ''}`}
          onClick={() => dispatch(toggleTodo(todo.id))}
          title="Отметить выполненной"
        >
          {todo.completed ? '✓' : ''}
        </button>

        <div className="todo-item-content">
          <span className="todo-item-title">{todo.title}</span>
          {todo.description && (
            <span className="todo-item-desc">{todo.description.slice(0, 60)}{todo.description.length > 60 ? '…' : ''}</span>
          )}
        </div>

        <span className="todo-priority-dot" style={{ background: PRIORITY_COLOR[todo.priority] }} title={todo.priority} />

        <div className="todo-item-actions">
          {/* GET ID — DETAIL */}
          <Link to={`/todo/${todo.id}`} className="todo-action-btn detail-btn" title="Подробнее">👁</Link>
          {/* UPDATE */}
          <button className="todo-action-btn edit-btn" onClick={() => setEditing(true)} title="Редактировать">✏️</button>
          {/* DELETE */}
          <button className="todo-action-btn delete-btn" onClick={() => dispatch(deleteTodo(todo.id))} title="Удалить">🗑</button>
        </div>
      </div>
    </li>
  );
}

// ─── Фильтры ─────────────────────────────────────────────────
function FilterBar({ filter, setFilter, search, setSearch }) {
  return (
    <div className="todo-filters">
      <input
        className="todo-search"
        placeholder="🔍 Поиск задач..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="todo-filter-btns">
        {['all', 'active', 'done'].map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {{ all: 'Все', active: 'Активные', done: 'Выполненные' }[f]}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Главный компонент ────────────────────────────────────────
const TodoList = () => {
  // READ — useSelector
  const todos = useSelector(state => state.todos.items);

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Применяем фильтр + поиск
  const visible = todos.filter(t => {
    const matchFilter = filter === 'all' || (filter === 'done' ? t.completed : !t.completed);
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const doneCount = todos.filter(t => t.completed).length;

  return (
    <div className="todo-wrap">
      <div className="todo-stats">
        <span>Всего: <b>{todos.length}</b></span>
        <span>Выполнено: <b style={{ color: '#00ff9d' }}>{doneCount}</b></span>
        <span>Осталось: <b style={{ color: '#f0c040' }}>{todos.length - doneCount}</b></span>
      </div>

      <AddTodoForm />
      <FilterBar filter={filter} setFilter={setFilter} search={search} setSearch={setSearch} />

      {visible.length === 0 ? (
        <p className="todo-empty">
          {search ? 'Ничего не найдено' : filter === 'done' ? 'Нет выполненных задач' : 'Задач пока нет — создайте первую!'}
        </p>
      ) : (
        <ul className="todo-list">
          {visible.map(todo => <TodoItem key={todo.id} todo={todo} />)}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
