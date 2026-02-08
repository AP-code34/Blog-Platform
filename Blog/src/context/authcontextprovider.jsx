// Authcontext.jsx (Assuming you have this in a separate file)
import React, { useEffect, useState, createContext } from "react";
import { apiRequest } from "../services/api"; // Assuming the path is correct

// 1. Create the Context (This is typically exported from this file)
export const AuthContext = createContext(null); 

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("blogUser")) || null
  );

  const updateUser = (data) => {
    setCurrentUser(data);
  };

  const logout = async () => {
    try {
      await apiRequest.post("/auth/logout");
    } catch(err) {
      console.error("Logout API failed:", err);
    }
    setCurrentUser(null);
    localStorage.removeItem("blogUser");
  };

  useEffect(() => {
    localStorage.setItem("blogUser", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};