const router = require("express").Router();
const authController = require("../controllers/authController");

router.route("/api/login").post(function (req, res) {
  authController.loginUser(req, res);
});

module.exports = router;
