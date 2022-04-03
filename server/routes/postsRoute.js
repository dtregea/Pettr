const router = require("express").Router();
const postsController = require("../controllers/postsController");
const authController = require("../controllers/authController");
const multer = require("multer");
uuidv1 = require("uuidv1");
const DIR = "./uploads/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName =
      file.originalname.toLowerCase().split(" ").join("-") +
      Date.now().toString();
    cb(null, uuidv1() + "-" + fileName);
  },
});

var upload = multer({
  storage: storage,
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
  .route("/api/posts/:id/repost")
  .get(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .post(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .put(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .patch(authController.verifyToken, postsController.repost)
  .delete(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  });

router
  .route("/api/posts/:id/unrepost")
  .get(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .post(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .put(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .patch(authController.verifyToken, postsController.undoRepost)
  .delete(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  });

router
  .route("/api/posts/:id/comments")
  .get(authController.verifyToken, postsController.getComments)
  .post(authController.verifyToken, postsController.postComment)
  .put(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .patch(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .delete(authController.verifyToken, (req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  });

// To do
// router
//   .route("/api/posts/:id/images")
//   .get(authController.verifyToken, postsController.getImages)
//   .post(authController.verifyToken, postsController.postImages)
//   .put(authController.verifyToken, (req, res) => {
//     res.status(400).json({ error: "Invalid operation" });
//   })
//   .patch(authController.verifyToken, (req, res) => {
//     res.status(400).json({ error: "Invalid operation" });
//   })
//   .delete(authController.verifyToken, (req, res) => {
//     res.status(400).json({ error: "Implementation soon" });
//   });

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
  .post(
    upload.single("image"),
    authController.verifyToken,

    postsController.createPost
  )
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
