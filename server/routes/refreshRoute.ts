import {Router} from "express";
const router = Router();
import authController from "../controllers/authController";

router.get("/api/refresh", authController.handleRefreshToken);

export default router;
