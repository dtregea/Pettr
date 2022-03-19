const router = require("express").Router();
const userController = require("../controllers/userController");

// TODO pass in parameters instead of entire request and response
// Let this route handle the responses, have controller just handle data
router
  .route("/api/users/")
  .get((req, res) => {
    console.log("GET /api/users/ invoked");
    userController.getUsers(req, res);
  })
  .post((req, res) => {
    let startTime = performance.now();
    userController.createUser(req, res);
    console.log(
      `POST /api/users/ invoked and served in ${
        performance.now() - startTime
      } milliseconds`
    );
  })
  .put((req, res) => {
    console.log("PUT /api/users/ invoked");
    res.status(400).json({ error: "Specify a username" });
  })
  .patch((req, res) => {
    console.log("PATCH /api/users/ invoked");
    res.status(400).json({ error: "Specify a username" });
  })
  .delete((req, res) => {
    console.log("DELETE /api/users/ invoked");
    res.status(400).json({ error: "Not allowed" });
  });

router
  .route("/api/users/:id")
  .get((req, res) => {
    console.log("GET /api/users/:id invoked");
    userController.getUser(req, res);
  })
  .post((req, res) => {
    console.log("POST /api/users/:id invoked");
    res.status(400).json({ error: "Invalid operation" });
  })
  .put((req, res) => {
    console.log("PUT /api/users/:id invoked");
    userController.replaceUser(req, res);
  })
  .patch((req, res) => {
    console.log("PATCH /api/users/:id invoked");
    userController.updateUser(req, res);
  })
  .delete((req, res) => {
    console.log("DELETE /api/users/:id invoked");
    res.status(400).json({ error: "Not today!" });
  });

router
  .route("/api/users/:id/displayname")
  .get((req, res) => {
    console.log("GET /api/users/:id/displayname invoked");
    userController.getDisplayname(req, res);
  })
  .post((req, res) => {
    console.log("POST /api/users/:id/displayname invoked");
    res.status(400).json({ error: "Invalid operation" });
  })
  .put((req, res) => {
    console.log("PUT /api/users/:id/displayname invoked");
    res.status(400).json({ error: "Invalid operation" });
  })
  .patch((req, res) => {
    console.log("PATCH /api/users/:id/displayname invoked");
    userController.updateDisplayname(req, res);
  })
  .delete((req, res) => {
    console.log("DELETE /api/users/:id/displayname invoked");
    res.status(400).json({ error: "To be implemented... with security...!" });
  });

router
  .route("/api/users/:id/avatar")
  .get((req, res) => {
    console.log("GET /api/users/:id/avatar invoked");
    userController.getAvatar(req, res);
  })
  .post((req, res) => {
    console.log("POST /api/users/:id/avatar invoked");
    res.status(400).json({ error: "Invalid operation" });
  })
  .put((req, res) => {
    console.log("PUT /api/users/:id/avatar invoked");
    res.status(400).json({ error: "Invalid operation" });
  })
  .patch((req, res) => {
    console.log("PATCH /api/users/:id/avatar invoked");
    userController.updateAvatar(req, res);
  })
  .delete((req, res) => {
    console.log("DELETE /api/users/:id/avatar invoked");
    res.status(400).json({ error: "To be implemented... with security...!" });
  });

router
  .route("/api/users/:id/bio")
  .get((req, res) => {
    console.log("GET /api/users/:id/bio invoked");
    userController.getBio(req, res);
  })
  .post((req, res) => {
    console.log("POST /api/users/:id/bio invoked");
    res.status(400).json({ error: "Invalid operation" });
  })
  .put((req, res) => {
    console.log("PUT /api/users/:id/bio invoked");
    res.status(400).json({ error: "Invalid operation" });
  })
  .patch((req, res) => {
    console.log("PATCH /api/users/:id/bio invoked");
    userController.updateBio(req, res);
  })
  .delete((req, res) => {
    console.log("DELETE /api/users/:id/bio invoked");
    res.status(400).json({ error: "To be implemented... with security...!" });
  });

router
  .route("/api/users/:id/bookmarks")
  .get((req, res) => {
    console.log("GET /api/users/:id/bookmarks invoked");
    userController.getBookmarks(req, res);
  })
  .post((req, res) => {
    console.log("POST /api/users/:id/bookmarks invoked");
    userController.addBookmark(req, res);
  })
  .put((req, res) => {
    console.log("PUT /api/users/:id/bookmarks invoked");
    res.status(400).json({ error: "Invalid operation" });
  })
  .patch((req, res) => {
    console.log("PATCH /api/users/:id/bookmarks invoked");
    res.status(400).json({ error: "Invalid operation" });
  })
  .delete((req, res) => {
    console.log("DELETE /api/users/:id/bookmarks invoked");
    res.status(400).json({ error: "To be implemented... with security...!" });
  });

router
  .route("/api/users/:id/feed")
  .get((req, res) => {
    let startTime = performance.now();
    userController.getFeed(req, res);
    console.log(
      `GET /api/users/:id/feed invoked and served in ${
        performance.now() - startTime
      } ms`
    );
  })
  .post((req, res) => {
    console.log("POST /api/users/:id/feed invoked");
    res.status(400).json({ error: "Invalid operation" });
  })
  .put((req, res) => {
    console.log("PUT /api/users/:id/feed invoked");
    res.status(400).json({ error: "Invalid operation" });
  })
  .patch((req, res) => {
    console.log("PATCH /api/users/:id/feed invoked");
    res.status(400).json({ error: "Invalid operation" });
  })
  .delete((req, res) => {
    console.log("DELETE /api/users/:id/feed invoked");
    res.status(400).json({ error: "Invalid operation" });
  });

router
  .route("/api/users/:id/following")
  .get((req, res) => {
    console.log("GET /api/users/:id/following invoked");
    userController.getFollowing(req, res);
  })
  .post((req, res) => {
    console.log("POST /api/users/:id/following invoked");
    res.status(400).json({ error: "Invalid operation" });
  })
  .put((req, res) => {
    console.log("PUT /api/users/:id/following invoked");
    res.status(400).json({ error: "Invalid operation" });
  })
  .patch((req, res) => {
    console.log("PATCH /api/users/:id/following invoked");
    res.status(400).json({ error: "Invalid operation" });
  })
  .delete((req, res) => {
    console.log("DELETE /api/users/:id/following invoked");
    res.status(400).json({ error: "Invalid operation" });
  });

module.exports = router;
