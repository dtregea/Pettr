const router = require("express").Router();
const followController = require("../controllers/followController");

router
  .route("/api/follow")
  .get((req, res) => {
    console.log("GET /api/follow invoked");
    followController.getFollows(req, res);
  })
  .post((req, res) => {
    console.log("POST /api/follow invoked");
    followController.followUser(req, res);
  })
  .put((req, res) => {
    console.log("PUT /api/follow invoked");
    res.status(400).json({ error: "Invalid operation" });
  })
  .patch((req, res) => {
    console.log("PATCH /api/follow invoked");
    res.status(400).json({ error: "Invalid operation" });
  })
  .delete((req, res) => {
    console.log("DELETE /api/follow invoked");
    // unfollow user
    res.status(400).json({ error: "To be implemented" });
  });

module.exports = router;
