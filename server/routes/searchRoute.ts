import {Router} from "express";
const router = Router();
import authController from "../controllers/authController";
import searchController from "../controllers/searchController";

router.get(
  "/api/search",
  authController.verifyToken,
  searchController.searchPhrase
);

export default router;
