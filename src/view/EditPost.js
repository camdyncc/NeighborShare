import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [postName, setPostName] = useState('');
  const [postType, setPostType] = useState('');
  const [serviceOrTool, setServiceOrTool] = useState('');
  const [neededBy, setNeededBy] = useState('');

  useEffect(() => {
    fetchPostData(postId);
  }, [postId]);

  const fetchPostData = async (postId) => {
    try {
      // Ensure the URL is correct
      const response = await fetch(`http://localhost:5000/posts/${postId}`);
  
      if (response.ok) {
        const postData = await response.json();
        setPostName(postData.postName || ''); 
        setPostType(postData.postType || ''); 
        setServiceOrTool(postData.serviceOrTool || '');
        setNeededBy(postData.neededBy || '');
        } else {
          console.error('Not a JSON response');
        }
    } catch (error) {
      console.error('Error fetching post data:', error);
    }
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const editedPostData = {
      postName,
      postType,
      serviceOrTool,
      neededBy,
    };
    
    try {
      const response = await fetch(`http://localhost:5000/posts/${postId}`, {
        method: 'PATCH', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedPostData),
      });
  
      const result = await response.json();
      if (response.ok) {
        alert('Post updated successfully!');
        navigate('/feed');
      } else {
        console.error('Failed to update post:', result);
        alert('Failed to update the post.');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating the post.');
    }
  };
  

  return (
    <div className="edit-post-container">
      <h1>Edit Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Post Name:</label>
          <input
            type="text"
            value={postName}
            onChange={(e) => setPostName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Type:</label>
          <select value={postType} onChange={(e) => setPostType(e.target.value)}>
            <option value="service">Service</option>
            <option value="tool">Tool</option>
          </select>
        </div>
        <div className="form-group">
          <label>Service/Tool:</label>
          <input
            type="text"
            value={serviceOrTool}
            onChange={(e) => setServiceOrTool(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Needed By:</label>
          <input
            type="date"
            value={neededBy}
            onChange={(e) => setNeededBy(e.target.value)}
          />
        </div>
        <button type="submit" className="submit-button">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditPost;
