import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Trendings.css';
import { FaArrowAltCircleLeft } from "react-icons/fa";

const Trendings = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    image: null
  });



  useEffect(() => {
    fetchTrendingProducts();
  }, []);

  const fetchTrendingProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/trending`);
      setTrendingProducts(response.data);
    } catch (error) {
      console.error('Error fetching trending products:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    setNewProduct({ ...newProduct, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('category', newProduct.category);
    formData.append('description', newProduct.description);
    formData.append('price', newProduct.price);
    formData.append('image', newProduct.image);

    try {
      if (editingProduct) {
        await axios.put(`${BASE_URL}/api/trending/${editingProduct._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setEditingProduct(null);
      } else {
        await axios.post(`${BASE_URL}/api/trending`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      fetchTrendingProducts();
      setNewProduct({
        name: '',
        category: '',
        description: '',
        price: '',
        image: null
      });
    } catch (error) {
      console.error('Error saving trending product:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      image: null // Keep this null initially
    });
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`${BASE_URL}/api/trending/${productId}`);
      fetchTrendingProducts(); // Refresh the product list after deletion
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  

  return (
    <div className='trendings-container'>
      <button className='back-btn' onClick={() => navigate(-1)}><FaArrowAltCircleLeft /></button>
      <h2>Trending Products</h2>
      <form onSubmit={handleSubmit} className='trending-form'>
        <input
          type='text'
          name='name'
          placeholder='Name'
          value={newProduct.name}
          onChange={handleInputChange}
          required
        />
        <input
          type='text'
          name='category'
          placeholder='Category'
          value={newProduct.category}
          onChange={handleInputChange}
          required
        />
        <textarea
          name='description'
          placeholder='Description'
          value={newProduct.description}
          onChange={handleInputChange}
          required
        />
        <input
          type='number'
          name='price'
          placeholder='Price'
          value={newProduct.price}
          onChange={handleInputChange}
          required
        />
        <input
          type='file'
          name='image'
          onChange={handleImageChange}
          required={!editingProduct}
        />
        <button type='submit'>{editingProduct ? 'Update' : 'Add'} Trending Product</button>
      </form>

      <div className='trending-products-list'>
        {trendingProducts.length > 0 ? (
          trendingProducts.map(product => (
            <div key={product._id} className='trending-product'>
              <img src={`${BASE_URL}/uploads/${product.image}`} alt={product.name} />
              <h3>{product.name}</h3>
              {/* <p>{product.category}</p>
              <p>{product.description}</p> */}
              <p>Rs.{product.price}</p>
              <button className='trending-edit-btn' onClick={() => handleEdit(product)}>Edit</button>
              <button className='trending-delete-btn' onClick={() => handleDelete(product._id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No trending products available</p>
        )}
      </div>
    </div>
  );
};

export default Trendings;
