const mongoose = require("mongoose");

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
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://i.pinimg.com/736x/10/91/2a/10912a2b1126cf695fab4a9d7b4e11df.jpg",
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
