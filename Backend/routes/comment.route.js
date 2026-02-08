import express from "express";
import { addComment, getPostComments, deleteComment } from "../controllers/commentcontroller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Public Route
router.get("/:postId", getPostComments); // Get all comments for a specific post

// Protected Routes
router.post("/", verifyToken, addComment); // Add a new comment
router.delete("/:id", verifyToken, deleteComment); // Delete a comment (only by author)

export default router;