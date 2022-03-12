const mongoose = require("mongoose");

const followSchema = mongoose.Schema(
  {
    follower: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    followed: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Follow", followSchema);
