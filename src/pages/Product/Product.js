import React, { useState, useEffect } from 'react';
import './Product.css';

const Product = ({ product, selectedImage, BASE_URL, onProductClick }) => {
  const [mainImage, setMainImage] = useState(selectedImage);

  useEffect(() => {
    // Set the main image to the first image of the default color when the component mounts
    if (product.colors.length > 0) {
      const defaultColor = product.colors[0].color;
      setMainImage(product.colors.find(colorGroup => colorGroup.color === defaultColor)?.images[0]);
    }
  }, [product]);


    const handleProductClick = () => {
    onProductClick(product._id); // Notify Home component
  };

  return (
    <div className='product-card' onClick={() => onProductClick(product._id)}>
      <div className='product-img'>
           <img
          src={`${BASE_URL}/${mainImage}`}
          alt={product.name}
          onClick={handleProductClick}
        />
      </div>
      <div className='product-content'>
         <h1>{product.name}</h1>
         <p>Rs.<span>{product.price}</span></p>
      </div>
      <button className='view-more-btn' onClick={handleProductClick}>VIEW DETAILS</button>
    </div>
  );
};

export default Product;

