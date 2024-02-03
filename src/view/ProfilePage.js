import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import './ProfilePage.css';

const ProfilePage = ({ userInfo, getUserInfo, setUserInfo }) => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [isModified, setIsModified] = useState(false);
  const { authState } = useAuth();
  const { userId } = useAuth();
  // Fetch user data
  console.log(authState.userId);
  useEffect(() => {
    const fetchUserData = async () => {
      if (!authState || !authState.userId) {
        console.error('No user ID available');
        return;
      }
      try {
        console.log(" User id profile: " + authState.userId);
        const response = await axios.get(`http://localhost:5000/profile/${authState.userId}`);
        
        if (response.status === 200) {
          setUserInfo(response.data);
        }
      } catch (error) {
        // Handle errors
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleEditSubmit = async (event) => {
    event.preventDefault();
  
    const form = formRef.current;
  
    const newFirstname = form.elements.firstname.value;
    const newLastname = form.elements.lastname.value;
    const newAge = form.elements.age.value;
    const newAddress = form.elements.address.value;
  
    console.log("Submitting data:", { newFirstname, newLastname, newAge, newAddress });
  
    try {
      const response = await axios.put(`http://localhost:5000/profile/${authState.userId}`, {
        firstName: newFirstname,
        lastName: newLastname,
        age: newAge,
        address: newAddress,
      });
  
      if (response.status === 200) {
        console.log("Data successfully updated:", response.data);
        setUserInfo(response.data);
        navigate('/feed');
      } else {
        console.error("Failed to update data:", response);
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <form ref={formRef} onSubmit={handleEditSubmit}>
        <label htmlFor="firstname">First Name:</label>
        <input type="text" id="firstname" name="firstname" defaultValue={userInfo.firstName} />
        <label htmlFor="lastname">Last Name:</label>
        <input type="text" id="lastname" name="lastname" defaultValue={userInfo.lastName} />
        <label htmlFor="age">Age:</label>
        <input type="number" id="age" name="age" defaultValue={userInfo.age} />
        <label htmlFor="address">Address:</label>
        <input type="text" id="address" name="address" defaultValue={userInfo.address} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ProfilePage;
