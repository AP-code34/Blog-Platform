import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTag, FaBook, FaSpinner } from "react-icons/fa";
import { apiRequest } from "../../services/api";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await apiRequest.get("/categories");
        console.log("Categories:", res.data);
        setCategories(res.data.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 py-12 px-4 pt-24">
        <div className="container mx-auto max-w-6xl text-center">
          <FaSpinner className="w-12 h-12 text-purple-600 mx-auto animate-spin" />
          <p className="text-gray-600 mt-4">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 py-12 px-4 pt-24">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-rose-100 border-2 border-rose-300 text-rose-700 p-6 rounded-2xl text-center">
            <p className="text-lg font-semibold">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 py-12 px-4 pt-24">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaTag className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Browse by Category
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Explore stories organized by topic
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto shadow-xl border border-purple-100">
              <FaTag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No categories available.</p>
              <p className="text-gray-500 text-sm mt-2">
                Please restart your backend server to seed categories.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/posts?category=${category._id}`}
                className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-purple-100 hover:border-purple-300"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-rose-400 via-purple-400 to-pink-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FaBook className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500">{category.slug}</p>
                    </div>
                  </div>

                  {category.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>

                <div className="px-6 pb-4">
                  <div className="text-sm text-purple-600 font-medium group-hover:translate-x-2 transition-transform inline-flex items-center">
                    View Stories →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
