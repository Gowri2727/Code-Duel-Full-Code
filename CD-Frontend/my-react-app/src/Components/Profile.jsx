import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../App';
import '../Styles/Profile.css';

const Profile = () => {
  const { currentUser, setPage ,setCurrentUser} = useAppContext();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchUserData();
  }, []);
const handleLogout = () => {
    setCurrentUser(null); 
    setPage('login');
  };
  const fetchUserData = async () => {
    try {
      if (currentUser && currentUser.fullName) {
        setUserProfile(currentUser);
        setFormData(currentUser);
        setLoading(false);
        return;
      }
      if (currentUser && currentUser.email) {
        const response = await axios.get(`http://localhost:5002/api/profile/${currentUser.email}`);
        setUserProfile(response.data);
        setFormData(response.data);
      } else if (typeof currentUser === 'string') {
        const response = await axios.get(`http://localhost:5002/api/profile/${currentUser}`);
        setUserProfile(response.data);
        setFormData(response.data);
      } else {
        console.error('No user data available');
        alert('No user session found. Please login again.');
        setPage('login');
        return;
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response && error.response.status === 404) {
        alert('User profile not found. Please login again.');
        setPage('login');
      } else {
        alert('Error loading profile data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      const email = currentUser?.email || currentUser;
      await axios.put(`http://localhost:5002/api/profile/update/${email}`, formData);
      setUserProfile(formData);
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleBack = () => {
    setPage('home');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <p>No profile data found</p>
        <button onClick={handleBack}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="profile-container" style={{ maxWidth: '600px', margin: '20px auto', padding: '20px' }}>
      <h2>User Profile</h2>
      
      {!editing ? (
        <div className="profile-view">
          <div className="profile-field">
            <strong>Full Name:</strong> {userProfile.fullName}
          </div>
          <div className="profile-field">
            <strong>Email:</strong> {userProfile.email}
          </div>
          <div className="profile-field">
            <strong>College:</strong> {userProfile.college}
          </div>
          <div className="profile-field">
            <strong>Roll Number:</strong> {userProfile.rollNo}
          </div>
          <div className="profile-field">
            <strong>Location:</strong> {userProfile.location}
          </div>
          <div className="profile-field">
            <strong>Year:</strong> {userProfile.year}
          </div>
          <div className="profile-field">
            <strong>Preferred Language:</strong> {userProfile.language}
          </div>
          
          <div className="profile-actions">
            <button onClick={() => setEditing(true)} className="edit-btn">
              Edit Profile
            </button>
            <button onClick={handleBack} className="back-btn">
              Back to Home
            </button>
          </div>
        </div>
      ) : (
        <div className="profile-edit">
          <div className="form-group">
            <label>Full Name:</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label>College:</label>
            <input
              type="text"
              name="college"
              value={formData.college || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label>Roll Number:</label>
            <input
              type="text"
              name="rollNo"
              value={formData.rollNo || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={formData.location || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label>Year:</label>
            <input
              type="text"
              name="year"
              value={formData.year || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label>Preferred Language:</label>
            <select
              name="language"
              value={formData.language || ''}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="Java">Java</option>
              <option value="Python">Python</option>
            </select>
          </div>
          
          <div className="profile-actions">
            <button onClick={handleSave} className="save-btn">
              Save Changes
            </button>
            <button onClick={() => setEditing(false)} className="cancel-btn">
              Cancel
            </button>
          </div>
          
        </div>
        
      )}
       <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
    </div>
    
  );
};

export default Profile;