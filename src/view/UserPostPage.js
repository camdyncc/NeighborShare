import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext'; 
import './UserPostPage.css'; 

const UserPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const { authState } = useAuth();
  const { userId } = useAuth();
    console.log(authState.userId);
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!authState || !authState.userId) {
        console.error('No user ID available');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/user-posts/${authState.userId}`);
        setPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch user posts:', error);
      }
    };

    fetchUserPosts();
  }, [authState]);

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/posts/${postId}`);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handleEdit = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  return (
  <div className="userpost-page-background">
    <div className="user-posts-container">
      <h1>Your Posts</h1>
      {posts.length > 0 ? (
        posts.map(post => (
          <div key={post._id} className="post-item">
            <h2>{post.postName}</h2>
            <p>Type: {post.postType}</p>
            <div className="actions">
              <button className="edit-btn" onClick={() => handleEdit(post._id)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(post._id)}>Delete</button>
            </div>
          </div>
        ))
      ) : (
        <p>You have not posted anything yet.</p>
      )}
    </div>
  </div>
  );
};

export default UserPostsPage;