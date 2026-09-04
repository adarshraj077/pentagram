import mongoose from "mongoose";

const connectDB = async () => {
  const url = process.env.URL;
  if (!url) {
    throw new Error("MongoDB URL is not defined in environment variables");
  }
  if (mongoose.connection.readyState === 1) {
    return;
  }
  await mongoose.connect(url);
  console.log("Mongo DB connected");
};

export default connectDB;
