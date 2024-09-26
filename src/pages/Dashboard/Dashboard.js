import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import { FaArrowAltCircleLeft } from "react-icons/fa";

const UserDashboard = () => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        phonenumber: '',
        address: '',
        email: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const storedUserId = localStorage.getItem('userId') || userId;
                const response = await axios.get(`${BASE_URL}/api/users/me/${storedUserId}`);
                setUser(response.data);
                setFormData({
                    username: response.data.username,
                    phonenumber: response.data.phonenumber,
                    address: response.data.address,
                    email: response.data.email
                });
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        const fetchUserOrders = async () => {
            try {
                const storedUserId = localStorage.getItem('userId') || userId;
                const response = await axios.get(`${BASE_URL}/api/orders/user/${storedUserId}`);
                const sortedOrders = response.data.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
                console.log('Fetched orders:', sortedOrders);
                setOrders(sortedOrders);
            } catch (error) {
                console.error('Error fetching user orders:', error);
            }
        };

        fetchUserDetails();
        fetchUserOrders();
    }, [userId, BASE_URL]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        try {
            const storedUserId = localStorage.getItem('userId') || userId;
            const response = await axios.put(`${BASE_URL}/api/users/update/${storedUserId}`, formData);
            setUser(response.data.user);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating user details:', error);
        }
    };

    const filteredOrders = orders.filter(order =>
        order.paymentMethod === 'Cash in hand' ||
        (order.paymentMethod !== 'Cash in hand' && order.status === 'completed')
    );

    return (
        <div className='dashboard-container'>
            <button className='back-btn' onClick={() => navigate(-1)}><FaArrowAltCircleLeft /></button>
            {user ? (
                <>
                    <div className='profile-details'>
                        <h1>Welcome, {user.username}</h1>
                        {isEditing ? (
                            <div className='user-detail-form'>
                                <div className='input'>
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='input'>
                                    <label>Phone Number</label>
                                    <input
                                        type="text"
                                        name="phonenumber"
                                        value={formData.phonenumber}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='input'>
                                    <label>Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='input'>
                                    <label>Email</label>
                                    <input
                                        type="text"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='action'>
                                    <button onClick={handleSave}>Save</button>
                                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                                </div>
                                <div className='google-map'> 
                                </div>
                            </div>
                        ) : (
                            <div className='user-detail-container'>
                                <div className='user-detail'>
                                    <p><strong>User ID:</strong> {user._id}</p>
                                    <p><strong>Username:</strong> {user.username}</p>
                                    <p><strong>Phone Number:</strong> {user.phonenumber}</p>
                                    <p><strong>Email:</strong> {user.email}</p>
                                </div>
                                <div className='user-address'>
                                    <h1>Address for delivery</h1>
                                    <p><strong>Address:</strong> {user.address}</p>
                                </div>
                                <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                            </div>
                        )}
                    </div>
                    <div className='user-orders-container'>
                        <h1>My Orders</h1> 
                        <div className='user-orders'>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map(order => (
                                    <div key={order._id} className='my-order-item'>
                                        <h4>Order ID: {order.orderId}</h4>
                                        <p><strong>Total Price:</strong> Rs.{order.price}</p>
                                        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                                        <p><strong>Status:</strong> {order.status}</p>
                                        <p><strong>Delivery Status:</strong> {order.deliveryStatus}</p>
                                        <div className='products'>
                                            {order.products.map(product => {
                                                const productId = product.productId;
                                                return (
                                                    <div key={productId?._id} className='product-item'>
                                                        <img
                                                            className='user-orders-img'
                                                            src={product.image ? `${BASE_URL}/${product.image}` : 'default-image-url'} alt='' />
                                                        <p className='user-product-name'>{product.name}</p>
                                                        <div className='user-orders-content'>
                                                            <p>Color: {product.color}</p>
                                                            <p>Size: {product.size}</p>
                                                            <p>Qty: {product.quantity}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No orders found.</p>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default UserDashboard;


