import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FeedPage from '../view/FeedPage';
import LoginPage from '../view/LoginPage';
import CreateAccount from '../view/CreateAccount';

import { AuthProvider } from '../view/AuthContext'; 

// Props can be passed down here if necessary
const AppRoutes = ({ posts, addNewPost, userInfo, getUserInfo, setUserInfo }) => {
  return (
    <AuthProvider>
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/create-account" element={<CreateAccount />} />
                <Route path="/feed" element={<FeedPage posts={posts} />} />
            </Routes>
        </Router>
    </AuthProvider>
  );
};

export default AppRoutes;
