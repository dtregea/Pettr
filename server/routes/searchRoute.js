const router = require("express").Router();
const authController = require("../controllers/authController");
const searchController = require("../controllers/searchController");

router.get(
  "/api/search",
  authController.verifyToken,
  searchController.searchPhrase
);

module.exports = router;
