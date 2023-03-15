import cloudinary from "../middleware/cloudinary";

const cloudinaryController = {
  uploadImage: async (filePath, folder) => {
    return cloudinary.uploader.upload(filePath, {
      folder: folder,
    });
  },
  NO_PICTURE_AVAILABLE_LINK: "https://res.cloudinary.com/pettr/image/upload/c_scale,w_240/v1658858420/npa_f2lnez.jpg"
};

export default cloudinaryController;
