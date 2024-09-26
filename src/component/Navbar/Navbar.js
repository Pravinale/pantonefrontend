import React, { useState, useContext } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext'; 
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa'; // Import FaTimes for close icon
import Logo from '../../assets/logo2.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { cartItems } = useContext(CartContext);
  const { isAuthenticated, userRole, setIsAuthenticated, setUserRole } = useAuth(); 

  // Calculate total quantity
  const totalQuantity = Array.isArray(cartItems)
    ? cartItems.reduce((acc, item) => acc + item.quantity, 0)
    : 0;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    localStorage.removeItem('authToken'); 
    localStorage.removeItem('userRole');
    setIsAuthenticated(false); 
    setUserRole(null); 
  };

  return (
    <div className='navbar-container'>
      <Link to='/'><img src={Logo} alt='Logo' className='logo-img' /></Link>
      


      <div className={`navlinks ${isMenuOpen ? 'active' : ''}`}>
        <ul>
          <Link to='/' onClick={() => setIsMenuOpen(false)}><li>HOME</li></Link>
          <Link to='/category' onClick={() => setIsMenuOpen(false)}><li>SHOP</li></Link>
          <Link to='/about' onClick={() => setIsMenuOpen(false)}><li>ABOUT</li></Link>
          {isAuthenticated && (
            <Link to='/dashboard' onClick={() => setIsMenuOpen(false)}><li>DASHBOARD</li></Link>
          )}
          {isAuthenticated && userRole === 'admin' && (
            <Link to='/admin' onClick={() => setIsMenuOpen(false)}><li>ADMIN</li></Link>
          )}
          <div className='login-signin'>
          {!isAuthenticated ? (
            <ul>
              <Link to='/login' onClick={() => setIsMenuOpen(false)}><li>LOGIN</li></Link>
              <Link to='/signup' onClick={() => setIsMenuOpen(false)}><li>SIGN UP</li></Link>
            </ul>
          ) : (
            <Link to='/logout' onClick={() => setIsMenuOpen(false)}>
              <li onClick={handleLogout}>LOGOUT</li>
            </Link>
          )}
        </div>
        </ul>
      </div>

      <div className='cart'>
      <div className='menu-icon' onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes className='burger-icon' /> : <FaBars className='burger-icon' />}
      </div>
        <Link to='/cart'>
          <FaShoppingCart className='cart-icon' />
          {totalQuantity > 0 && (
            <span className='cart-quantity'>{totalQuantity}</span>
          )}
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
