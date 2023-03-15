import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      maxlength: 280,
    },
    images: {
      type: [String],
      maxlength: 4,
    },

    replyTo: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
    },

    isComment: { type: Boolean, required: true },
    isQuote: { type: Boolean, required: true },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    pet: {
      type: mongoose.Types.ObjectId,
      ref: "Pet",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Post", postSchema);
