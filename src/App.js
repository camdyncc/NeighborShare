import React, { useState } from 'react';
import AppRoutes from './routes/AppRoutes'; // Adjust the import path based on your project structure

const App = () => {
  const [posts, setPosts] = useState([]);
  const [userInfo, setUserInfo] = useState({username: '', password: '', name: '', age: '', address: '' });

  const addNewPost = (newPost) => {
    setPosts((prevPosts) => [...prevPosts, newPost]);
  };

  const getUserInfo = () => {
    return userInfo;
  };

  return (
    <AppRoutes
      posts={posts}
      addNewPost={addNewPost}
      userInfo={userInfo}
      getUserInfo={getUserInfo}
      setUserInfo={setUserInfo}
    />
  );
};

export default App;
