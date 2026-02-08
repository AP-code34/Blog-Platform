// src/App.jsx

import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Home from "./Pages/Home/Home";
import SignIn from "./Pages/Signin/Signin";
import SignUp from "./Pages/Signup/Signup";
import Posts from "./Pages/Post/Post";
import PostDetail from "./Pages/Postdetail/Postdetail";
import WritePost from "./Pages/Writepost/Writepost";
import Profile from "./Pages/Profile/Profile";

import { AuthContext } from "./context/authcontext";

const App = () => {
  // Destructure currentUser from context
  const { currentUser } = useContext(AuthContext);

  // Private Route Wrapper
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="posts" element={<Posts />} />
        <Route path="posts/:slug" element={<PostDetail />} />
        <Route path="categories" element={<Posts />} />

        {/* Auth Routes */}
        <Route
          path="login"
          element={
            currentUser ? <Navigate to="/profile" replace /> : <SignIn />
          }
        />
        <Route
          path="register"
          element={
            currentUser ? <Navigate to="/profile" replace /> : <SignUp />
          }
        />

        {/* Protected Routes */}
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="create-post"
          element={
            <ProtectedRoute>
              <WritePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="edit-post/:id"
          element={
            <ProtectedRoute>
              <WritePost />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route */}
        <Route
          path="*"
          element={
            <div className="container mx-auto px-4 py-20 text-center text-red-600 font-semibold">
              404 | Page Not Found
            </div>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;