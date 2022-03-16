const mongoose = require("mongoose");

const bookmarkSchema = mongoose.Schema(
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

module.exports = mongoose.model("Bookmark", bookmarkSchema);
