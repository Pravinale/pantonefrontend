import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowAltCircleLeft } from "react-icons/fa";
import './AdminPanel.css';
import axios from 'axios';

const AdminPanel = () => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];

    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        subcategory: '',
        colors: [
            { 
                color: '', 
                images: { image1: null, image2: null, image3: null }, 
                sizes: [{ size: 'S', stock: 0 }] 
            },
        ],
    });

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [subcategories, setSubcategories] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/categories`);
                setCategories(response.data);
            } catch (error) {
                console.error('Failed to fetch categories', error);
            }
        };

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value,
        });
    };

    const handleColorChange = (index, e) => {
        const { name, value } = e.target;
        const newColors = [...product.colors];
        newColors[index][name] = value;
        setProduct({
            ...product,
            colors: newColors,
        });
    };

    const handleImageChange = (colorIndex, imageName, e) => {
        const file = e.target.files[0];
        const newColors = [...product.colors];
        newColors[colorIndex].images[imageName] = file;
        setProduct({
            ...product,
            colors: newColors,
        });
    };

    const handleSizeChange = (colorIndex, sizeIndex, e) => {
        const { name, value } = e.target;
        const newColors = [...product.colors];
        newColors[colorIndex].sizes[sizeIndex][name] = value;
        setProduct({
            ...product,
            colors: newColors,
        });
    };

    const addColor = () => {
        setProduct({
            ...product,
            colors: [...product.colors, { color: '', images: { image1: null, image2: null, image3: null }, sizes: [{ size: 'S', stock: 0 }] }],
        });
    };

    const removeColor = (index) => {
        const newColors = [...product.colors];
        newColors.splice(index, 1);
        setProduct({
            ...product,
            colors: newColors,
        });
    };

    const addSize = (index) => {
        const newColors = [...product.colors];
        const selectedSizes = newColors[index].sizes.map(size => size.size);
        const availableSizes = AVAILABLE_SIZES.filter(size => !selectedSizes.includes(size));

        if (availableSizes.length > 0) {
            newColors[index].sizes.push({ size: availableSizes[0], stock: 0 });
            setProduct({
                ...product,
                colors: newColors,
            });
        } else {
            alert('All available sizes have been selected');
        }
    };

    const removeSize = (colorIndex, sizeIndex) => {
        const newColors = [...product.colors];
        newColors[colorIndex].sizes.splice(sizeIndex, 1);
        setProduct({
            ...product,
            colors: newColors,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', product.name);
            formData.append('description', product.description);
            formData.append('price', product.price);
            formData.append('category', product.category);
            formData.append('subcategory', product.subcategory);
            formData.append('colors', JSON.stringify(product.colors.map(color => ({
                color: color.color,
                sizes: color.sizes,
            })))); // Only send color name and sizes in JSON

            // Append each image from each color to FormData
            product.colors.forEach((color, index) => {
                if (color.images.image1) {
                    formData.append(`colorImages-${index}-image1`, color.images.image1);
                }
                if (color.images.image2) {
                    formData.append(`colorImages-${index}-image2`, color.images.image2);
                }
                if (color.images.image3) {
                    formData.append(`colorImages-${index}-image3`, color.images.image3);
                }
            });

            const response = await axios.post(`${BASE_URL}/api/products`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                alert('Product created successfully');
                setProduct({
                    name: '',
                    description: '',
                    price: '',
                    category: '',
                    subcategory: '',
                    colors: [
                        { color: '', images: { image1: null, image2: null, image3: null }, sizes: [{ size: 'S', stock: 0 }] },
                    ],
                });
            }
        } catch (err) {
            console.error(err);
            alert('Failed to create product');
        }
    };

    return (
        <div className='admin-container'>
            <button className='back-btn' onClick={() => navigate(-1)}><FaArrowAltCircleLeft /></button>
            <div className='details-container'>
                <Link to='/alladmins'><button>All Admins</button></Link>
                <Link to='/allusers'><button>All Users</button></Link>
                <Link to='/allproducts'><button>All Products</button></Link>
                <Link to='/orders'><button>Orders</button></Link>
                <Link to='/ondelivery'><button>On Delivery</button></Link>
                <Link to='/deliveredorders'><button>Delivered Orders</button></Link>
            </div>

            <div className='product-form-container'>
                <h2>Create Product</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Product Name</label>
                        <input
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={product.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Price</label>
                        <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                       <label>Category</label>
                       <select
                            name="category"
                            value={product.category}
                            onChange={(e) => {
                                handleChange(e);
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
                                value={product.subcategory}
                                onChange={handleChange}
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
                    {product.colors.map((color, colorIndex) => (
                        <div key={colorIndex} className='color-section'>
                            <h3>Color {colorIndex + 1}</h3>
                            <div>
                                <label>Color Name</label>
                                <input
                                    type="text"
                                    name="color"
                                    value={color.color}
                                    onChange={(e) => handleColorChange(colorIndex, e)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Image 1</label>
                                <input
                                    type="file"
                                    id={`colorImage-${colorIndex}-image1`}
                                    onChange={(e) => handleImageChange(colorIndex, 'image1', e)}
                                    accept="image/*"
                                />
                            </div>
                            <div>
                                <label>Image 2</label>
                                <input
                                    type="file"
                                    id={`colorImage-${colorIndex}-image2`}
                                    onChange={(e) => handleImageChange(colorIndex, 'image2', e)}
                                    accept="image/*"
                                />
                            </div>
                            <div>
                                <label>Image 3</label>
                                <input
                                    type="file"
                                    id={`colorImage-${colorIndex}-image3`}
                                    onChange={(e) => handleImageChange(colorIndex, 'image3', e)}
                                    accept="image/*"
                                />
                            </div>
                            <div>
                                <label>Sizes</label>
                                {color.sizes.map((size, sizeIndex) => (
                                    <div key={sizeIndex}>
                                        <select
                                            name="size"
                                            value={size.size}
                                            onChange={(e) => handleSizeChange(colorIndex, sizeIndex, e)}
                                            required
                                        >
                                            {AVAILABLE_SIZES.map((availableSize) => (
                                                <option key={availableSize} value={availableSize}>
                                                    {availableSize}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="number"
                                            name="stock"
                                            value={size.stock}
                                            onChange={(e) => handleSizeChange(colorIndex, sizeIndex, e)}
                                            required
                                            min="0"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeSize(colorIndex, sizeIndex)}
                                            disabled={color.sizes.length === 1}
                                        >
                                            Remove Size
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => addSize(colorIndex)}>
                                    Add Size
                                </button>
                            </div>
                            <button type="button" onClick={() => removeColor(colorIndex)}>
                                Remove Color
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addColor}>
                        Add Color
                    </button>
                    <button type="submit">Add Product</button>
                </form>
            </div>
            <div className='details-container'>
            <Link to='/trendings'><button>Trending Products</button></Link>
             <Link to='/allcategory'><button>Manage Category</button></Link>
            </div>
        </div>
    );
};

export default AdminPanel;
