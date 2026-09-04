import commentModel from "../models/commentModel.js";
import blogModel from "../models/blogModel.js";
import { io } from "../config/socket.js";

const createCommentController = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.postId;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const authorId = req.userId;

    const newComment = await commentModel.create({
      author: authorId,
      post: postId,
      text,
    });

    const updatedBlog = await blogModel.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } }, { new: true });

    const populatedComment = await commentModel.findById(newComment._id).populate("author", "name profilePic");
    io.emit("newComment", { blogId: postId, comment: populatedComment, commentsCount: updatedBlog.commentsCount });

    res.status(201).json({
      success: true,
      message: "Comment created successfully!",
      comment: newComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create comment",
      error: error.message,
    });
  }
};

const getCommentsController = async (req, res) => {
  try {
    const postId = req.params.postId;
    
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const comments = await commentModel
      .find({ post: postId })
      .populate("author", "name profilePic")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, comments });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Cannot find comments", error: error.message });
  }
};

const deleteCommentController = async (req, res) => {
  try {
    const commentId = req.params.commentId;

    if (!commentId) {
      return res.status(400).json({ message: "Enter ID for delete" });
    }

    const comment = await commentModel.findOneAndDelete({
      _id: commentId,
      author: req.userId,
    });

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found or you are not authorized to delete it.",
      });
    }

    await blogModel.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } });

    return res.status(200).json({ success: true, message: "Deleted successfully", comment });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Cannot delete", error: error.message });
  }
};

export { createCommentController, getCommentsController, deleteCommentController };
