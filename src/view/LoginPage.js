import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import './LoginPage.css';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(username, password);
      alert('Login successful!');
      navigate('/feed');
    } catch (error) {
      alert('Login failed: Invalid username or password.');
    }
  };

  return (
    
  <div className="login-page-background">
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-container">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div className="input-container">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="submit-container">
          <button type="submit" className="login-button">Login</button>
          <Link to="/create-account" className="create-account-link">Create an Account</Link>
        </div>
      </form>
    </div>
  </div>
 
  );
}

export default LoginPage;
