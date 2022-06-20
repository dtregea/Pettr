const multer = require("multer");
uuidv1 = require("uuidv1");
const DIR = "./uploads/";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, DIR);
//   },
//   filename: (req, file, cb) => {
//     const fileName =
//       file.originalname.toLowerCase().split(" ").join("-") +
//       Date.now().toString();
//     cb(null, uuidv1() + "-" + fileName);
//   },
// });

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/gif"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg, .jpeg, and gif formats allowed."));
    }
  },
});
