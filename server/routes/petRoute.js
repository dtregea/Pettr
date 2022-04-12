const router = require("express").Router();
const authController = require("../controllers/authController");
const petController = require("../controllers/petController");

router
  .route("/api/pets")
  .get(authController.verifyToken, petController.getPets);

module.exports = router;
