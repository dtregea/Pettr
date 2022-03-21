const router = require("express").Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

router
  .route("/api/users/")
  .get(authController.verifyToken, userController.getUsers)
  .post(authController.verifyToken, userController.createUser)
  .put(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Specify a username" });
  })
  .patch(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Specify a username" });
  })
  .delete(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Not allowed" });
  });

router
  .route("/api/users/:id")
  .get(authController.verifyToken, userController.getUser)
  .post(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .put((req, res) => {
    userController.replaceUser(req, res);
  })
  .patch((req, res) => {
    userController.updateUser(req, res);
  })
  .delete(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Not today!" });
  });

router
  .route("/api/users/:id/displayname")
  .get(authController.verifyToken, userController.getDisplayname)
  .post(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .put(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .patch((req, res) => {
    userController.updateDisplayname(req, res);
  })
  .delete(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "To be implemented... with security...!" });
  });

router
  .route("/api/users/:id/avatar")
  .get(authController.verifyToken, userController.getAvatar)
  .post(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .put(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .patch(authController.verifyToken, userController.updateAvatar)
  .delete(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "To be implemented... with security...!" });
  });

router
  .route("/api/users/:id/bio")
  .get(authController.verifyToken, userController.getBio)
  .post(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .put(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .patch(authController.verifyToken, userController.updateBio)
  .delete(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "To be implemented... with security...!" });
  });

router
  .route("/api/users/:id/bookmarks")
  .get(authController.verifyToken, userController.getBookmarks)
  .post(authController.verifyToken, userController.addBookmark)
  .put(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .patch(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .delete(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "To be implemented... with security...!" });
  });

router
  .route("/api/users/:id/feed")
  .get(authController.verifyToken, userController.getFeed)
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
  .route("/api/users/:id/followers")
  .get(authController.verifyToken, userController.getFollowers)
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
  .route("/api/users/:id/following")
  .get(authController.verifyToken, userController.getFollowing)
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

module.exports = router;
