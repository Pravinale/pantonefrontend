import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AllUsers.css';
import { useNavigate } from 'react-router-dom';
import { FaArrowAltCircleLeft } from "react-icons/fa";

const AllUsers = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [role, setRole] = useState('user');

  useEffect(() => {
    // Fetch users from the backend
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/users`); // Adjust the endpoint if needed
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [BASE_URL]);

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };


  const handleEdit = async (userId) => {
    try {
      await axios.patch(`${BASE_URL}/api/users/update-role/${userId}`, { role });
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role } : user
      ));
      setEditingUserId(null);
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  // Function to handle delete
  // const handleDelete = async (userId) => {
  //   try {
  //     await axios.delete(`${BASE_URL}/api/users/${userId}`);
  //     setUsers(users.filter(user => user._id !== userId));
  //   } catch (error) {
  //     console.error('Error deleting user:', error);
  //   }
  // };



  return (
    <div className="all-users-container">
      <button className='back-btn' onClick={() => navigate(-1)}><FaArrowAltCircleLeft /></button> 
      <h1>All Users</h1>
      <div className="users-table">
      <table >
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
        {users.length > 0 ? (
            users.map(user => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phonenumber}</td>
                <td>{user.address}</td>
                <td>
                  {editingUserId === user._id ? (
                    <select
                      value={role}
                      onChange={handleRoleChange}
                    >
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td>
                  {editingUserId === user._id ? (
                    <>
                      <button onClick={() => handleEdit(user._id)}>Save</button>
                      <button onClick={() => setEditingUserId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { setEditingUserId(user._id); setRole(user.role); }}>Edit</button>
                      {/* <button onClick={() => handleDelete(user._id)}>Delete</button> */}
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

export default AllUsers;
