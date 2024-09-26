import React, { useState, useEffect } from 'react';
import './Category.css';
import Product from '../Product/Product';
import SingleProductPage from '../SingleProductPage/SingleProductPage';
import { useNavigate } from 'react-router-dom';
import { FaArrowAltCircleLeft, FaSearch } from "react-icons/fa";

const Category = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedImages, setSelectedImages] = useState({});
  const [expandedColor, setExpandedColor] = useState({});
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const navigate = useNavigate();

  

  // Fetch categories on mount
  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/categories`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
  
    fetchCategories();
  }, [BASE_URL]);
  
  useEffect(() => {
    // Fetch products based on selected category or all products if no category selected
    fetchProductsBySubcategory(selectedCategoryId);
  }, [selectedCategoryId, BASE_URL]);
  

  // Fetch products by subcategory
  const fetchProductsBySubcategory = async (subcategoryId) => {
    try {
      const url = subcategoryId ? `${BASE_URL}/api/products/subcategory/${subcategoryId}` : `${BASE_URL}/api/products`;
      const response = await fetch(url);
      const contentType = response.headers.get('Content-Type');
  
      if (response.ok) {
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          if (data && Array.isArray(data)) {
            setProducts(data);
            setFilteredProducts(data); // Initial filtering
            const defaultImages = {};
  
            data.forEach(product => {
              const defaultColor = product.colors[0]?.color;
              if (defaultColor) {
                const defaultImage = product.colors.find(colorGroup => colorGroup.color === defaultColor)?.image;
                if (defaultImage) {
                  defaultImages[product._id] = defaultImage;
                }
              }
            });
  
            setSelectedImages(defaultImages);
          } else {
            console.error('Unexpected data format:', data);
          }
        } else {
          console.error('Expected JSON response, but got:', contentType);
        }
      } else {
        // Handle HTTP error responses
        const errorData = await response.json();
        console.error('Error fetching products by subcategory:', errorData.message);
      }
    } catch (error) {
      console.error('Error fetching products by subcategory:', error);
    }
  };

  // Fetch products when a subcategory is selected
  useEffect(() => {
    if (selectedCategoryId) {
      fetchProductsBySubcategory(selectedCategoryId);
    }
  }, [selectedCategoryId, BASE_URL]);

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
    setSelectedProductId(productId); 
  };

  const handleCloseSingleProductPage = () => {
    setSelectedProductId(null); 
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const executeSearch = () => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    
    const singularize = (word) => {
      if (word.endsWith('s')) {
        return word.slice(0, -1);
      }
      return word;
    };
    
    if (trimmedQuery) {
      const singularQuery = singularize(trimmedQuery);
      const filtered = products.filter(product => {
        const productName = product.name.toLowerCase().trim();
        const productDescription = product.description.toLowerCase().trim();
        return productName.includes(trimmedQuery) ||
               productDescription.includes(trimmedQuery) ||
               productName.includes(singularQuery) ||
               productDescription.includes(singularQuery);
      });
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  const handleSearchClick = () => {
    executeSearch();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  const handlePriceChange = (e) => {
    setPriceRange([0, parseInt(e.target.value)]);
  };

  // Filter products by search query and price range
  useEffect(() => {
    const filtered = products.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);
    setFilteredProducts(filtered);
  }, [products, searchQuery, priceRange]);

  const handleMouseEnter = (category) => {
    setHoveredCategory(category);
  };
  
  const handleMouseLeave = () => {
    setHoveredCategory(null);
  };

  const handleSubcategoryClick = (subcategoryId) => {
    setSelectedCategoryId(subcategoryId); // Set the selected subcategory ID
    setHoveredCategory(null); // Hide the subcategory dropdown
  };

  return (
    <div className='Category-container'>
      <button className='back-btn' onClick={() => navigate(-1)}><FaArrowAltCircleLeft /></button>
      <div className='category-section'>
        <div className='category-search-bar'>
          <input
            type='text'
            placeholder='Search Product'
            value={searchQuery}
            onChange={handleSearchChange} 
            onKeyDown={handleKeyDown}
          />
          <button className='category-search-icon' onClick={handleSearchClick}><FaSearch /></button>
        </div>
  
        <div className='price-filter'>
          <label htmlFor='price-range'>Price Range: {priceRange[0]} - {priceRange[1]}</label>
          <input
            type='range'
            id='price-range'
            min='0'
            max={maxPrice}
            value={priceRange[1]}
            onChange={handlePriceChange}
          />
        </div>
  
        <h1>Select Category</h1>
        <ul>
          <li 
            onClick={() => setSelectedCategoryId(null)} 
            className={selectedCategoryId === null ? 'selected-category' : ''}
          >
            All
          </li>
          {categories.map((category) => (
            <li 
              key={category._id}
              onMouseEnter={() => handleMouseEnter(category)}
              onMouseLeave={handleMouseLeave}
              className={selectedCategoryId === category._id ? 'selected-category' : ''}
            >
              {category.name}
              {hoveredCategory?._id === category._id && (
                <div className='subcategory-dropdown'>
                  <ul>
                    {category.subcategories?.map(subcategory => (
                      <li 
                        key={subcategory._id} 
                        onClick={() => handleSubcategoryClick(subcategory._id)}
                      >
                        {subcategory.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      
      <div className='category-results'>
      {console.log('Filtered Products:', filteredProducts)}
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
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
          <p>{selectedCategoryId === null ? 'No products available.' : 'No products found.'}</p>
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
    </div>
  );
  
};

export default Category;






