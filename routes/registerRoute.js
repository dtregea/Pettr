const router = require("express").Router();
const accountController = require("../controllers/accountController");

router.route("/api/register").post(function (req, res) {
  accountController.registerUser(req, res);
});

module.exports = router;
