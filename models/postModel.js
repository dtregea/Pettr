const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    content: String,
    images: {
      type: Array,
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
    replies: [
      {
        type: mongoose.Types.ObjectId,
        ref: "reply",
      },
    ],
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("post", postSchema);
