import blogModel from "../models/blogModel.js";
import likeModel from "../models/likeModel.js";
import { createBlogSchema, updateBlogSchema } from "../validators/blogValidate.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import { io } from "../config/socket.js";

const createBlogController = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const { error } = createBlogSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    let imageUrl = '';
    if (req.file) {
      const uploadFromBuffer = (req) => {
        return new Promise((resolve, reject) => {
          let cld_upload_stream = cloudinary.uploader.upload_stream(
            { folder: "pentagram_blogs" },
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(cld_upload_stream);
        });
      };
      const result = await uploadFromBuffer(req);
      imageUrl = result.secure_url;
    }

    const authorId = req.userId;
    const newBlog = await blogModel.create({
      author: authorId,
      title,
      content,
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully!",
      blog: newBlog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create blog",
      error: error.message,
    });
  }
};

const getAllBlogController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const allBlog = await blogModel.find({
      title: { $nin: ["Post", "Untitled"] },
      content: { $nin: ["", " "] }
    })
      .populate('author', 'name profilePic')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (!allBlog) {
      return res.status(404).json({ message: "There is no BLog" });
    }

    let blogsWithLikes = allBlog;
    if (req.userId) {
      const userLikes = await likeModel.find({ user: req.userId });
      const likedPostIds = userLikes.map(like => like.post.toString());
      blogsWithLikes = allBlog.map(blog => ({
        ...blog.toObject(),
        isLikedLocally: likedPostIds.includes(blog._id.toString())
      }));
    }

    return res.status(200).json({ message: "All Blogs", Blog: blogsWithLikes });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Cannot find blog", error: error.message });
  }
};

const getSingleBlogController = async (req, res) => {
  try {
    const blog = await blogModel.findById(req.params.id).populate('author', 'name profilePic');
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    return res.status(200).json({ success: true, blog });
  } catch (error) {
    return res.status(500).json({ message: "Cannot get blog", error: error.message });
  }
};

const getUserBlogsController = async (req, res) => {
  try {
    const blogs = await blogModel.find({ author: req.params.userId })
      .populate('author', 'name profilePic')
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, blogs });
  } catch (error) {
    return res.status(500).json({ message: "Cannot get user blogs", error: error.message });
  }
};

const updateBlogController = async (req, res) => {
  try {
    const { error, value } = updateBlogSchema.validate(req.body, {
      stripUnknown: true,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const id = req.params.id;
    const updatedBlog = await blogModel.findOneAndUpdate(
      { _id: id, author: req.userId },
      value,
      { new: true },
    );

    if (!updatedBlog) {
      return res
        .status(404)
        .json({ message: "Blog not found or unauthorized" });
    }

    return res.status(200).json({ success: true, blog: updatedBlog });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Update failed", error: error.message });
  }
};

const deleteBlogController = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ message: "Enter ID for delete" });
    }
    const blog = await blogModel.findOneAndDelete({
      _id: id,
      author: req.userId,
    });

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found or you are not authorized to delete it.",
      });
    }

    return res.status(200).json({ message: "Deleted successfully", blog });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Cannot delete", error: error.message });
  }
};

const likeBlogController = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.userId;

    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const existingLike = await likeModel.findOne({ post: blogId, user: userId });
    if (existingLike) {
      return res.status(400).json({ message: "You already liked this post" });
    }

    await likeModel.create({ post: blogId, user: userId });
    blog.likesCount += 1;
    await blog.save();

    io.emit("postLiked", { blogId, likesCount: blog.likesCount });

    return res.status(201).json({ success: true, message: "Liked", likesCount: blog.likesCount });
  } catch (error) {
    return res.status(500).json({ message: "Failed to like blog", error: error.message });
  }
};

const unlikeBlogController = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.userId;

    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const existingLike = await likeModel.findOneAndDelete({ post: blogId, user: userId });
    if (!existingLike) {
      return res.status(400).json({ message: "You haven't liked this post" });
    }

    blog.likesCount = Math.max(0, blog.likesCount - 1);
    await blog.save();

    io.emit("postLiked", { blogId, likesCount: blog.likesCount });

    return res.status(200).json({ success: true, message: "Unliked", likesCount: blog.likesCount });
  } catch (error) {
    return res.status(500).json({ message: "Failed to unlike blog", error: error.message });
  }
};

export { 
  createBlogController, 
  getAllBlogController, 
  getSingleBlogController,
  getUserBlogsController,
  updateBlogController, 
  deleteBlogController, 
  likeBlogController,
  unlikeBlogController
};
