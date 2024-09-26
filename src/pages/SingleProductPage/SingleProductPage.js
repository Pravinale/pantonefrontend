import React, { useEffect, useState, useContext } from 'react';
import './SingleProductPage.css';
import { CartContext } from '../../contexts/CartContext';

const SingleProductPage = ({ productId, onClose }) => {
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [stockQuantity, setStockQuantity] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State for current image index
  const { addToCart, cartItems } = useContext(CartContext);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    fetch(`${BASE_URL}/api/products/${productId}`)
      .then(response => response.json())
      .then(data => {
        setProduct(data);
        if (data.colors.length > 0) {
          const defaultColor = data.colors[0].color;
          setSelectedColor(defaultColor);
          const defaultSize = data.colors[0].sizes[0]?.size;
          setSelectedSize(defaultSize);

          const defaultColorGroup = data.colors.find(colorGroup => colorGroup.color === defaultColor);
          const defaultSizeGroup = defaultColorGroup?.sizes.find(sizeGroup => sizeGroup.size === defaultSize);
          setStockQuantity(defaultSizeGroup?.stock || 0);
        }
      })
      .catch(error => console.error('Error fetching product:', error));
  }, [productId, BASE_URL]);

  useEffect(() => {
    if (product && selectedColor && selectedSize) {
      const colorGroup = product.colors.find(colorGroup => colorGroup.color === selectedColor);
      const sizeGroup = colorGroup?.sizes.find(sizeGroup => sizeGroup.size === selectedSize);
      setStockQuantity(sizeGroup?.stock || 0);
    }
  }, [selectedColor, selectedSize, product]);

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert('Please select both color and size.');
      return;
    }

    const cartProduct = cartItems.find(
      item => item._id === product._id && item.color === selectedColor && item.size === selectedSize
    );

    const quantityInCart = cartProduct ? cartProduct.quantity : 0;

    if (quantityInCart + 1 > stockQuantity) {
      alert('Not enough stock left');
      return;
    }

    const productToAdd = {
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.colors.find(colorGroup => colorGroup.color === selectedColor)?.images[0], // Take the first image as the main image
      color: selectedColor,
      size: selectedSize,
    };

    addToCart(productToAdd);
    alert("Product Added To Cart");
  };

  const handleNextImage = () => {
    const colorGroup = product.colors.find(colorGroup => colorGroup.color === selectedColor);
    if (colorGroup) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % colorGroup.images.length);
    }
  };

  const handlePreviousImage = () => {
    const colorGroup = product.colors.find(colorGroup => colorGroup.color === selectedColor);
    if (colorGroup) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + colorGroup.images.length) % colorGroup.images.length);
    }
  };

  if (!product) return <p>Loading...</p>;

  const colorGroup = product.colors.find(colorGroup => colorGroup.color === selectedColor);
  const currentImage = colorGroup?.images[currentImageIndex];

  return (
    <div className='single-product-page'>
      <button className='close-btn' onClick={onClose}>Close</button>
      <div className='product-images'>
        {colorGroup?.images.length > 0 && (
          <>
            <img src={`${BASE_URL}/${currentImage}`} alt={`Product ${currentImageIndex}`} />
            <div className='image-btn'>
                <button className='prev-btn' onClick={handlePreviousImage}>Prev</button>
                <button className='next-btn' onClick={handleNextImage}>Next</button>
            </div>
          </>
        )}
      </div>

      <div className='single-product-page-right'>
        <h1>{product.name}</h1>
        <h3 className='price'>Rs.{product.price}</h3>
        <p className='desc'>{product.description}</p>
        <div className='color-options'>
          {product.colors.map((colorGroup, index) => (
            <button
              key={index}
              className={`color-button ${selectedColor === colorGroup.color ? 'active' : ''}`}
              onClick={() => setSelectedColor(colorGroup.color)}
            >
              {colorGroup.color}
            </button>
          ))}
        </div>
        {selectedColor && (
          <div className='sizes-list'>
            {product.colors.find(colorGroup => colorGroup.color === selectedColor)?.sizes.map((size, index) => (
              <div
                key={index}
                className={`size-item ${selectedSize === size.size ? 'selected' : ''}`}
                onClick={() => setSelectedSize(size.size)}
              >
                <p>{size.size}</p>
              </div>
            ))}
          </div>
        )}
        <div className='add-to-cart'>
          {stockQuantity > 0 ? (
            <button onClick={handleAddToCart}>Add To Cart</button>
          ) : (
            <p>Out of Stock</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
