const router = require("express").Router();
const postsController = require("../controllers/postsController");
const authController = require("../controllers/authController");
router
  .route("/api/posts/")
  .get(authController.verifyToken, postsController.getPosts)
  .post(authController.verifyToken, postsController.createPost);

module.exports = router;
