import React from 'react';
import './Footer.css';
import Symbol from '../../assets/Symbol.png';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='footer-container'>
        <div className='footer-section'>
          <h3>About Us</h3>
          <p>We are a leading e-commerce platform offering a wide range of products to meet all your needs. Our goal is to provide an excellent shopping experience with great customer service.</p>
        </div>
        <div className='footer-section'>
          <h3>Quick Links</h3>
          <ul>
            <li><a href='/about'>About Us</a></li>
            <li><a href='/contact'>Contact Us</a></li>
            <li><a href='/terms'>Terms of Service</a></li>
            <li><a href='/privacy'>Privacy Policy</a></li>
          </ul>
        </div>
        <div className='footer-section'>
          <h3>Contact Us</h3>
          <p>Email: pantone116116@gmail.com</p>
          <p>Phone: +977 9705116116</p>
          <p>Address:  Kathmandu, Nepal</p>
        </div>
        <div className='footer-section'>
          <h3>Follow Us</h3>
          <div className='social-icons'>
            <a href='https://www.facebook.com/pantone.np' target='_blank' rel='noopener noreferrer'><FaFacebookF /></a>
            <a href='https://www.instagram.com/pantone_np' target='_blank' rel='noopener noreferrer'><FaInstagram /></a>
            <a href='https://twitter.com' target='_blank' rel='noopener noreferrer'><FaTwitter /></a>
            <a href='https://linkedin.com' target='_blank' rel='noopener noreferrer'><FaLinkedinIn /></a>
          </div>
        </div>
      </div>
      <div className='footer-bottom'>
        <img src={Symbol} alt='logo'/>
        <p>&copy; 2024 PANTONE. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
