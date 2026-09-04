import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blog",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

likeSchema.index({ post: 1, user: 1 }, { unique: true });

const likeModel = mongoose.model("like", likeSchema);
export default likeModel;
