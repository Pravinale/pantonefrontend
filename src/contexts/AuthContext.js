import React, { createContext, useState, useContext, useEffect } from 'react';

// Create AuthContext
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null); // Add state for user role
    const [userId, setUserId] = useState(null); // Add state for user ID

    // Check if the user is authenticated (e.g., by checking a token in local storage)
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedUserRole = localStorage.getItem('userRole');
        
        if (storedUserId && storedUserRole) {
            setIsAuthenticated(true);
            setUserRole(storedUserRole);
            setUserId(storedUserId);
        } else {
            setIsAuthenticated(false);
            setUserRole(null);
            setUserId(null);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userRole, setUserRole, userId, setUserId }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
