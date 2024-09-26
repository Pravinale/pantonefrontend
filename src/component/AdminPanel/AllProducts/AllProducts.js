import React, { useState, useEffect } from 'react';
import './AllProducts.css';
import { useNavigate } from 'react-router-dom';
import { FaArrowAltCircleLeft } from "react-icons/fa";
import pluralize from 'pluralize';

const AllProducts = () => {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    colors: []
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/products`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };




    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/categories`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, [BASE_URL]);

      // Fetch subcategories when a category is selected
      useEffect(() => {
        const fetchSubcategories = async () => {
            if (selectedCategory) {
                try {
                    const category = categories.find(cat => cat.name === selectedCategory);
                    if (category) {
                        setSubcategories(category.subcategories);
                    }
                } catch (error) {
                    console.error('Failed to fetch subcategories', error);
                }
            }
        };

        fetchSubcategories();
    }, [selectedCategory, categories]);


    const handleCategoryChange = (e) => {
      setSelectedCategory(e.target.value);
      setProductForm(prevForm => ({
        ...prevForm,
        category: e.target.value,
        subcategory: '' // Reset subcategory when category changes
      }));
      setSelectedSubcategory(''); // Reset subcategory selection
    };
  
    const handleSubcategoryChange = (e) => {
      setSelectedSubcategory(e.target.value);
      setProductForm(prevForm => ({
        ...prevForm,
        subcategory: e.target.value
      }));
    };


  const categoryMap = categories.reduce((map, category) => {
    map[category._id] = category.name;
    return map;
  }, {});

  const handleEditClick = async (productId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/products/${productId}`);
      const data = await response.json();
      setProductForm(data);
      setEditingProduct(productId);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleColorChange = (index, e) => {
    const { name, value } = e.target;
    const updatedColors = [...productForm.colors];
    updatedColors[index] = {
      ...updatedColors[index],
      [name]: value
    };
    setProductForm({ ...productForm, colors: updatedColors });
  };

  const handleSizeChange = (colorIndex, sizeIndex, e) => {
    const { name, value } = e.target;
    const updatedColors = [...productForm.colors];
    updatedColors[colorIndex].sizes[sizeIndex] = {
      ...updatedColors[colorIndex].sizes[sizeIndex],
      [name]: value
    };
    setProductForm({ ...productForm, colors: updatedColors });
  };

  const removeColor = (index) => {
    setProductForm(prevState => ({
      ...prevState,
      colors: prevState.colors.filter((_, i) => i !== index)
    }));
  };

  const addSize = (colorIndex) => {
    const updatedColors = [...productForm.colors];
    updatedColors[colorIndex].sizes.push({ size: '', stock: '' });
    setProductForm({ ...productForm, colors: updatedColors });
  };

  const removeSize = (colorIndex, sizeIndex) => {
    const updatedColors = [...productForm.colors];
    updatedColors[colorIndex].sizes = updatedColors[colorIndex].sizes.filter((_, i) => i !== sizeIndex);
    setProductForm({ ...productForm, colors: updatedColors });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('description', productForm.description);
      formData.append('price', productForm.price);
      formData.append('category', productForm.category);
      formData.append('subcategory', productForm.subcategory); // Include subcategory
      formData.append('colors', JSON.stringify(productForm.colors));

      const response = await fetch(`${BASE_URL}/api/products/${editingProduct}`, {
        method: 'PUT',
        body: formData
      });
      const data = await response.json();
      setProducts(prevProducts => prevProducts.map(p => p._id === editingProduct ? data : p));
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteClick = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`${BASE_URL}/api/products/${productId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setProducts(prevProducts => prevProducts.filter(p => p._id !== productId));
        } else {
          console.error('Failed to delete product:', response.statusText);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };


const normalizeText = (text) => {
  // Convert to lowercase and remove extra spaces
  let normalizedText = text.toLowerCase().trim();

  // Handle pluralization cases
  normalizedText = pluralize.singular(normalizedText); // Convert to singular form

  return normalizedText;
};

  const filteredProducts = products.filter(product => {
    const normalizedProductName = normalizeText(product.name);
    const normalizedSearchTerm = normalizeText(searchTerm);
  
    return (
      normalizedProductName.includes(normalizedSearchTerm) &&
      (!showOutOfStock || product.colors.some(color => color.sizes.some(size => size.stock === 0))) &&
      (!selectedSubcategory || product.subcategory === selectedSubcategory)
    );
  });

  console.log(filteredProducts)




  return (
    <div className="all-products-container">
      <button className='back-btn' onClick={() => navigate(-1)}><FaArrowAltCircleLeft /></button>
      <input
        type="text"
        placeholder="Search by product name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <div className='category-filter-container'>
        <div className="category-filters">
            <div className="filter-category">
                      <label>Category</label>
                      <select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
            </div>
            {selectedCategory && (
              <div className="filter-subcategory">
                        <label>Subcategory</label>
                        <select
                          value={selectedSubcategory}
                          onChange={handleSubcategoryChange}
                        >
                          <option value="">Select Subcategory</option>
                          {subcategories.map((subcategory) => (
                            <option key={subcategory._id} value={subcategory._id}>
                              {subcategory.name}
                            </option>
                          ))}
                        </select>
              </div>
            )}
        </div>

      <button className='outofstock' onClick={() => setShowOutOfStock(!showOutOfStock)}>
        {showOutOfStock ? 'Show All Products' : 'Show Out Of Stock'}
      </button>
      </div>
      {editingProduct ? (
        <div className='product-form-container'>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                value={productForm.name}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label>Description</label>
              <textarea
                name="description"
                value={productForm.description}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={productForm.price}
                onChange={handleFormChange}
                required
              />
            </div>

            <div>
                <label>Category</label>
                <select
                    name="category"
                    value={productForm.category}
                    onChange={(e) => {
                      handleFormChange(e);
                        setSelectedCategory(e.target.value);
                    }}
                    required
                >
                    <option value="" disabled>Select Category</option>
                    {categories.map((category) => (
                        <option key={category._id} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                </select>
              </div>
                {selectedCategory && (
                    <div>
                        <label>Subcategory</label>
                        <select
                             name="subcategory"
                            value={productForm.subcategory}
                            onChange={handleFormChange}
                            required
                        >
                            <option value="" disabled>Select Subcategory</option>
                            {subcategories.map((subcategory) => (
                                <option key={subcategory._id} value={subcategory._id}>
                                    {subcategory.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
             {productForm.colors.map((color, colorIndex) => (
              <div key={colorIndex}>
                <h4>Color {colorIndex + 1}</h4>
                <label>Color Name</label>
                <input
                  type="text"
                  name="color"
                  value={color.color}
                  onChange={(e) => handleColorChange(colorIndex, e)}
                  required
                />
                {color.sizes.map((size, sizeIndex) => (
                  <div key={sizeIndex}>
                    <label>Size</label>
                    <select
                      name="size"
                      value={size.size}
                      onChange={(e) => handleSizeChange(colorIndex, sizeIndex, e)}
                      required
                    >
                      <option value="">Select a size</option>
                      {['S', 'M', 'L', 'XL', 'XXL','3XL'].map(sizeOption => (
                        <option key={sizeOption} value={sizeOption}>
                          {sizeOption}
                        </option>
                      ))}
                    </select>
                    <label>Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={size.stock}
                      onChange={(e) => handleSizeChange(colorIndex, sizeIndex, e)}
                      required
                    />
                    {color.sizes.length > 1 && (
                      <button type="button" onClick={() => removeSize(colorIndex, sizeIndex)}>
                        Remove Size
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addSize(colorIndex)}>
                  Add Size
                </button>
                {productForm.colors.length > 1 && (
                  <button type="button" onClick={() => removeColor(colorIndex)}>
                    Remove Color
                  </button>
                )}
              </div>
            ))}
            <button type="submit">Update</button>
            <button type="button" onClick={() => setEditingProduct(null)}>Cancel</button>
          </form>
        </div>
      ) : (
        <>
          {filteredProducts.length > 0 ? (
            <div className='all-products-table'>
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Color</th>
                  <th>Sizes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product._id}>
                    <td>
                    {product.colors.length > 0 && product.colors[0].images.length > 0 && (
                      <img
                        src={`${BASE_URL}/${product.colors[0].images[0]}`}
                        alt={product.name}
                        className="product-image"
                      />
                    )}   
                    </td>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>{product.price}</td>
                    <td>
                      {product.colors.map((colorGroup, index) => (
                        <div key={index}>{colorGroup.color}</div>
                      ))}
                    </td>
                    <td>
                      {product.colors.map((colorGroup, index) => (
                        <div key={index}>
                          {colorGroup.sizes.map((sizeGroup, sizeIndex) => (
                            <span key={sizeIndex} style={{ marginRight: '10px' }}>
                              {sizeGroup.size}: {sizeGroup.stock}
                            </span>
                          ))}
                        </div>
                      ))}
                    </td>
                    <td>
                      <button className='edit-btn' onClick={() => handleEditClick(product._id)}>
                        Edit
                      </button>
                      <button className='delete-btn' onClick={() => handleDeleteClick(product._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          ) : (
            <p>No products available.</p>
          )}
        </>
      )}
    </div>
  );
};

export default AllProducts;


