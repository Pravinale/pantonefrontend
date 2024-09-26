import React, { useContext } from 'react';
import './Cart.css';
import { CartContext } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);
  const { isAuthenticated } = useAuth(); // Get authentication status

  // Calculate the total price for each item
  const calculateItemTotal = (price, quantity) => price * quantity;

  // Calculate the grand total
  const grandTotal = cartItems.reduce((acc, item) => acc + calculateItemTotal(item.price, item.quantity), 0);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert('Login first');
      navigate('/login'); // Redirect to login page if not authenticated
    } else {
      navigate('/checkout'); // Proceed to checkout if authenticated
    }
  };

  return (
    <div className='cart-container'>
      <h2>Your Cart</h2>
      <button className='back-btn' onClick={() => navigate(-1)}><FaArrowAltCircleLeft /></button>
      <div className='cart-item-container'>
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (

            <div key={index} className='cart-item'>
              <img src={`${process.env.REACT_APP_BASE_URL}/${item.image}`} alt={item.name} />
              <div className='cart-details'>
                <h3>{item.name}</h3>
                <p>Color: {item.color}</p>
                <p>Size: {item.size}</p>
                <p className='price'>Rs.{calculateItemTotal(item.price, item.quantity)}</p>
              </div>
              
              <div className='quantity-container'>
                <button 
                  onClick={() => updateQuantity(item._id, item.color, item.size, 'decrease')}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <h1 className='qtn-no'>{item.quantity}</h1>
                <button 
                  onClick={() => updateQuantity(item._id, item.color, item.size, 'increase')}
                >
                  +
                </button>
              </div>
              <button className='remove-btn' onClick={() => removeFromCart(item._id, item.color, item.size)}>
              <MdDelete className='delete-icon'/>
              </button>
            </div>

          ))
        ) : (
          <p>Your cart is empty</p>
        )}
      </div>
      {cartItems.length > 0 && (
        <div className='grandTotal-checkout'>
          <h3>Grand Total: Rs.{grandTotal}</h3>
          <button onClick={handleCheckout}>Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
};

export default Cart;
