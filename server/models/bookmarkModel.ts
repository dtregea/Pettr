import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Types.ObjectId,
      ref: "post",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Bookmark", bookmarkSchema);
