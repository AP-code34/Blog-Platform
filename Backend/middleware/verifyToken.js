import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. Not Authenticated." });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) {
      // Clear expired or invalid token
      res.clearCookie("token");
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    // Attach user ID and role for authorization checks
    req.userId = payload.id;
    req.userRole = payload.role;
    next();
  });
};

// Authorization middleware for posts (ensure the author matches the current user OR user is admin)
export const verifyPostAuthorization = async (req, res, next) => {
  // Post ID is passed as req.params.id in the routes
  try {
    const Post = (await import("../models/post.js")).default;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the authenticated user is the author OR is an admin
    if (req.userId.toString() === post.author.toString() || req.userRole === "admin") {
      next();
    } else {
      res.status(403).json({
        message: "You are not authorized to perform this action on this post.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Authorization error" });
  }
};