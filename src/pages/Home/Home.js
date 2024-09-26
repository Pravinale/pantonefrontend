import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
import Product from '../Product/Product';
import SingleProductPage from '../SingleProductPage/SingleProductPage'; // Import the SingleProductPage component
import logo2 from '../../assets/logo2.png';
import { FaSearch } from 'react-icons/fa';
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import movingimage1 from '../../assets/img1.jpg';
import movingimage2 from '../../assets/img2.jpg';
import movingimage3 from '../../assets/img3.jpeg';
import movingimage4 from '../../assets/img4.jpg';
import movingimage5 from '../../assets/img5.jpg';


const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedImages, setSelectedImages] = useState({});
  const [expandedColor, setExpandedColor] = useState({});
  const [selectedProductId, setSelectedProductId] = useState(null); // New state for selected product
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [trendingProducts, setTrendingProducts] = useState([]);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/products`);
        const allProducts = response.data;
        // Randomly select 8 products
        const selectedProducts = allProducts.sort(() => 0.5 - Math.random()).slice(0, 8);
        setProducts(selectedProducts);
        setFilteredProducts(selectedProducts); // Initialize filteredProducts

        const defaultImages = {};
        response.data.forEach(product => {
          const defaultColor = product.colors[0]?.color;
          if (defaultColor) {
            const defaultImage = product.colors.find(colorGroup => colorGroup.color === defaultColor)?.image;
            if (defaultImage) {
              defaultImages[product._id] = defaultImage;
            }
          }
        });
        setSelectedImages(defaultImages);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [BASE_URL]);

  // Function to filter products based on the search query

  const filterProducts = () => {
    // Trim the search query to remove any leading or trailing spaces
    const trimmedQuery = searchQuery.trim().toLowerCase();
    
    // Function to handle basic pluralization (you can expand this as needed)
    const singularize = (word) => {
      if (word.endsWith('s')) {
        return word.slice(0, -1); // Handle simple plural to singular (e.g., "jacket" to "jackets")
      }
      return word;
    };
    
    if (trimmedQuery) {
      const singularQuery = singularize(trimmedQuery);
      const results = products.filter(product => {
        const productName = product.name.toLowerCase().trim();
        const productDescription = product.description.toLowerCase().trim();
        // const singularName = singularize(productName);
        return productName.includes(trimmedQuery) ||
               productDescription.includes(trimmedQuery) ||
               productName.includes(singularQuery) ||
               productDescription.includes(singularQuery);
      });
      setFilteredProducts(results);
    } else {
      setFilteredProducts(products);
    }
  };

  const handleColorClick = (productId, color) => {
    const selectedProduct = products.find(product => product._id === productId);
    const selectedColorGroup = selectedProduct.colors.find(colorGroup => colorGroup.color === color);

    if (selectedColorGroup) {
      setSelectedImages({
        ...selectedImages,
        [productId]: selectedColorGroup.image
      });

      setExpandedColor(prevState => ({
        ...prevState,
        [productId]: prevState[productId] === color ? null : color
      }));
    }
  };

  const handleProductClick = (productId) => {
    setSelectedProductId(productId); // Set the selected product ID
  };

  const handleCloseSingleProductPage = () => {
    setSelectedProductId(null); // Clear the selected product ID
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update search query state
  };

  const handleSearchClick = () => {
    filterProducts();
  };

  // useEffect(() => {
  //   filterProducts();
  // }, [searchQuery]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      filterProducts();
    }
  };

    useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/trending`);
        setTrendingProducts(response.data);
      } catch (error) {
        console.error('Error fetching trending products:', error);
      }
    };

    fetchTrendingProducts();
  }, [BASE_URL]);

  return (
    <div className='home-container'>
      <div className='hero-img'>
        <div className="overlay-content">
          <img src={logo2} alt='Logo' />
          <h1>Elevating your wardrobe with timeless pieces, 
            trend-setting styles, and unmatched comfort—because 
            you deserve to look and feel your best, every day
          </h1>
          <Link to='/category'><button>Shop Now</button></Link>
        </div>
      </div>
      <div className='upper-product-container'>
        <div className='search-container'>
        <input
          type='text'
          placeholder='Search Product'
          value={searchQuery}
          onChange={handleSearchChange} 
          onKeyDown={handleKeyDown}
        />
        <button className='search-icon' onClick={handleSearchClick}><FaSearch /></button>
      </div>
        <Link to='/category'><button className='shop-now-btn'>SHOP NOW<MdKeyboardDoubleArrowRight className='shop-icon'/></button></Link>
      </div>
      <div className='product-container'>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Product
              key={product._id}
              product={product}
              selectedImage={selectedImages[product._id]}
              handleColorClick={handleColorClick}
              expandedColor={expandedColor[product._id]}
              BASE_URL={BASE_URL}
              onProductClick={handleProductClick} 
            />
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
      {selectedProductId && (
        <div className='single-product-overlay'>
          <SingleProductPage 
            productId={selectedProductId} 
            onClose={handleCloseSingleProductPage} 
          />
        </div>
      )}

      <div className='hero-section2'>
      </div>

      <div className='trending-container'>
        <h1>LATEST COLLECTIONS </h1>
        <div className='trending-products'>
            {trendingProducts.length > 0 ? (
                trendingProducts.map(product => (
                  <div key={product._id} className='product-card'>
                    <div className='product-img'>
                      <img src={`${BASE_URL}/uploads/${product.image}`} alt={product.name} />
                    </div>
                    <div className='product-content'>
                      <h1>{product.name}</h1>
                      <p>Rs.{product.price}</p>
                    </div>
                    <Link to='/category'><button className='view-more-btn' >SHOP NOW</button></Link>
                  </div>
                ))
              ) : (
                <p>No trending products available</p>
              )}
        </div>
      </div>

      <div className="moving-images">
        <img src={movingimage1} alt='movingimage1'/>
        <img src={movingimage2} alt='movingimage2'/>
        <img src={movingimage3} alt='movingimage3'/>
        <img src={movingimage4} alt='movingimage4'/>
        <img src={movingimage5} alt='movingimage5'/>
        <img src={movingimage1} alt='movingimage1'/>
      </div>

      <div className='hero-section1'>
        <div className="hero-section1-content">
          <div className="hero-item">
            <h2>Shipping All Over Nepal</h2>
            <p>It elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
          </div>
          <div className="hero-item">
            <h2>Best Quality</h2>
            <p>It elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
          </div>
          <div className="hero-item">
            <h2>Best Offers</h2>
            <p>It elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
          </div>
          <div className="hero-item">
            <h2>Secure Payments</h2>
            <p>It elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
