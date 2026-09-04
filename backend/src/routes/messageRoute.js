import express from "express";
import { getMessages, sendMessage } from "../controllers/messageController.js";
import checkToken from "../middlewares/protectedRoute.js";

const messageRoute = express.Router();

messageRoute.get("/:id", checkToken, getMessages);
messageRoute.post("/send/:id", checkToken, sendMessage);

export default messageRoute;
