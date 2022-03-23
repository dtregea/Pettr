const router = require("express").Router();
const postsController = require("../controllers/postsController");
const authController = require("../controllers/authController");
router
  .route("/api/posts/")
  .get(authController.verifyToken, postsController.getPosts)
  .post(authController.verifyToken, postsController.createPost)
  .put(
    authController.verifyToken,
    authController.verifySameUser,
    (req, res) => {
      res.status(400).json({ error: "Invalid operation" });
    }
  )
  .patch(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .delete(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "To be implemented" });
  });

module.exports = router;
