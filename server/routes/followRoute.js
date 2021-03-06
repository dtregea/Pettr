const router = require("express").Router();
const followController = require("../controllers/followController");

router
  .route("/api/follow")
  .get((req, res) => {
    followController.getFollows(req, res);
  })
  .post((req, res) => {
    followController.followUser(req, res);
  })
  .put((req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .patch((req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .delete((req, res) => {
    followController.unfollowUser(req, res);
  });

module.exports = router;
