import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FeedPage from '../view/FeedPage';
import LoginPage from '../view/LoginPage';
import CreateAccount from '../compviewonents/CreateAccount';
import ProfilePage from '../view/ProfilePage';
import NewPost from '../view/NewPost';
import UserPostsPage from '../view/UserPostPage';
import EditPost from '../view/EditPost';
import CreateNeighborhood from '../view/CreateNeighborhood';

import { AuthProvider } from '../components/AuthContext'; 

// Props can be passed down here if necessary
const AppRoutes = ({ posts, addNewPost, userInfo, getUserInfo, setUserInfo }) => {
  return (
    <AuthProvider>
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/create-account" element={<CreateAccount />} />
                <Route path="/feed" element={<FeedPage posts={posts} />} />
                <Route path="/new-post" element={<NewPost onNewPost={addNewPost} />} />
                <Route path="/profile" element={<ProfilePage userInfo={userInfo} getUserInfo={getUserInfo} setUserInfo={setUserInfo} />} />
                <Route path="/user-post-page" element={<UserPostsPage />} />
                <Route path="/edit-post/:postId" element={<EditPost />} />
                <Route path="/create-neighborhood" element={<CreateNeighborhood />} />
            </Routes>
        </Router>
    </AuthProvider>
  );
};

export default AppRoutes;
