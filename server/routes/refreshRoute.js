const router = require("express").Router();
const authController = require("../controllers/authController");

router.get("/api/refresh", authController.handleRefreshToken);

module.exports = router;
