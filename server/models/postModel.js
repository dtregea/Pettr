const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      maxlength: 280,
    },
    images: [
      {
        type: [String],
        maxlength: 4,
        default: undefined,
      },
    ],
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
      { timestamps: true },
    ],
    // !isReply && !isRepost = Regular Post
    // isReply && !isRepost = Comment
    // !isReply && isRepost = Repost
    // isReply && isRepost = Quote Repost
    replyTo: { type: mongoose.Types.ObjectId, ref: "post" },

    // comments
    comments: [
      {
        type: mongoose.Types.ObjectId,
        ref: "post",
      },
    ],
    // reposts and quote reposts
    reposts: [
      {
        type: mongoose.Types.ObjectId,
        ref: "post",
      },
    ],
    isReply: { type: Boolean, required: true },
    isRepost: { type: Boolean, required: true },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
