import { Message } from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../config/socket.js";

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.userId;

    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: userToChatId },
        { sender: userToChatId, receiver: senderId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Error in getMessages: ", error.message);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.userId;

    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      text,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Error in sendMessage: ", error.message);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
