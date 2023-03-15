import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    displayname: {
      type: String,
      required: true,
      trim: true,
      maxlength: 25,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      maxlength: 25,
      unique: true,
    },
    verified: Boolean,
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/pettr/image/upload/v1655747200/10912a2b1126cf695fab4a9d7b4e11df_fxvy75.jpg",
    },
    bio: {
      type: String,
      maxlength: 140,
    },
    visibility: {
      type: String,
    },
    logins: [
      {
        type: Date,
      },
    ],
    bookmarks: [
      {
        type: mongoose.Types.ObjectId,
        ref: "bookmark",
      },
    ],
    refreshToken: String,
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
