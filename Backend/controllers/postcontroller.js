import Post from "../models/post.js";

// Create Post (Protected)
export const createPost = async (req, res) => {
  try {
    const { title, content, category, thumbnail } = req.body;

    const newPost = new Post({
      title,
      content,
      category,
      thumbnail,
      author: req.userId, // Set author ID from the verified token
    });

    await newPost.save();
    res
      .status(201)
      .json({ message: "Post created successfully", data: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "A post with this title already exists." });
    }
    res.status(500).json({ message: "Server error while creating post" });
  }
};

// Get All Posts with Search, Filtering, and Pagination (Public)
export const getPosts = async (req, res) => {
  const { search, category, author, limit = 10, page = 1 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  try {
    const query = {};

    // 1. Search functionality (using Mongoose text index)
    if (search) {
      query.$text = { $search: search };
    }

    // 2. Filtering by category
    if (category) {
      query.category = category; // Assumes category is the ObjectId
    }

    // 3. Filtering by author
    if (author) {
      query.author = author; // Assumes author is the ObjectId
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("author", "username avatar") // Populate author details
      .populate("category", "name slug"); // Populate category details

    const totalPosts = await Post.countDocuments(query);

    res.status(200).json({
      message: "Posts retrieved successfully",
      data: posts,
      total: totalPosts,
      page: parseInt(page),
      pages: Math.ceil(totalPosts / parseInt(limit)),
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error while fetching posts" });
  }
};

// Get Single Post (Public) - Works with both slug and ID
export const getPost = async (req, res) => {
  try {
    const identifier = req.params.slug || req.params.id;
    let post;

    // Check if identifier is a valid MongoDB ObjectId (24 hex characters)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);

    if (isValidObjectId) {
      // Fetch by ID (for editing)
      console.log("Fetching post by ID:", identifier);
      post = await Post.findByIdAndUpdate(
        identifier,
        { $inc: { views: 1 } },
        { new: true },
      )
        .populate("author", "username avatar")
        .populate("category", "name slug");
    } else {
      // Fetch by slug (for viewing)
      console.log("Fetching post by slug:", identifier);
      post = await Post.findOneAndUpdate(
        { slug: identifier },
        { $inc: { views: 1 } },
        { new: true },
      )
        .populate("author", "username avatar")
        .populate("category", "name slug");
    }

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res
      .status(200)
      .json({ message: "Post retrieved successfully", data: post });
  } catch (error) {
    console.error("Error fetching single post:", error);
    res.status(500).json({ message: "Server error while fetching post" });
  }
};

// Update Post (Protected, requires verifyPostAuthorization)
export const updatePost = async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("author", "username avatar")
      .populate("category", "name slug");

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res
      .status(200)
      .json({ message: "Post updated successfully", data: updatedPost });
  } catch (error) {
    console.error("Error updating post:", error);
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "A post with this title already exists." });
    }
    res.status(500).json({ message: "Server error while updating post" });
  }
};

// Delete Post (Protected, requires verifyPostAuthorization)
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Delete all associated comments
    const Comment = (await import("../models/comment.js")).default;
    await Comment.deleteMany({ post: req.params.id });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Server error while deleting post" });
  }
};
