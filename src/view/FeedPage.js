import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';
import './FeedPage.css';

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState('');
  const [rating, setRating] = useState(5);
  const [inviteUsername, setInviteUsername] = useState(''); // State for the username input
  const { authState } = useAuth();
  const navigate = useNavigate();
  const auth = useAuth();
  useEffect(() => {
    const fetchPosts = async () => {
      if (!authState.userId) return;
      try {
        const response = await axios.get(`http://localhost:5000/user-neighborhoods/${authState.userId}`);
        const neighborhoodId = response.data?._id;
        const postsResponse = await axios.get(`http://localhost:5000/posts?neighborhoodId=${neighborhoodId}`);
        setPosts(postsResponse.data.sort((a, b) => new Date(b.neededBy) - new Date(a.neededBy)));
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };
    fetchPosts();
  }, [authState.userId]);

  const handleInviteUsers = async () => {
    // Assuming you have a neighborhoodId in your authState or some way to get the current neighborhood
    const neighborhoodId = 'YOUR_NEIGHBORHOOD_ID_HERE'; // Replace with actual neighborhoodId logic
    try {
      await axios.post('http://localhost:5000/invite-user-to-neighborhood', {
        username: inviteUsername,
        neighborhoodId,
      });
      alert('Invitation sent successfully!');
      setInviteUsername(''); // Reset input after sending the invite
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Failed to send invitation.');
    }
  };

  const showRatingModal = (postId) => {
    setCurrentPostId(postId);
    setIsRatingModalOpen(true);
  };

  const handleFulfillment = async () => {
    try {
      await axios.post(`http://localhost:5000/fulfill-post/${currentPostId}`, {
        userId: authState.userId,
        rating,
      });
      setIsRatingModalOpen(false);
      alert('Request fulfilled successfully!');
    } catch (error) {
      console.error('Failed to fulfill request:', error);
      alert('Failed to fulfill request.');
    }
  };

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
          <input
            type="text"
            placeholder="Invite username"
            value={inviteUsername}
            onChange={(e) => setInviteUsername(e.target.value)}
            className="invite-input"
          />
          <button onClick={handleInviteUsers} className="nav-item">Invite</button>
          <button onClick={handleLogout} className="nav-item logout">Logout</button>
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
                <button onClick={() => showRatingModal(post._id)}>Fulfill Request</button>
              </div>
            </article>
          ))
        ) : (
          <p className="no-posts">No posts for your neighborhood, be the first!</p>
        )}
      </main>
      {isRatingModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsRatingModalOpen(false)}>&times;</span>
            <h2>Rate Fulfillment</h2>
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <button onClick={handleFulfillment}>Submit Rating</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedPage;
