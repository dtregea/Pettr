import {Router} from "express";
const router = Router();

import authController from "../controllers/authController";
import followController from "../controllers/followController";

router
  .route("/api/follow")
  .get((req, res) => {
    followController.getFollows(req, res);
  })
  .post((req, res) => {
    authController.verifySameUser,
    followController.followUser(req, res);
  })
  .put((req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .patch((req, res) => {
    res.status(400).json({ error: "Invalid operation" });
  })
  .delete((req, res) => {
    authController.verifySameUser,
    followController.unfollowUser(req, res);
  });

  export default router;
