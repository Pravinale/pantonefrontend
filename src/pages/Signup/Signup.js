import React, { useState } from 'react';
import './Signup.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


const SignUp = () => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const [username, setUsername] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
    
        if (!username || !phonenumber || !address || !email || !password) {
            alert('Please fill in all fields');
            return;
        }
    
        try {
            const response = await axios.post(`${BASE_URL}/api/users/register`, {
                username,
                phonenumber,
                address,
                email,
                password
            });
    
            if (response.status === 200) {
                alert('Account Created Successfully! Please check your email to activate your account.');
                setUsername('');
                setPhonenumber('');
                setAddress('');
                setEmail('');
                setPassword('');
                navigate('/login');
            } else {
                alert(response.data.message || 'Failed to create account. Please try again.');
            }
        } catch (err) {
            console.error('Error during sign up:', err);
            alert(err.response?.data?.message || 'An error occurred during sign up. Please try again.');
        }
    };
    

    return (
        <div className='signup-container'>
            <form className='form' onSubmit={handleSignUp}>
                <h1>Sign Up</h1>

                <div className='form-body'>
                    <div className='form-content'>
                        <h3>Username</h3>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className='form-content'>
                        <h3>Phone Number</h3>
                        <input
                            type="text"
                            placeholder="Phone Number"
                            value={phonenumber}
                            onChange={(e) => setPhonenumber(e.target.value)}
                        />
                    </div>

                    <div className='form-content'>
                        <h3>Address</h3>
                        <input
                            type="text"
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    <div className='form-content'>
                        <h3>Email Address</h3>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className='form-content'>
                        <h3>Password</h3>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <button type='submit'>Sign Up</button>

                <div className='haveaccount'>Already have an account? <span><Link to='/login'>Login</Link></span></div>
            </form>
        </div>
    );
};

export default SignUp;

