import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext'; // Import the custom hook
import './Login.css'

const Login = () => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setIsAuthenticated, setUserRole, setUserId } = useAuth(); // Get set functions
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        console.log(BASE_URL)
        e.preventDefault();

        try {
            const response = await axios.post(`${BASE_URL}/api/users/login`, {
                username,
                password
            });

            if (response.status === 200) {
                const { user, userId } = response.data; // Destructure userId from the response

                // Store user details and authentication status
                localStorage.setItem('userRole', user.role); // Store user role
                localStorage.setItem('userId', userId); // Store user ID
                setIsAuthenticated(true);
                setUserRole(user.role); // Update auth state with user role
                setUserId(userId); // Update auth state with user ID

                // Redirect to the user's dashboard with user ID in the URL
                navigate(`/home/${userId}`);
            } else {
                alert(response.data.message || 'Login failed. Please try again.');
            }
        } catch (err) {
            console.error('Error during login:', err);
            alert(err.response?.data?.message || 'An error occurred during login. Please try again.');
        }
    };

    return (
        <div className='login-container'>
            <form className='login-form' onSubmit={handleLogin}>
                <h1>Login</h1>
                <div className='login-content'>
                    <h3>Username</h3>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className='login-content'>
                    <h3>Password</h3>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
                <div className='forgot-password'>
                    <Link to='/forgot-password'>Forgot Password?</Link>
                </div>
                <div className='haveaccount'>
                    Don't have an account? <span><Link to='/signup'>Sign Up</Link></span>
                </div>
            </form>
        </div>
    );
};

export default Login;
