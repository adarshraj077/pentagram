import express from "express";
const userRoute = express.Router();
import {
  signupController,
  loginController,
  logoutController,
  followUserController,
  unfollowUserController,
  getUserProfileController,
  getAllUsersController,
  updateUserProfileController,
  getMeController,
} from "../controllers/userController.js";
import checkToken from "../middlewares/protectedRoute.js";
import upload from "../middlewares/multer.js";

userRoute.post("/signup", signupController);
userRoute.post("/login", loginController);
userRoute.post("/logout", checkToken, logoutController);
userRoute.get("/all", checkToken, getAllUsersController);
userRoute.post("/update", checkToken, upload.single("profilePic"), updateUserProfileController);
userRoute.post("/follow/:id", checkToken, followUserController);
userRoute.post("/unfollow/:id", checkToken, unfollowUserController);
userRoute.get("/me", checkToken, getMeController);
userRoute.get("/:id", getUserProfileController);
export default userRoute;
