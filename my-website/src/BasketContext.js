import React, { createContext, useState, useContext, useEffect } from 'react';

const BasketContext = createContext();

export const useBasket = () => {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error('useBasket must be used within BasketProvider');
  }
  return context;
};

export const BasketProvider = ({ children }) => {
  const [basket, setBasket] = useState([]);
  const [orders, setOrders] = useState([]);

  // Загрузка из localStorage при монтировании
  useEffect(() => {
    const savedBasket = localStorage.getItem('basket');
    const savedOrders = localStorage.getItem('orders');
    if (savedBasket) setBasket(JSON.parse(savedBasket));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  // Сохранение в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('basket', JSON.stringify(basket));
  }, [basket]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  // Добавить в корзину
  const addToBasket = (movie, quantity = 1, price = 9.99) => {
    const existingItem = basket.find(item => item.id === movie.id);
    
    if (existingItem) {
      setBasket(basket.map(item =>
        item.id === movie.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setBasket([...basket, { ...movie, quantity, price }]);
    }
  };

  // Удалить из корзины
  const removeFromBasket = (id) => {
    setBasket(basket.filter(item => item.id !== id));
  };

  // Обновить количество
  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromBasket(id);
      return;
    }
    setBasket(basket.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  // Очистить корзину
  const clearBasket = () => {
    setBasket([]);
  };

  // Создать заказ
  const createOrder = (orderData) => {
    const newOrder = {
      id: Date.now(),
      items: [...basket],
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setOrders([...orders, newOrder]);
    clearBasket();
    return newOrder;
  };

  // Обновить заказ
  const updateOrder = (orderId, updates) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, ...updates } : order
    ));
  };

  // Удалить заказ
  const deleteOrder = (orderId) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  // Получить общую сумму корзины
  const getTotalPrice = () => {
    return basket.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Получить количество товаров
  const getTotalItems = () => {
    return basket.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    basket,
    orders,
    addToBasket,
    removeFromBasket,
    updateQuantity,
    clearBasket,
    createOrder,
    updateOrder,
    deleteOrder,
    getTotalPrice,
    getTotalItems,
  };

  return (
    <BasketContext.Provider value={value}>
      {children}
    </BasketContext.Provider>
  );
};