import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blog",
      required: true,
    },
    text: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 200,
    },
  },
  { timestamps: true },
);

commentSchema.index({ post: 1 });

const commentModel = mongoose.model("comment", commentSchema);
export default commentModel;
