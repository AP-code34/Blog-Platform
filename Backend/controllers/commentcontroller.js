import Comment from "../models/comment.js";

// Get Comments by Post ID (Public)
export const getPostComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .sort({ createdAt: -1 })
      .populate("author", "username avatar");

    res.status(200).json({
      message: "Comments retrieved successfully",
      data: comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error while fetching comments" });
  }
};

// Add Comment (Protected)
export const addComment = async (req, res) => {
  try {
    const { content, postId } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const newComment = new Comment({
      content: content.trim(),
      author: req.userId,
      post: postId,
    });

    await newComment.save();

    // Populate the author data before sending the response
    const savedComment = await Comment.findById(newComment._id).populate(
      "author",
      "username avatar",
    );

    res.status(201).json({
      message: "Comment added successfully",
      data: savedComment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error while adding comment" });
  }
};

// Delete Comment (Protected - only comment author can delete)
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the user is the comment author
    if (comment.author.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Server error while deleting comment" });
  }
};
