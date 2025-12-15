import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Загрузка данных при монтировании
  useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    const savedCurrentUser = localStorage.getItem('currentUser');
    
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
    
    if (savedCurrentUser) {
      setCurrentUser(JSON.parse(savedCurrentUser));
    }
    
    setLoading(false);
  }, []);

  // Сохранение пользователей
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, [users, loading]);

  // Сохранение текущего пользователя
  useEffect(() => {
    if (!loading) {
      if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('currentUser');
      }
    }
  }, [currentUser, loading]);

  // Регистрация
  const register = (userData) => {
    // Проверка на существующего пользователя
    const existingUser = users.find(
      user => user.email.toLowerCase() === userData.email.toLowerCase()
    );

    if (existingUser) {
      throw new Error('Пользователь с таким email уже существует');
    }

    const newUser = {
      id: Date.now(),
      ...userData,
      createdAt: new Date().toISOString(),
      avatar: `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=2a5298&color=fff&size=200`,
    };

    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    
    return newUser;
  };

  // Вход
  const login = (email, password) => {
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      throw new Error('Неверный email или пароль');
    }

    setCurrentUser(user);
    return user;
  };

  // Выход
  const logout = () => {
    setCurrentUser(null);
  };

  // Обновление профиля
  const updateProfile = (updates) => {
    const updatedUser = { ...currentUser, ...updates };
    
    // Обновить в списке пользователей
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    
    // Обновить текущего пользователя
    setCurrentUser(updatedUser);
    
    return updatedUser;
  };

  // Удаление аккаунта
  const deleteAccount = () => {
    setUsers(users.filter(u => u.id !== currentUser.id));
    setCurrentUser(null);
  };

  // Проверка email
  const isEmailTaken = (email) => {
    return users.some(u => u.email.toLowerCase() === email.toLowerCase());
  };

  const value = {
    currentUser,
    users,
    register,
    login,
    logout,
    updateProfile,
    deleteAccount,
    isEmailTaken,
    isAuthenticated: !!currentUser,
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};