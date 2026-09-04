import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 30,
    },
    content: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 200,
    },
    image: {
      type: String,
      default: "",
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

blogSchema.index({ author: 1, createdAt: -1 });

const blogModel = mongoose.model("blog", blogSchema);
export default blogModel;
