import React, { useState, useEffect } from 'react';
import './DeliveredOrders.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowAltCircleLeft } from "react-icons/fa";

const DeliveredOrders = () => {
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        const fetchDeliveredOrders = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/orders/delivered`);
                // Sort orders by purchaseDate in descending order
                const sortedOrders = response.data.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
                setOrders(sortedOrders);
            } catch (error) {
                console.error('Error fetching delivered orders:', error);
            }
        };

        fetchDeliveredOrders();
    }, [BASE_URL]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredOrders = orders.filter((order) => 
        order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='deliveredOrders-container'>
            <button className='back-btn' onClick={() => navigate(-1)}><FaArrowAltCircleLeft /></button>
            <h1>Delivered Orders</h1>
            <div className='search-container'>
            <input 
                type="text" 
                placeholder="Search by Order ID or Phone Number" 
                value={searchQuery} 
                onChange={handleSearchChange} 
                className='deliveredOrders-search-input'
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
                                            <div className='product-content'>
                                                Color: {product.color} - Size: {product.size} - Qty: {product.quantity}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <p><strong>Price:</strong> {order.price}</p>
                                <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                                <p><strong>Payment Status:</strong> {order.status}</p>
                                <p><strong>Delivery Status:</strong> {order.deliveryStatus}</p>
                                <p><strong>Purchase Date:</strong> {new Date(order.purchaseDate).toLocaleString()}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No delivered orders found</p>
                )}
            </div>
        </div>
    );
};

export default DeliveredOrders;
