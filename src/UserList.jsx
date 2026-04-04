import { useState, useEffect } from 'react';
import './styles/UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users?_limit=5');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        
        // Симуляция задержки 1.5 секунды
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="loading">Загрузка пользователей...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  return (
    <div className="user-list">
      {users.map(user => (
        <div key={user.id} className="user-item">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <p>{user.company.name}</p>
        </div>
      ))}
    </div>
  );
};

export default UserList;