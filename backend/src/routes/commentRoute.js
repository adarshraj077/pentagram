import express from "express";
const commentRoute = express.Router({ mergeParams: true });
import { createCommentController, getCommentsController, deleteCommentController } from "../controllers/commentController.js";
import checkToken from "../middlewares/protectedRoute.js";

commentRoute.get("/", checkToken, getCommentsController);
commentRoute.post("/", checkToken, createCommentController);
commentRoute.delete("/:commentId", checkToken, deleteCommentController);

export default commentRoute;