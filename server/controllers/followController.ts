import Follow from "../models/followModel";
import authController from "../controllers/authController";
import { Request, Response } from "express";
const followController = {
  getFollows: async (req: Request, res: Response) => {
    try {
      let follows = await Follow.find({});
      if (!follows) {
        return res.status(400).json({
          status: "fail",
          message: "No follows found",
        });
      }
      return res.status(200).json({
        follows: follows,
      });
    } catch (err) {
      return res.status(500).json({
        error: err,
      });
    }
  },
  followUser: async (req: Request, res: Response) => {
    try {
      const validResult = verifyFollowerFields(req);

      if (!validResult?.valid) {
        return res.status(400).json({
          status: "fail",
          message: validResult?.message,
        });
      }

      let {followed, follower} = req.query;

      let relationship = await Follow.findOne({
        followed: followed,
        follower: follower,
      });
      if (relationship) {
        return res.status(400).json({
          status: "fail",
          message: "User is already being followed",
        });
      }
      let newRelationship = await new Follow({
        followed: followed,
        follower: follower,
      }).save();

      if (!newRelationship) {
        return res.status(400).json({
          status: "fail",
          message: "Failed to follow",
        });
      }
      return res.status(200).json({
        status: "success",
        data: {
          isFollowed: true,
        },
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: error,
      });
    }
  },
  unfollowUser: async (req: Request, res: Response) => {
    try {
      const validResult = verifyFollowerFields(req);

      if (!validResult?.valid) {
        return res.status(400).json({
          status: "fail",
          message: validResult?.message,
        });
      }

      let {followed, follower} = req.query;
      let relationship = await Follow.findOne({
        followed: followed,
        follower: follower,
      });

      if (!relationship) {
        return res.status(400).json({
          status: "fail",
          message: "User is not being followed",
        });
      }

      let deletedRelationship = await Follow.deleteOne({
        followed: followed,
        follower: follower,
      });

      if (!deletedRelationship) {
        return res.status(400).json({
          status: "fail",
          message: "Failed to unfollow",
        });
      }

      return res.status(200).json({
        status: "success",
        data: {
          followedByUser: false,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        status: "error",
        message: error.toString(),
      });
    }
  },
};

function verifyFollowerFields(req: Request) {
  let response = {valid: false, message: ""};
  try {
    
    let {followed, follower} = req.query;

    if (!followed || !follower) {
      response.message = "Missing required fields: followed, follower";
      return response;
    }

    if(!authController.verifyId(req, follower as string)){
      response.message = "You are not allowed to follow as another user";
      return response;
    }

    response.valid = true;
    return response;
  } catch (error: any) {
    response.message = "Unknown error in verifying follower fields";
  }
}
export default followController;
