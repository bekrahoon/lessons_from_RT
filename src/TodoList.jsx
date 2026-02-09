import { useState, useEffect } from 'react';
import './styles/TodoList.css';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=8');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        
        // Симуляция задержки 1 секунды
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setTodos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  if (loading) return <div className="loading">Загрузка задач...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
          {todo.title}
        </li>
      ))}
    </ul>
  );
};

export default TodoList;