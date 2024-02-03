import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';
import './FeedPage.css';

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const { authState } = useAuth();
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
        const fetchPosts = async () => {
          if (!authState.userId) return; 
    
          try {
            const neighborhoodsResponse = await axios.get(`http://localhost:5000/user-neighborhoods/${authState.userId}`);
            const neighborhoodId = neighborhoodsResponse.data?._id; // Adjust based on actual response structure
    
            // Fetch posts based on the neighborhood ID
            const postsResponse = await axios.get(`http://localhost:5000/posts?neighborhoodId=${neighborhoodId}`);
            const sortedData = postsResponse.data.sort((a, b) => new Date(b.neededBy) - new Date(a.neededBy));
            setPosts(sortedData);
          } catch (error) {
            console.error('Failed to fetch posts:', error);
          }
        };
    
        fetchPosts();
      }, [authState.userId]); 
    
      const handleLogout = () => {
        auth.logout();
        navigate('/');
      };

  return (
    <div className="feed-page">
      <nav className="navbar">
        <Link to="/" className="logo">NeighborShare</Link>
        <div className="nav-links">
          <Link to="/new-post" className="nav-item">New Post</Link>
          <Link to="/user-post-page" className="nav-item">Your Post</Link>
          <Link to="/create-neighborhood" className="nav-item">New Neighborhood</Link>
          <Link to="/profile" className="nav-item">Profile</Link>
          <button onClick={handleLogout} className="nav-item logout">Logout</button>
          {/* <div className="nav-item">
            <label htmlFor="neighborhood-select">Select Neighborhood:</label>
            <select
              id="neighborhood-select"
              value={selectedNeighborhood || ''}
              onChange={handleNeighborhoodChange}
            >
              <option value="" disabled>Select a Neighborhood</option>
              {neighborhoods.map(neighborhood => (
                <option key={neighborhood._id} value={neighborhood._id}>
                  {neighborhood.name}
                </option>
              ))}
            </select>
          </div> */}
        </div>
      </nav>
      <main className="feed">
      {posts.length > 0 ? (
          posts.map(post => (
            <article key={post._id} className="post">
              <h2>{post.postName}</h2>
              <div className="post-info">
                <span>Posted by: {post.userId.firstName} {post.userId.lastName}</span>
                <span>Type: {post.postType}</span>
                <span>Needed: {post.serviceOrTool}</span>
                <span>Needed by: {new Date(post.neededBy).toLocaleDateString()}</span>
              </div>
            </article>
          ))
        ) : (
          <p className="no-posts">No posts for your neighborhood, be the first!</p>
        )}
      </main>
      <footer className="footer">
        <p>&copy; 2024 NeighborShare. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default FeedPage;
