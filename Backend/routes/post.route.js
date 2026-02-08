import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controllers/postcontroller.js";
import { verifyToken, verifyPostAuthorization } from "../middleware/verifyToken.js";

const router = express.Router();

// Public Routes
router.get("/", getPosts); // Get all posts (with search/filter/pagination)
router.get("/:slug", getPost); // Get single post by slug

// Protected Routes (requires authentication and authorization for modification)
router.post("/", verifyToken, createPost); // Create post
router.put("/:id", verifyToken, verifyPostAuthorization, updatePost); // Update post by ID
router.delete("/:id", verifyToken, verifyPostAuthorization, deletePost); // Delete post by ID

export default router;