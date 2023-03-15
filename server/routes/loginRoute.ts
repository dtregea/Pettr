import {Router} from "express";
const router = Router();
import authController from "../controllers/authController";

router.route("/api/login").post(function (req, res) {
  authController.loginUser(req, res);
});

export default router;
