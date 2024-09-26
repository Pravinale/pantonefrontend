import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AllCategory.css';
import { useNavigate } from 'react-router-dom';
import { FaArrowAltCircleLeft } from "react-icons/fa";

const AllCategory = () => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [newSubcategory, setNewSubcategory] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingSubcategory, setEditingSubcategory] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/categories`);
                setCategories(response.data);
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };

        fetchCategories();
    }, [BASE_URL]);

    const handleCategoryChange = (e) => {
        setNewCategory(e.target.value);
    };

    const handleSubcategoryChange = (e) => {
        setNewSubcategory(e.target.value);
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/api/categories`, { name: newCategory });
            setNewCategory('');
            const response = await axios.get(`${BASE_URL}/api/categories`);
            setCategories(response.data);
            alert('Category created successfully');
        } catch (err) {
            console.error('Error creating category:', err);
            alert('Failed to create category');
        }
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setNewCategory(category.name);
    };

    const handleUpdateCategory = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${BASE_URL}/api/categories/${editingCategory._id}`, { name: newCategory });
            setNewCategory('');
            setEditingCategory(null);
            const response = await axios.get(`${BASE_URL}/api/categories`);
            setCategories(response.data);
            alert('Category updated successfully');
        } catch (err) {
            console.error('Error updating category:', err);
            alert('Failed to update category');
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/api/categories/${id}`);
            const response = await axios.get(`${BASE_URL}/api/categories`);
            setCategories(response.data);
            alert('Category deleted successfully');
        } catch (err) {
            console.error('Error deleting category:', err);
            alert('Failed to delete category');
        }
    };

    const handleAddSubcategory = async (categoryId) => {
        try {
            await axios.post(`${BASE_URL}/api/categories/${categoryId}/subcategories`, { name: newSubcategory });
            setNewSubcategory('');
            const response = await axios.get(`${BASE_URL}/api/categories`);
            setCategories(response.data);
            alert('Subcategory added successfully');
        } catch (err) {
            console.error('Error adding subcategory:', err);
            alert('Failed to add subcategory');
        }
    };

    const handleEditSubcategory = (category, subcategory) => {
        setEditingSubcategory(subcategory);
        setSelectedCategory(category);
        setNewSubcategory(subcategory.name);
    };

    const handleUpdateSubcategory = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${BASE_URL}/api/categories/${selectedCategory._id}/subcategories/${editingSubcategory._id}`, { name: newSubcategory });
            setNewSubcategory('');
            setEditingSubcategory(null);
            setSelectedCategory(null);
            const response = await axios.get(`${BASE_URL}/api/categories`);
            setCategories(response.data);
            alert('Subcategory updated successfully');
        } catch (err) {
            console.error('Error updating subcategory:', err);
            alert('Failed to update subcategory');
        }
    };

    const handleDeleteSubcategory = async (categoryId, subcategoryId) => {
        try {
            await axios.delete(`${BASE_URL}/api/categories/${categoryId}/subcategories/${subcategoryId}`);
            const response = await axios.get(`${BASE_URL}/api/categories`);
            setCategories(response.data);
            alert('Subcategory deleted successfully');
        } catch (err) {
            console.error('Error deleting subcategory:', err.response ? err.response.data : err.message);
            alert('Failed to delete subcategory');
        }
    };

    const handleCancelSubcategory = () => {
        setNewSubcategory('');
        setEditingSubcategory(null);
        setSelectedCategory(null);
    };

    return (
        <div className='category-container'>
            <button className='back-btn' onClick={() => navigate(-1)}><FaArrowAltCircleLeft /></button>
            <h2>Manage Categories</h2>
            <div className='category-management'>
                <form className='category-form' onSubmit={editingCategory ? handleUpdateCategory : handleCategorySubmit}>
                    <input
                        type="text"
                        value={newCategory}
                        onChange={handleCategoryChange}
                        placeholder="Enter category name"
                        required
                    />
                    <button type="submit">
                        {editingCategory ? 'Update Category' : 'Add Category'}
                    </button>
                </form>
                
                <ul className='main-categories'>
                    {categories.map(category => (
                        <li key={category._id}>
                            {category.name}
                            <div>
                                <button onClick={() => handleEditCategory(category)}>Edit</button>
                                <button className='delete-btn' onClick={() => handleDeleteCategory(category._id)}>Delete</button>
                                <button onClick={() => setSelectedCategory(category)}>Add Subcategories</button>
                            </div>
                            {selectedCategory && selectedCategory._id === category._id && (
                                <div className='subcategory-management'>
                                    <h3>Add Subcategories for {category.name}</h3>
                                    <form className='sub-category-form' onSubmit={editingSubcategory ? handleUpdateSubcategory : (e) => { e.preventDefault(); handleAddSubcategory(category._id); }}>
                                        <input
                                            type="text"
                                            value={newSubcategory}
                                            onChange={handleSubcategoryChange}
                                            placeholder="Enter subcategory name"
                                            required
                                        />
                                        <button type="submit">
                                            {editingSubcategory ? 'Update Subcategory' : 'Add Subcategory'}
                                        </button>
                                        <button type="button" onClick={handleCancelSubcategory}>Cancel</button>
                                    </form>
                                </div>
                            )}
                            <ul className='sub-category-container'>
                                {category.subcategories.map(subcategory => (
                                    <li key={subcategory._id}>
                                        {subcategory.name}
                                        <div>
                                            <button onClick={() => handleEditSubcategory(category, subcategory)}>Edit</button>
                                            <button className='delete-btn' onClick={() => handleDeleteSubcategory(category._id, subcategory._id)}>Delete</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AllCategory;
