import React, { useContext, useEffect } from 'react';
import './Thankyou.css'
import { useLocation,  useNavigate } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';

const ThankYou = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get('status');

    if (status === 'success') {
      alert('Order placed successfully!');
    }
  }, [location.search]);

  const shopmore = () =>{
    navigate('/')
    clearCart();
  }

  return (
    <div className='thankyou-container'>
      <h1>Your order has been placed successfully.</h1>
      <h3>Thank You!</h3>
      <button onClick={shopmore}>Shop More</button>
    </div>
  );
};

export default ThankYou;