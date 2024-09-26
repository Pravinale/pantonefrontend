import React, { useState } from 'react';
import './ResetPassword.css'
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const { token } = useParams(); // Get the token from the URL

    const handleResetPassword = async (e) => {
        e.preventDefault();

        try {
            await axios.post(`${process.env.REACT_APP_BASE_URL}/api/users/reset-password`, { token, newPassword });
            alert('Password has been reset successfully');
        } catch (err) {
            console.error('Error during password reset:', err);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className='reset-password-container'>
            <form className='reset-password-form' onSubmit={handleResetPassword}>
                <h1>Reset Password</h1>
                <div className='reset-password-content'>
                    <h3>New Password</h3>
                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPassword;
