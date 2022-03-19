const router = require("express").Router();
const postsController = require("../controllers/postsController");

router
  .route("/api/posts/")
  .get((req, res) => {
    console.log("GET api/posts invoked");
    postsController.getPosts(req, res);
  })
  .post((req, res) => {
    console.log("POST api/posts invoked");
    postsController.createPost(req, res);
  });

module.exports = router;
