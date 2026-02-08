import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FaSave, FaTimes } from "react-icons/fa";
import { apiRequest } from "../../services/api";

const WritePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Fetch Categories from the Database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("🔍 Fetching categories...");
        const res = await apiRequest.get("/categories");
        console.log("📦 Categories response:", res.data);
        setCategories(res.data.data || []);
      } catch (err) {
        console.error("❌ Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // 2. Fetch Post Data if Editing
  useEffect(() => {
    if (isEditing) {
      const fetchPost = async () => {
        try {
          console.log("🔍 Fetching post with ID:", id);
          // First try to get by ID directly
          const res = await apiRequest.get(`/posts/by-id/${id}`).catch(() => {
            // If that fails, try the regular endpoint (which uses slug)
            return apiRequest.get(`/posts/${id}`);
          });

          console.log("📦 Post data:", res.data);

          const post = res.data.data;
          setTitle(post.title);
          setContent(post.content);
          // Handle category whether it comes as an object or an ID string
          setCategory(post.category?._id || post.category);
          setThumbnail(post.thumbnail || "");
        } catch (err) {
          console.error("❌ Failed to fetch post:", err);
          setError(
            "Failed to fetch post. You may not have permission to edit this post.",
          );
        }
      };
      fetchPost();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!category) {
        alert("Please select a category!");
        setLoading(false);
        return;
      }

      const postData = {
        title,
        content,
        category, // Sends the valid MongoDB ID
        thumbnail,
      };

      console.log("📤 Submitting post data:", postData);

      if (isEditing) {
        await apiRequest.put(`/posts/${id}`, postData);
        alert("Post updated successfully!");
      } else {
        await apiRequest.post("/posts", postData);
        alert("Post created successfully!");
      }
      navigate("/posts");
    } catch (err) {
      console.error("❌ Error saving post:", err);
      setError(err.response?.data?.message || "Failed to save post.");
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 py-12 px-4 pt-24">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-purple-100">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">
            {isEditing ? "Edit Story" : "Write New Story"}
          </h1>

          {error && (
            <div className="bg-rose-100 text-rose-700 p-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-400"
                placeholder="Story Title"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Category ({categories.length} available)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-400"
                required
              >
                <option value="">Select a category</option>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading categories...</option>
                )}
              </select>
              {categories.length === 0 && (
                <p className="text-rose-500 text-sm mt-2">
                  ⚠️ No categories loaded. Please restart your backend server.
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Thumbnail URL
              </label>
              <input
                type="text"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl"
                placeholder="https://..."
              />
            </div>

            <div className="h-64 mb-12">
              <label className="block text-gray-700 font-semibold mb-2">
                Content
              </label>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                className="h-48 bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Saving..."
                : isEditing
                  ? "Update Story"
                  : "Publish Story"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WritePost;
