const router = require("express").Router();
const postsController = require("../controllers/postsController");

router.route("/api/posts/:token").post((req, res) => {
  console.log("POST /posts invoked");
  postsController.createPost(req, res);
});

module.exports = router;
