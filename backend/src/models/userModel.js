import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 11,
      maxlength: 30,
      validate: {
        validator: function (v) {
          return v.endsWith("@gmail.com");
        },
        message: (props) =>
          `${props.value} must be a valid @gmail.com address.`,
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 60,
    },
    profilePic: {
      type: String,
      default: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
    },
    bio: {
      type: String,
      default: "",
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true },
);

const userModel = mongoose.model("user", userSchema);

export default userModel;
