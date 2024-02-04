import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import './CreateNeighborhood.css';

const CreateNeighborhood = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { authState } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:5000/create-neighborhood', {
        name,
        userId: authState.userId,
      });
      alert('Neighborhood created successfully!');
      navigate('/feed');
    } catch (error) {
      console.error('Failed to create neighborhood:', error);
      alert('Failed to create the neighborhood.');
    }
  };

  return (
    <div className="create-neighborhood-container">
      <div className="back-button-container">
        <Link to="/feed" className="back-button">&#8592; Back</Link>
      </div>
      <div className="form-container">
        <h1>Create New Neighborhood</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name"></label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Neighborhood Name"
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Create Neighborhood
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateNeighborhood;