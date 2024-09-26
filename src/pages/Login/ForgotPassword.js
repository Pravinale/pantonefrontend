import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css'

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleRequestReset = async (e) => {
        e.preventDefault();

        try {
            await axios.post(`${process.env.REACT_APP_BASE_URL}/api/users/forgot-password`, { email });
            alert('Check your email for the password reset link');
        } catch (err) {
            console.error('Error during password reset request:', err);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className='forgot-password-container'>
            <form className='forgot-password-form' onSubmit={handleRequestReset}>
                <h1>Forgot Password</h1>
                <div className='forgot-password-content'>
                    <h3>Email</h3>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Request Password Reset</button>
            </form>
        </div>
    );
};

export default ForgotPassword;
