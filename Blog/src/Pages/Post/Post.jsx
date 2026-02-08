import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, BookOpen, Heart } from "lucide-react";
import { apiRequest } from "../../services/api";
import PostCard from "../../Components/post/Postcard";
import SkeletonCard from "../../Components/post/Skeletoncard";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 9;

  useEffect(() => {
    setCategories([
      { _id: 'tech', name: 'Technology' }, 
      { _id: 'travel', name: 'Travel' }, 
      { _id: 'food', name: 'Food' },
      { _id: 'lifestyle', name: 'Lifestyle' }
    ]);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          limit: postsPerPage,
          page: currentPage,
          search: searchQuery,
        };
        const res = await apiRequest.get("/posts", { params });
        setPosts(res.data.data);
        setTotalPages(res.data.pages);
      } catch (err) {
        setError("Failed to fetch posts.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [searchQuery, selectedCategory, currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 py-12 px-4 pt-24">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              All Stories
            </h1>
          </div>
          <p className="text-lg text-gray-600 flex items-center justify-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            Discover heartfelt tales from our community
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search stories by title or content..."
                className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border-2 border-purple-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all shadow-lg text-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="absolute right-2 top-2 bg-gradient-to-r from-rose-500 via-purple-500 to-pink-500 hover:from-rose-600 hover:via-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-xl font-medium transition-all shadow-md"
            >
              Search
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-rose-100 border-2 border-rose-300 text-rose-700 p-4 rounded-2xl mb-8 text-center max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? [...Array(postsPerPage)].map((_, i) => <SkeletonCard key={i} />)
            : posts.length > 0
            ? posts.map((post) => <PostCard key={post._id} post={post} />)
            : (
              <div className="col-span-full text-center py-20">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto shadow-xl border border-purple-100">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No stories found matching your search.</p>
                  <p className="text-gray-500 text-sm mt-2">Try different keywords or explore all stories.</p>
                </div>
              </div>
            )
          }
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-16">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-3 rounded-xl bg-white hover:bg-purple-50 border-2 border-purple-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="text-purple-600 w-5 h-5" />
            </button>
            
            <div className="bg-white px-6 py-3 rounded-xl shadow-md border-2 border-purple-200">
              <span className="text-gray-700 font-medium">
                Page <span className="text-purple-600 font-bold">{currentPage}</span> of{" "}
                <span className="text-purple-600 font-bold">{totalPages}</span>
              </span>
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-3 rounded-xl bg-white hover:bg-purple-50 border-2 border-purple-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="text-purple-600 w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;