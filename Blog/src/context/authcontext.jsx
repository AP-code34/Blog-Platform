// src/context/AuthContext.jsx

import React, { useEffect, useState, createContext } from "react";
import { apiRequest } from "../services/api";

// Create the Context
export const AuthContext = createContext(null);

// Define the Provider Component
export const AuthContextProvider = ({ children }) => {
  // Initialize state from localStorage, defaulting to null
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("blogUser");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  });

  const updateUser = (data) => {
    setCurrentUser(data);
  };

  const logout = async () => {
    try {
      await apiRequest.post("/auth/logout");
    } catch (err) {
      console.error("Logout API failed:", err);
    }

    setCurrentUser(null);
    localStorage.removeItem("blogUser");
  };

  // Sync state to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("blogUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("blogUser");
    }
  }, [currentUser]);

  // Provide the state and handlers
  return (
    <AuthContext.Provider value={{ currentUser, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};