import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FeedPage from '../view/FeedPage';
import LoginPage from '../view/LoginPage';
import CreateAccount from '../view/CreateAccount';

import ProfilePage from '../view/ProfilePage';
import NewPost from '../view/NewPost';
import UserPostsPage from '../view/UserPostPage';
import EditPost from '../view/EditPost';
import CreateNeighborhood from '../view/CreateNeighborhood';

import { AuthProvider } from '../components/AuthContext'; 

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/new-post" element={<NewPost />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/user-post-page" element={<UserPostsPage />} />
          <Route path="/edit-post/:postId" element={<EditPost />} />
          <Route path="/create-neighborhood" element={<CreateNeighborhood />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRoutes;
