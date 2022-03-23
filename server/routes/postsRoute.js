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
    res.status(400).json({ error: "Not allowed" });
  });

router
  .route("/api/posts/:id")
  .get(authController.verifyToken, postsController.getPost)
  .post(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .put(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .patch(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .delete(
    authController.verifyToken,
    authController.verifySameUser,
    postsController.deletePost
  );

module.exports = router;
