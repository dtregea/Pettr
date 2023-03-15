const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CDN_NAME,
  api_key: process.env.CDN_KEY,
  api_secret: process.env.CDN_SECRET,
  secure: true,
});

export default cloudinary;
