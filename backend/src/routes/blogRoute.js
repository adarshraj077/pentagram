import express from "express";
const blogRoute = express.Router();
import {
  createBlogController,
  getAllBlogController,
  getSingleBlogController,
  getUserBlogsController,
  updateBlogController,
  deleteBlogController,
  likeBlogController,
  unlikeBlogController
} from "../controllers/blogController.js";

import checkToken from "../middlewares/protectedRoute.js";
import upload from "../middlewares/multer.js";

blogRoute.get("/", checkToken, getAllBlogController);
blogRoute.get("/:id", checkToken, getSingleBlogController);
blogRoute.post("/", checkToken, upload.single("image"), createBlogController);
blogRoute.put("/:id", checkToken, updateBlogController);
blogRoute.delete("/:id", checkToken, deleteBlogController);
blogRoute.get("/user/:userId", checkToken, getUserBlogsController);
blogRoute.post("/:id/like", checkToken, likeBlogController);
blogRoute.delete("/:id/like", checkToken, unlikeBlogController);

export default blogRoute;
