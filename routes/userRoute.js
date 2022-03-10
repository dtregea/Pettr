const router = require("express").Router();
const userController = require("../controllers/userController");

router.route("/api/user/:token/avatar").get((req, res) => {
  userController.getAvatar(req, res);
});

router.route("/api/user/:token/feed").get((req, res) => {
  userController.getFeed(req, res);
});

module.exports = router;
