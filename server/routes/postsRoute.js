const router = require("express").Router();
const postsController = require("../controllers/postsController");
const authController = require("../controllers/authController");

router
  .route("/api/posts/trending")
  .get(authController.verifyToken, postsController.getTrending)
  .post(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .put(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .patch(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .delete(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  });

router
  .route("/api/posts/:id/like")
  .get(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .post(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .put(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .patch(authController.verifyToken, postsController.likePost)
  .delete(
    authController.verifyToken,
    authController.verifySameUser,
    postsController.unlikePost
  );

router
  .route("/api/posts/:id/unlike")
  .get(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .post(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .put(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .patch(authController.verifyToken, postsController.unlikePost)
  .delete(
    authController.verifyToken,
    authController.verifySameUser,
    postsController.unlikePost
  );

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

// post info routes

module.exports = router;
