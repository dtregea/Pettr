const router = require("express").Router();
const accountController = require("../controllers/accountController");

router.route("/api/login").post(function (req, res) {
  console.log("Login route invoked");
  accountController.loginUser(req, res);
});

module.exports = router;
