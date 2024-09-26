import React, { useState, useEffect } from 'react';
import './OnDelivery.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowAltCircleLeft } from "react-icons/fa";

const OnDelivery = () => {
    const [orders, setOrders] = useState([]);
    const [editOrderId, setEditOrderId] = useState(null);
    const [editedOrder, setEditedOrder] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        const fetchInProgressOrders = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/orders/delivery/in-progress`);
                console.log(response.data); 
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching in-progress orders:', error);
            }
        };

        fetchInProgressOrders();
    }, [BASE_URL]);

    const handleEditClick = (order) => {
        setEditOrderId(order._id);
        setEditedOrder(order);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedOrder((prevOrder) => ({
            ...prevOrder,
            [name]: value,
        }));
    };

    const handleSaveClick = async (orderId) => {
        try {
            const response = await axios.put(`${BASE_URL}/api/orders/${orderId}`, editedOrder);
            setOrders((prevOrders) => prevOrders.map((order) => (order._id === orderId ? response.data : order)));
            setEditOrderId(null);
            setEditedOrder({});
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredOrders = orders.filter(
        (order) => {
            // Filtering criteria: 'Cash in hand' orders and others with 'completed' status
            const isCashInHand = order.paymentMethod === 'Cash in hand';
            const isCompletedPayment = order.paymentMethod !== 'Cash in hand' && order.status === 'completed';
            const matchesSearchQuery =
                order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase());

                return (isCashInHand || isCompletedPayment) && matchesSearchQuery;

        }
    );

    return (
        <div className='ondelivery-container'>
            <button className='back-btn' onClick={() => navigate(-1)}><FaArrowAltCircleLeft /></button>
            <h1>In Progress Orders</h1>
            <div className='search-container'>
            <input
                type='text'
                placeholder='Search by Order ID or Phone Number'
                value={searchQuery}
                onChange={handleSearchChange}
                className='ondelivery-search-input'
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
                                <p><strong>Status:</strong> {order.status}</p>
                                <p><strong>Purchase Date:</strong> {new Date(order.purchaseDate).toLocaleString()}</p>
                                <p className='deliveryStatus'>
                                    <strong>Delivery Status:</strong>
                                    {editOrderId === order._id ? (
                                        <select
                                            name='deliveryStatus'
                                            value={editedOrder.deliveryStatus}
                                            onChange={handleInputChange}
                                        >
                                            <option value='in progress'>In Progress</option>
                                            <option value='completed'>Completed</option>
                                        </select>
                                    ) : (
                                        <span>{order.deliveryStatus}</span>
                                    )}
                                    {order.paymentMethod === 'Cash in hand' && (
                                        <>
                                            <p><strong>Payment Status:</strong></p>
                                            {editOrderId === order._id ? (
                                                <select
                                                    name='status'
                                                    value={editedOrder.status}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value=''>Select Payment Status</option>
                                                    <option value='pending'>Pending</option>
                                                    <option value='completed'>Completed</option>
                                                </select>
                                            ) : (
                                                <span>{order.status}</span>
                                            )}
                                        </>
                                    )}
                                    {editOrderId === order._id ? (
                                        <button onClick={() => handleSaveClick(order._id)}>Save</button>
                                    ) : (
                                        <button onClick={() => handleEditClick(order)}>Edit</button>
                                    )}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No orders in progress found</p>
                )}
            </div>
        </div>
    );
};

export default OnDelivery;
