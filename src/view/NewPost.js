import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import './NewPost.css';

const NewPost = () => {
  const [postName, setPostName] = useState('');
  const [postType, setPostType] = useState('');
  const [serviceOrTool, setServiceOrTool] = useState('');
  const [neededBy, setNeededBy] = useState('');
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');

  const navigate = useNavigate();
  const { authState } = useAuth();

  useEffect(() => {
    const fetchNeighborhoods = async () => {
      if (!authState.userId) return; // Check if userId is available
  
      try {
        const response = await axios.get(`http://localhost:5000/user-neighborhoods/${authState.userId}`);
        // Wrap the returned neighborhood object in an array
        setNeighborhoods([response.data]);
      } catch (error) {
        console.error('Failed to fetch neighborhoods:', error);
      }
    };
  
    if (authState.userId) {
      fetchNeighborhoods();
    }
  }, [authState.userId]);
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    const postData = {
      postName,
      postType,
      serviceOrTool,
      neededBy,
      userId: authState.userId,
      neighborhood: selectedNeighborhood,
    };

    try {
      await axios.post('http://localhost:5000/create-post', postData);
      alert('Post created successfully!');
      navigate('/feed'); // Navigate back to the feed page
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create the post.');
    }
  };

  return (
  

  <div className="newpost-page-background">
    
    <div className="new-post-container">
      <h1>New Post</h1>
      <form onSubmit={handleSubmit}>
        {/* Post Name */}
        <div className="form-group">
          <label>Post Name:</label>
          <input
            type="text"
            value={postName}
            onChange={(e) => setPostName(e.target.value)}
          />
        </div>
        {/* Post Type */}
        <div className="form-group">
          <label>Type:</label>
          <select
            value={postType}
            onChange={(e) => setPostType(e.target.value)}
          >
            <option value="">Select...</option>
            <option value="service">Service</option>
            <option value="tool">Tool</option>
          </select>
        </div>
        {/* Service or Tool Needed */}
        <div className="form-group">
          <label>Service/Tool in need of:</label>
          <input
            type="text"
            value={serviceOrTool}
            onChange={(e) => setServiceOrTool(e.target.value)}
          />
        </div>
        {/* Needed By Date */}
        <div className="form-group">
          <label>Needed By:</label>
          <input
            type="date"
            value={neededBy}
            onChange={(e) => setNeededBy(e.target.value)}
          />
        </div>
        {/* Neighborhood Dropdown */}
        <div className="form-group">
          <label>Neighborhood:</label>
          <select
            value={selectedNeighborhood}
            onChange={(e) => setSelectedNeighborhood(e.target.value)}
            required
          >
            <option value="">Select a Neighborhood</option>
            {Array.isArray(neighborhoods) && neighborhoods.map((neighborhood) => (
              <option key={neighborhood._id} value={neighborhood._id}>
                {neighborhood.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="submit-button">
          Submit Post
        </button>
      </form>
    </div>
  </div>
  );
};

export default NewPost;