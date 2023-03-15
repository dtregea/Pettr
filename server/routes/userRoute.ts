import {Router} from "express";
const router = Router();
import userController from "../controllers/userController";
import authController from "../controllers/authController";
import upload from "../middleware/multer";
import postController from "../controllers/postsController";

router
  .route("/api/users/")
  .get(authController.verifyToken, userController.getUsers)
  .post(userController.createUser, authController.loginUser)
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
  .route("/api/users/:id")
  .get(authController.verifyToken, userController.getUser)
  .post(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .put(
    authController.verifyToken,
    authController.verifySameUser,
    userController.replaceUser
  )
  .patch(
    authController.verifyToken,
    authController.verifySameUser,
    upload.single("image"),
    userController.updateUser
  )
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
  .patch(
    authController.verifyToken,
    authController.verifySameUser,
    userController.updateDisplayname
  )
  .delete(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "To be implemented... with security...!" });
  });

router
  .route("/api/users/:id/username")
  .get(authController.verifyToken, userController.getUsername)
  .post(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .put(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .patch((req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .delete(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
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
  .patch(
    authController.verifyToken,
    authController.verifySameUser,
    userController.updateAvatar
  )
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
  .patch(
    authController.verifyToken,
    authController.verifySameUser,
    userController.updateBio
  )
  .delete(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "To be implemented... with security...!" });
  });

router
  .route("/api/users/:id/bookmarks")
  .get(
    authController.verifyToken,
    authController.verifySameUser,
    userController.getBookmarks
  )
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
  .route("/api/users/:id/timeline")
  .get(
    authController.verifyToken,
    authController.verifySameUser,
    postController.getTimeline
  )
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

router
  .route("/api/users/:id/posts")
  .get(authController.verifyToken, postController.getProfilePosts)
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
    res.status(400).json({ error: "To be implemented" });
  });

router.route("/api/users/*").all((req, res) => res.sendStatus(404));

export default router;
