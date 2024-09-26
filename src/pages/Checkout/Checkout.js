import React, { useContext, useEffect, useState } from 'react';
import './Checkout.css';
import { CartContext } from '../../contexts/CartContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaArrowAltCircleLeft } from "react-icons/fa";

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash in hand');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderid, setOrderid] = useState(null); // Store the placed order ID
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState(null);


  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const storedUserId = localStorage.getItem('userId') || userId;
        const response = await axios.get(`${BASE_URL}/api/users/me/${storedUserId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [userId, BASE_URL]);

  

  const calculateItemTotal = (price, quantity) => price * quantity;
  const grandTotal = cartItems.reduce((acc, item) => acc + 2 + calculateItemTotal(item.price, item.quantity), 0);

  const handlePlaceOrder = async () => {
    if (!user) {
      alert('User details not found');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty, Please add products to the cart');
      return;
    }


    const orderDetails = {
      orderId: `${Date.now()}`,
      userId: user._id,
      username: user.username,
      phoneNumber: user.phonenumber,
      email: user.email,
      address: user.address,
      products: cartItems.map(item => ({
        productId: item._id,
        name: item.name,
        color: item.color, // Added color
        size: item.size,   // Added size
        quantity: item.quantity,
        image: item.image,
      })),
      price: grandTotal,
      paymentMethod: paymentMethod,
    };

    try {
      const response = await axios.post(`${BASE_URL}/api/orders`, orderDetails);
      if (response.status === 201) {
        setOrderPlaced(true); // Update the state to show the Cancel Order button
        const placedOrder = response.data.order;
        setOrderid(placedOrder._id); // Store the placed order I
        
        if(paymentMethod === 'Cash in hand'){
          // if (orderDetails.paymentMethod === 'Cash in hand') {
            // Proceed to update stock after order is placed
            await axios.post(`${BASE_URL}/api/products/update-stock`, {
              products: cartItems.map(item => ({
                productId: item._id,
                color: item.color,
                size: item.size,
                quantity: item.quantity
              }))
            });
          // }
          clearCart(); // Clear the cart after placing the order
            navigate('/thankyou')
          }
        if (paymentMethod === 'esewa') {
          const paymentResponse = await axios.post(`${BASE_URL}/api/initialize-esewa`, {
            orderId: placedOrder._id,
            totalPrice: placedOrder.price,
          });
          if (paymentResponse.data.success) {
            setPaymentDetails(paymentResponse.data);
          } else {
            alert('Failed to fetch payment details');
          }
        }
        } else {
          alert('Failed to place order');
        }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    }
  };

  const handlePayNow = () => {
    if (!paymentDetails) {
      alert('Payment details are not available.');
      return;
    }
  
    // Create a form element
    const form = document.createElement('form');
    form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
    form.method = 'POST';
  
    // Add hidden inputs to the form
    const inputs = [
      { name: 'amount', value: paymentDetails.purchasedItemData.price },
      { name: 'tax_amount', value: '0' },
      { name: 'total_amount', value: paymentDetails.purchasedItemData.price },
      { name: 'transaction_uuid', value: paymentDetails.purchasedItemData._id },
      { name: 'product_code', value: 'EPAYTEST' },
      { name: 'product_service_charge', value: '0' },
      { name: 'product_delivery_charge', value: '0' },
      { name: 'success_url', value: `${BASE_URL}/api/complete-payment` },
      { name: 'failure_url', value: 'https://pantonenp.com/checkout' },
      { name: 'signature', value: paymentDetails.payment.signature },
      { name: 'signed_field_names', value: paymentDetails.payment.signed_field_names }
    ];
  
    inputs.forEach(input => {
      const hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      hiddenInput.name = input.name;
      hiddenInput.value = input.value;
      form.appendChild(hiddenInput);
    });
  
    // Append the form to the body and submit it
    document.body.appendChild(form);
    form.submit();
  };
  

  const handleCancelOrder = async () => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/orders/${orderid}`);
      if (response.status === 200) {
        alert('Order cancelled successfully');
        setOrderPlaced(false); // Reset the state to show the Place Order button again
        setOrderid(null); // Clear the order ID
      } else {
        alert('Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order');
    }
  };

  return (
    <div className='checkout-container'>
      <button className='back-btn' onClick={() => navigate(-1)}><FaArrowAltCircleLeft /></button>
      <div className='order-summary'>
        <h3>Order Summary</h3>
        <div className='order-item-container'>
          {cartItems.map((item, index) => (
            <div key={index} className='order-item'>
              <img src={`${BASE_URL}/${item.image}`} alt={item.name} />
              <p>{item.name}</p>
              <p>color: {item.color} Size: {item.size} Qty: {item.quantity}</p>
              <p>Rs.{calculateItemTotal(item.price, item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className='order-total'>
          <h4>Total: Rs.{grandTotal}</h4>
        </div>
      </div>
      <div className='checkout-left-content'>
        {user ? (
          <div className='user-details'>
            <h1>Your details, {user.username}</h1>
            <p><strong>User ID:</strong> {user._id}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Phone:</strong> {user.phonenumber}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Address:</strong> {user.address}</p>
            <p><strong>Delivery Charge:</strong> Rs.2</p>
          </div>
        ) : (
          <p>Loading user details...</p>
        )}
        {!orderPlaced && (
          <div className='payment-method'>
            <h3>Payment Method</h3>
            <label>
              <input
                type='radio'
                value='Cash in hand'
                checked={paymentMethod === 'Cash in hand'}
                onChange={() => setPaymentMethod('Cash in hand')}
              />
              Cash in hand
            </label>
            <label>
              <input
                type='radio'
                value='esewa'
                checked={paymentMethod === 'esewa'}
                onChange={() => setPaymentMethod('esewa')}
              />
              eSewa
            </label>
          </div>
        )}
        <div className='checkout-actions'>
          {!orderPlaced ? (
            <button className='place-order-btn' onClick={handlePlaceOrder}>Place Order</button>
          ) : (
            <div className='cancel-order'>
              <button className='place-order-btn' onClick={handleCancelOrder}>Cancel Order</button>
              {paymentMethod === 'esewa' && (
                <button className='place-order-btn' onClick={ handlePayNow }>Pay Now</button>
              )}
            </div>
          )}
        </div>
      </div>
      {/* <div className='initailize-details'> 
        {paymentDetails ? (
          <div>
            <h3>eSewa Payment Details</h3>
            <p><strong>Signature:</strong> {paymentDetails.payment.signature}</p>
            <p><strong>Signed Field Names:</strong> {paymentDetails.payment.signed_field_names}</p>
            <p><strong>Order ID:</strong> {paymentDetails.purchasedItemData._id}</p>
            <p><strong>Price:</strong> Rs.{paymentDetails.purchasedItemData.price}</p>
          </div>
        ) : (
          <p>No payment details available.</p>
        )}
      </div> */}
    </div>
  );
};

export default Checkout;
