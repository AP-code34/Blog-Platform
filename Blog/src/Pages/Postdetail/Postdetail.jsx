import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaClock,
  FaEye,
  FaCommentDots,
  FaEdit,
  FaTrashAlt,
  FaArrowLeft,
  FaTag,
} from "react-icons/fa";
import { apiRequest } from "../../services/api";
import { AuthContext } from "../../context/authcontext";
import CommentSection from "../../Components/post/Postcomment";
import parse from "html-react-parser";

const defaultAvatar =
  "https://ui-avatars.com/api/?name=User&background=ec4899&color=fff&size=150";
const defaultThumbnail =
  "https://images.unsplash.com/photo-1516321497487-e288fb197135?fit=crop&w=1200&q=80";

const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentsCount, setCommentsCount] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiRequest.get(`/posts/${slug}`);
        console.log("Post fetched:", res.data);
        setPost(res.data.data);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post. It may not exist.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone.",
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      await apiRequest.delete(`/posts/${post._id}`);
      alert("Post deleted successfully!");
      navigate("/posts");
    } catch (err) {
      console.error("Error deleting post:", err);
      alert(
        err.response?.data?.message ||
          "Failed to delete post. Please try again.",
      );
    } finally {
      setDeleting(false);
    }
  };

  // Check if current user is the author
  // The currentUser.id might be _id or id depending on your backend response
  const isAuthor =
    currentUser &&
    post &&
    (currentUser.id === post.author?._id ||
      currentUser._id === post.author?._id ||
      currentUser.id === post.author?.id ||
      currentUser._id === post.author?.id);

  console.log("Current User:", currentUser);
  console.log("Post Author:", post?.author);
  console.log("Is Author:", isAuthor);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 py-12 px-4 pt-24">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-3xl shadow-2xl p-8 animate-pulse">
            <div className="h-96 bg-gray-200 rounded-2xl mb-6"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 py-12 px-4 pt-24">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Post Not Found
            </h2>
            <p className="text-gray-600 mb-8">
              {error || "This post doesn't exist or has been removed."}
            </p>
            <Link
              to="/posts"
              className="inline-flex items-center bg-gradient-to-r from-rose-500 via-purple-500 to-pink-500 hover:from-rose-600 hover:via-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg"
            >
              <FaArrowLeft className="mr-2" />
              Back to All Posts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 py-12 px-4 pt-24">
      <div className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <Link
          to="/posts"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to All Posts
        </Link>

        {/* Post Content */}
        <article className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-purple-100">
          {/* Thumbnail */}
          {post.thumbnail && (
            <div className="relative h-96 overflow-hidden">
              <img
                src={post.thumbnail || defaultThumbnail}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          )}

          <div className="p-8 md:p-12">
            {/* Category Badge */}
            {post.category && (
              <div className="inline-flex items-center bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <FaTag className="mr-2" />
                {post.category.name}
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 mb-8 pb-6 border-b border-gray-200">
              {/* Author */}
              <div className="flex items-center">
                <img
                  src={post.author?.avatar || defaultAvatar}
                  alt={post.author?.username}
                  className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-purple-200"
                />
                <div>
                  <p className="font-semibold text-gray-800">
                    {post.author?.username}
                  </p>
                  <p className="text-sm text-gray-500">Author</p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center text-gray-600">
                <FaClock className="mr-2 text-purple-500" />
                <span className="text-sm">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              {/* Views */}
              <div className="flex items-center text-gray-600">
                <FaEye className="mr-2 text-purple-500" />
                <span className="text-sm">{post.views} views</span>
              </div>

              {/* Comments Count */}
              <div className="flex items-center text-gray-600">
                <FaCommentDots className="mr-2 text-purple-500" />
                <span className="text-sm">{commentsCount} comments</span>
              </div>
            </div>

            {/* Action Buttons (Edit/Delete) - Only for Author */}
            {isAuthor && (
              <div className="flex gap-3 mb-8">
                <Link
                  to={`/edit-post/${post._id}`}
                  className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl font-medium transition-colors shadow-md"
                >
                  <FaEdit className="mr-2" />
                  Edit Post
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center bg-rose-500 hover:bg-rose-600 text-white px-5 py-2 rounded-xl font-medium transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaTrashAlt className="mr-2" />
                  {deleting ? "Deleting..." : "Delete Post"}
                </button>
              </div>
            )}

            {/* Debug Info (Remove in production) */}
            {currentUser && (
              <div className="mb-4 p-4 bg-gray-100 rounded text-xs text-gray-600">
                <p>
                  Debug: Current User ID: {currentUser.id || currentUser._id}
                </p>
                <p>
                  Debug: Post Author ID: {post.author?._id || post.author?.id}
                </p>
                <p>Debug: Is Author: {isAuthor ? "Yes" : "No"}</p>
              </div>
            )}

            {/* Post Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <div className="text-gray-700 leading-relaxed">
                {parse(post.content)}
              </div>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-12 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-purple-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaCommentDots className="mr-3 text-purple-600" />
            Comments ({commentsCount})
          </h2>
          <CommentSection
            postId={post._id}
            setCommentsCount={setCommentsCount}
          />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
