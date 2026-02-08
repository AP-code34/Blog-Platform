import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, PenLine, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { apiRequest } from "../../services/api";
import PostCard from "../../Components/Post/Postcard";
import SkeletonCard from "../../Components/Post/Skeletoncard";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const res = await apiRequest.get("/posts", {
          params: { limit: 6 },
        });
        setPosts(res.data.data);
      } catch (err) {
        console.error("Error fetching home posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart className="w-12 h-12 text-rose-500 fill-rose-500 animate-pulse" />
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-rose-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              HeartInk
            </h1>
          </div>
          
          <p className="text-2xl md:text-3xl text-gray-700 mb-4 font-medium">
            Where <span className="text-rose-600 font-bold">emotions</span> find their{" "}
            <span className="text-purple-600 font-bold">voice</span>
          </p>
          
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            A sanctuary for your thoughts, feelings, and stories. Write from the heart, connect through words.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link
              to="/create-post"
              className="group bg-gradient-to-r from-rose-500 via-purple-500 to-pink-500 hover:from-rose-600 hover:via-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform hover:scale-105"
            >
              <PenLine className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Start Writing
            </Link>
            <Link
              to="/posts"
              className="bg-white hover:bg-gray-50 text-gray-800 border-2 border-purple-300 px-8 py-4 rounded-2xl font-semibold text-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 transform hover:scale-105"
            >
              <BookOpen className="w-5 h-5" />
              Explore Stories
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-rose-100">
              <div className="bg-gradient-to-br from-rose-100 to-pink-100 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-7 h-7 text-rose-600 fill-rose-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Write with Heart</h3>
              <p className="text-gray-600 text-sm">Express your deepest emotions and authentic self</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-100">
              <div className="bg-gradient-to-br from-purple-100 to-indigo-100 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Share Your Light</h3>
              <p className="text-gray-600 text-sm">Connect with readers who feel what you feel</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-pink-100">
              <div className="bg-gradient-to-br from-pink-100 to-rose-100 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-7 h-7 text-pink-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Build Your Journey</h3>
              <p className="text-gray-600 text-sm">Create a collection of your meaningful moments</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="container mx-auto px-4 py-16 md:py-20 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-500" />
            Latest Stories
          </h2>
          <p className="text-gray-600 text-lg">Heartfelt words from our community</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {loading
            ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
            : posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/posts"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold text-lg group"
          >
            Read All Stories
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Quote Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 max-w-3xl mx-auto shadow-xl border border-purple-100">
          <p className="text-2xl md:text-3xl text-gray-700 italic mb-4">
            "There is no greater agony than bearing an untold story inside you."
          </p>
          <p className="text-gray-600 font-medium">— Maya Angelou</p>
        </div>
      </section>
    </div>
  );
};

export default Home;