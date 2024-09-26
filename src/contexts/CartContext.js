import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const localStorageCartItem = JSON.parse(localStorage.getItem('cartitem')) || [];
  const [cartItems, setCartItems] = useState(Array.isArray(localStorageCartItem) ? localStorageCartItem : []);
  const [productStocks, setProductStocks] = useState({}); // To keep track of stock quantities

  useEffect(() => {
    localStorage.setItem('cartitem', JSON.stringify(cartItems));
  }, [cartItems]);


  const addToCart = (product) => {
    if (!Array.isArray(cartItems)) {
      console.error('cartItems is not an array');
      return;
    }

    const existingProductIndex = cartItems.findIndex(
      item =>
        item._id === product._id &&
        item.color === product.color &&
        item.size === product.size
    );

    if (existingProductIndex >= 0) {
      // Increase quantity if the product already exists in the cart
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingProductIndex].quantity += 1;
      setCartItems(updatedCartItems);
    } else {
      // Add new product to the cart
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId, color, size) => {
    if (!Array.isArray(cartItems)) {
      console.error('cartItems is not an array');
      return;
    }

    const updatedCartItems = cartItems.filter(
      item =>
        !(item._id === productId && item.color === color && item.size === size)
    );
    setCartItems(updatedCartItems);
  };

  const updateQuantity = async (productId, color, size, action) => {
    if (!Array.isArray(cartItems)) {
      console.error('cartItems is not an array');
      return;
    }
  
    const updatedCartItems = await Promise.all(cartItems.map(async item => {
      if (item._id === productId && item.color === color && item.size === size) {
        const stockKey = `${productId}_${color}_${size}`;
        const stock = productStocks[stockKey] || 0;
  
        console.log(`Stock key: ${stockKey}, Stock: ${stock}`); // Debugging
  
        if (action === 'increase') {
          try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/products/${productId}/stock/${color}/${size}`);
            const data = await response.json();
            const availableStock = data.stock;
  
            const newQuantity = item.quantity + 1;
            if (newQuantity <= availableStock) {
              return { ...item, quantity: newQuantity };
            } else {
              alert('Not enough stock left');
              return item;
            }
          } catch (error) {
            console.error('Error fetching stock data:', error);
            return item;
          }
        } else if (action === 'decrease') {
          const newQuantity = item.quantity - 1;
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
        }
      }
      return item;
    }));
  
    setCartItems(updatedCartItems.filter(item => item.quantity > 0));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartitem');
  };
 
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity,clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
