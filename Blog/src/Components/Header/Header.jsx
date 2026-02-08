import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaPlus,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import { AuthContext } from "../../context/authcontext";

const defaultAvatar = "https://ui-avatars.com/api/?name=User&background=ec4899&color=fff&size=150";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useContext(AuthContext);

  const linkClass =
    "text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200";
  const buttonClass =
    "bg-gradient-to-r from-rose-500 via-purple-500 to-pink-500 hover:from-rose-600 hover:via-purple-600 hover:to-pink-600 text-white font-medium px-5 py-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105";

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md fixed w-full z-50 border-b border-purple-100 shadow-sm">
      <div className="container mx-auto px-4 py-3 md:py-4 flex justify-between items-center">
        {/* Brand Name: HeartInk */}
        <Link
          to="/"
          className="text-2xl md:text-3xl font-bold flex items-center gap-2"
        >
          <FaHeart className="text-rose-500 animate-pulse" />
          <span className="bg-gradient-to-r from-rose-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            HeartInk
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <Link to="/" className={linkClass}>
            Home
          </Link>
          <Link to="/posts" className={linkClass}>
            All Stories
          </Link>
          <Link to="/categories" className={linkClass}>
            Categories
          </Link>
          {currentUser && (
            <Link
              to="/create-post"
              className="flex items-center text-purple-600 font-semibold hover:text-purple-700 transition-colors"
            >
              <FaPlus className="mr-1.5 text-sm" />
              Write
            </Link>
          )}
        </nav>

        {/* Desktop Auth/User */}
        <div className="hidden md:flex items-center space-x-4">
          {currentUser ? (
            <div className="flex items-center space-x-3">
              <Link to="/profile" className="flex items-center space-x-2 group">
                <img
                  src={currentUser.avatar || defaultAvatar}
                  alt={`${currentUser.username}'s profile`}
                  className="w-9 h-9 rounded-full object-cover border-2 border-purple-300 group-hover:border-rose-400 transition"
                />
                <span className={linkClass}>{currentUser.username}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 transition-colors"
                title="Sign Out"
              >
                <FaSignOutAlt className="text-lg" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-gray-700 hover:text-purple-600 font-medium px-4 py-2 transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link to="/register" className={buttonClass}>
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                mobileMenuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            ></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu Content */}
      <div
        className={`md:hidden ${
          mobileMenuOpen ? "block" : "hidden"
        } bg-white/95 backdrop-blur-md py-2 border-b border-purple-100 transition-all duration-300`}
      >
        <div className="flex flex-col px-4 space-y-1">
          <Link
            to="/"
            className="block py-3 px-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/posts"
            className="block py-3 px-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            All Stories
          </Link>
          <Link
            to="/categories"
            className="block py-3 px-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Categories
          </Link>

          {currentUser && (
            <Link
              to="/create-post"
              className="block py-3 px-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaPlus className="inline mr-2 text-sm" />
              Write New Story
            </Link>
          )}

          <div className="border-t border-purple-100 mt-2 pt-2">
            {currentUser ? (
              <div className="flex flex-col">
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 py-3 px-2 hover:bg-purple-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <img
                    src={currentUser.avatar || defaultAvatar}
                    alt={`${currentUser.username}'s profile`}
                    className="w-8 h-8 rounded-full object-cover border border-purple-300"
                  />
                  <span className="text-gray-700 font-medium">
                    View Profile
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-3 px-2 text-red-600 hover:bg-red-50 rounded-lg font-medium flex items-center"
                >
                  <FaSignOutAlt className="mr-2" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/login"
                  className="block py-3 px-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block py-3 px-2 bg-gradient-to-r from-rose-500 via-purple-500 to-pink-500 hover:from-rose-600 hover:via-purple-600 hover:to-pink-600 text-white font-medium rounded-xl transition-all text-center shadow-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;