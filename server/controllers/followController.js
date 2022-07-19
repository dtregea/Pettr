const Follow = require("../models/followModel");
const authController = require("../controllers/authController");
const followController = {
  getFollows: async (req, res) => {
    try {
      let follows = await Follow.find({});
      if (!follows) {
        return res.status(400).json({
          status: "fail",
          message: "No follows found",
        });
      }
      return res.status(200).json({
        follows: follow,
      });
    } catch (err) {
      return res.status(500).json({
        error: err,
      });
    }
  },
  followUser: async (req, res) => {
    try {
      let {followed, follower} = verifyFollowerFields(req, res);
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
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: error,
      });
    }
  },
  unfollowUser: async (req, res) => {
    try {
      let {followed, follower} = verifyFollowerFields(req, res);
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
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.toString(),
      });
    }
  },
};

function verifyFollowerFields(req, res) {
  try {
    let {followed, follower} = req.query;

    if (!followed || !follower) {
      return res.status(400).json({
        status: "fail",
        message: "Missing required fields: followed, follower",
      });
    }

    if(!authController.verifyId(req, follower)){
      return res.status(403).json({
        status: "fail",
        message: "You are not allowed to follow as another user" ,
      });
    }

    return req.query;
  } catch (error) {
    return res.status(500).json({
      status: "Error in verifying follower fields",
      message: error.toString(),
    });
  }
}
module.exports = followController;
