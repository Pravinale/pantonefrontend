import React, { useState, useEffect } from 'react';
import './Orders.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowAltCircleLeft } from "react-icons/fa";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/orders`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [BASE_URL]);


  useEffect(() => {
    // Filter orders based on search query
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = orders.filter(order =>
      (order.orderId.toLowerCase().includes(lowercasedQuery) ||
      order.phoneNumber.toLowerCase().includes(lowercasedQuery)) &&
      (order.paymentMethod === 'Cash in hand' || order.status === 'completed')
    );
    // Sort orders by purchaseDate in descending order
    const sorted = filtered.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
    setFilteredOrders(sorted);
  }, [searchQuery, orders]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className='orders-container'>
      <button className='back-btn' onClick={() => navigate(-1)}><FaArrowAltCircleLeft /></button>
      <h1>Orders</h1>
      <div className='search-container'>
        <input
          type='text'
          placeholder='Search by Order ID or Phone Number'
          value={searchQuery}
          onChange={handleSearchChange}
          className='orders-search-input'
        />
      </div>
      <div className='orders-list'>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order._id} className='order-card'>
              <div className='order-details'>
                <p><strong>Order ID:</strong> {order.orderId}</p>
                <p><strong>User ID:</strong> {order.userId}</p>
                <p><strong>Username:</strong> {order.username}</p>
                <p><strong>Phone Number:</strong> {order.phoneNumber}</p>
                <p><strong>Email:</strong> {order.email}</p>
                <p><strong>Address:</strong> {order.address}</p>
                <p><strong>Products:</strong></p>
                <ul>
                  {order.products.map((product, index) => (
                    <li key={index} className='product-item'>
                      <img
                        src={product.image ? `${BASE_URL}/${product.image}` : 'default-image-url'}
                        alt=''
                      />
                      <p>{product.name}</p>
                      <div className='product-content'>
                        Color: {product.color} - Size: {product.size} - Qty: {product.quantity}
                      </div>
                    </li>
                  ))}
                </ul>
                <p><strong>Total Price:</strong> {order.price}</p>
                <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Purchase Date:</strong> {new Date(order.purchaseDate).toLocaleString()}</p>
                <p><strong>Delivery Status:</strong> {order.deliveryStatus}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No orders found</p>
        )}
      </div>
    </div>
  );
};

export default Orders;



