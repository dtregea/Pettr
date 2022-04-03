const mongoose = require("mongoose");

const imageSchema = mongoose.Schema(
  {
    img: {
      data: Buffer,
      contentType: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Image", imageSchema);
