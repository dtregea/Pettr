const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      maxlength: 280,
    },
    images: {
      type: [String],
      ref: "Image",
      maxlength: 4,
      default: undefined,
    },

    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
      { timestamps: true },
    ],

    // comments
    comments: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Post",
      },
    ],
    // reposts and quote reposts
    reposts: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Repost",
      },
    ],

    quotes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Post",
      },
    ],
    isComment: { type: Boolean, required: true },
    isQuote: { type: Boolean, required: true },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    pet: {
      type: mongoose.Types.ObjectId,
      ref: "Pet",
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
