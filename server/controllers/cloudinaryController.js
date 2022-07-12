const cloudinary = require("../middleware/cloudinary");

const cloudinaryController = {
  uploadImage: async (filePath, folder) => {
    return cloudinary.uploader.upload(filePath, {
      folder: folder,
    });
  },
};

module.exports = cloudinaryController;
