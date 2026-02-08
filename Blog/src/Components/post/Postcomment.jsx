import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaPaperPlane, FaTrashAlt } from "react-icons/fa";
import { apiRequest } from "../../services/api";
import { AuthContext } from "../../context/authcontext";

const defaultAvatar = "https://ui-avatars.com/api/?name=User&background=ec4899&color=fff&size=150";

const CommentSection = ({ postId, setCommentsCount }) => {
  const { currentUser } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest.get(`/comments/${postId}`);
      console.log("Comments fetched:", res.data);
      setComments(res.data.data || []);
      if (setCommentsCount) {
        setCommentsCount(res.data.data?.length || 0);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      alert("Please enter a comment");
      return;
    }

    if (!currentUser) {
      alert("Please log in to comment");
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiRequest.post("/comments", {
        postId: postId,
        content: newComment.trim(),
      });
      
      console.log("Comment posted:", res.data);
      
      // Add new comment to the beginning of the list
      setComments([res.data.data, ...comments]);
      setNewComment("");
      
      if (setCommentsCount) {
        setCommentsCount((prev) => prev + 1);
      }
      
      alert("Comment posted successfully!");
    } catch (err) {
      console.error("Error posting comment:", err);
      alert(err.response?.data?.message || "Failed to post comment. Please ensure you are logged in.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await apiRequest.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
      if (setCommentsCount) {
        setCommentsCount((prev) => prev - 1);
      }
      alert("Comment deleted successfully!");
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment.");
    }
  };

  return (
    <div>
      {/* Comment Input */}
      {currentUser ? (
        <form
          onSubmit={handleCommentSubmit}
          className="mb-8 bg-white p-6 rounded-xl shadow-md border border-purple-100"
        >
          <div className="flex items-start gap-3 mb-3">
            <img
              src={currentUser.avatar || defaultAvatar}
              alt={currentUser.username}
              className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows="3"
                className="w-full p-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 resize-none"
                required
                disabled={submitting}
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="bg-gradient-to-r from-rose-500 via-purple-500 to-pink-500 hover:from-rose-600 hover:via-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-xl font-medium transition-all shadow-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaPaperPlane className="mr-2 text-sm" />
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-purple-50 p-6 rounded-xl text-center mb-8 border-2 border-purple-200">
          <p className="text-purple-700 font-medium text-lg">
            <Link to="/login" className="underline hover:text-rose-500 font-bold">
              Sign in
            </Link>{" "}
            to join the conversation and leave a comment.
          </p>
        </div>
      )}

      {/* Comment List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 animate-pulse">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-rose-100 border-2 border-rose-300 text-rose-700 p-4 rounded-xl text-center">
          {error}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <FaUserCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium mb-2">
            No comments yet
          </p>
          <p className="text-gray-500 text-sm">
            Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            // Check if current user is the comment author (handle both id and _id)
            const isCommentAuthor = currentUser && (
              currentUser.id === comment.author?._id ||
              currentUser._id === comment.author?._id ||
              currentUser.id === comment.author?.id ||
              currentUser._id === comment.author?.id
            );
            
            return (
              <div
                key={comment._id}
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <img
                      src={comment.author?.avatar || defaultAvatar}
                      alt={comment.author?.username || "User"}
                      className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-purple-200"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {comment.author?.username || "Anonymous"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  
                  {isCommentAuthor && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-rose-500 hover:text-rose-700 transition-colors p-2"
                      title="Delete comment"
                    >
                      <FaTrashAlt />
                    </button>
                  )}
                </div>
                <p className="text-gray-700 leading-relaxed pl-13">
                  {comment.content}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommentSection;