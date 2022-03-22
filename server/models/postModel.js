const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      maxlength: 280,
    },
    images: [
      {
        type: Array,
        maxlength: 4,
      },
    ],
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "like",
      },
    ],
    replyTo: { type: mongoose.Types.ObjectId, ref: "post" },
    isReply: Boolean,
    isRepost: Boolean,
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
