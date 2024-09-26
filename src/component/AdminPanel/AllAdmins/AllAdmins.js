import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AllAdmins.css';
import { useNavigate } from 'react-router-dom';
import { FaArrowAltCircleLeft } from "react-icons/fa";

const AllAdmins = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [admins, setAdmins] = useState([]);
  const navigate = useNavigate();
  const [editingUserId, setEditingUserId] = useState(null);
  const [role, setRole] = useState('user');


  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/users/admins`); // Adjust this URL if needed
        setAdmins(response.data);
      } catch (error) {
        console.error('Error fetching admins:', error);
      }
    };

    fetchAdmins();
  }, [BASE_URL]);


  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleEdit = async (userId) => {
    try {
      await axios.patch(`${BASE_URL}/api/users/update-role/${userId}`, { role });
      setAdmins(admins.map(admin => 
        admin._id === userId ? { ...admin, role } : admin
      ));
      setEditingUserId(null);
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`${BASE_URL}/api/users/delete-user/${userId}`);
      setAdmins(admins.filter(admin => admin._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="all-admins-container">
       <button className='back-btn' onClick={() => navigate(-1)}><FaArrowAltCircleLeft /></button> 
      <h1>All Admins</h1>
      <div className='admin-table'>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.length > 0 ? (
            admins.map(admin => (
              <tr key={admin._id}>
                <td>{admin._id}</td>
                <td>{admin.username}</td>
                <td>{admin.email}</td>
                <td>{admin.phonenumber}</td>
                <td>{admin.address}</td>
                <td>
                  {editingUserId === admin._id ? (
                    <select
                      value={role}
                      onChange={handleRoleChange}
                    >
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </select>
                  ) : (
                    admin.role
                  )}
                </td>
                <td>
                  {editingUserId === admin._id ? (
                    <>
                      <button onClick={() => handleEdit(admin._id)}>Save</button>
                      <button onClick={() => setEditingUserId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { setEditingUserId(admin._id); setRole(admin.role); }}>Edit</button>
                      <button onClick={() => handleDelete(admin._id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No admins found</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

    </div>
  );
};

export default AllAdmins;
