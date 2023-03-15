import {Router} from "express";
const router = Router();
import authController from "../controllers/authController";
import petController from "../controllers/petController";

router
  .route("/api/pets")
  .get(authController.verifyToken, petController.getPets);

  export default router;
