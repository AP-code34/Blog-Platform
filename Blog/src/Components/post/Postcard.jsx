import React from "react";
import { Link } from "react-router-dom";
import { FaClock, FaEye } from "react-icons/fa";

const PostCard = ({ post }) => {
  const safeTitle = post.title || "Untitled Post";
  const safeSlug = post.slug || post._id;
  const safeThumbnail = post.thumbnail || "https://images.unsplash.com/photo-1516321497487-e288fb197135?fit=crop&w=800&q=80";

  return (
    <Link 
      to={`/posts/${safeSlug}`} 
      className="block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-50 group"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={safeThumbnail}
          alt={safeTitle}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-0 right-0 m-3 px-3 py-1 bg-purple-600/80 text-white text-xs font-semibold rounded-full shadow-md">
          {post.category?.name || "General"}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-rose-600 transition-colors">
          {safeTitle}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {post.content.replace(/<[^>]*>?/gm, '').substring(0, 100)}...
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-gray-500 text-sm">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <FaClock className="mr-1.5 text-xs" /> 
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center">
              <FaEye className="mr-1.5 text-xs" /> 
              {post.views}
            </span>
          </div>
          <span className="font-medium text-purple-600">{post.author?.username}</span>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;