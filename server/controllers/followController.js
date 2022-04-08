const Follow = require("../models/followModel");
const followController = {
  getFollows: (req, res) => {
    try {
      Follow.find({}, (error, follow) => {
        if (error) {
          return res.status(500).json({ error: error.toString() });
        } else if (follow) {
          res.status(200).json({ follows: follow });
        }
      });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  },
  followUser: async (req, res) => {
    try {
      let followed = req.query.followed;
      let follower = req.query.follower;
      let relationship = await Follow.findOne({
        followed: followed,
        follower: follower,
      });
      if (!relationship) {
        new Follow({ followed: followed, follower: follower }).save((error) => {
          if (!error) {
            return res.status(200).json({
              status: "success",
              data: { isFollowed: true },
            });
          }
        });
      } else {
        return res.status(400).json({
          status: "fail",
          data: { user: "User is already being followed" },
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "error", message: error });
    }
  },
  unfollowUser: async (req, res) => {
    try {
      let followed = req.query.followed;
      let follower = req.query.follower;
      console.log(`${followed}\n${follower}`);
      let relationship = await Follow.findOne({
        followed: followed,
        follower: follower,
      });

      if (relationship) {
        Follow.deleteOne(
          { followed: followed, follower: follower },
          (error, result) => {
            if (error) {
              return res
                .status(500)
                .json({ status: "error", message: error.toString() });
            } else if (result) {
              if (result.deletedCount > 0) {
                return res
                  .status(200)
                  .json({ status: "success", data: { followedByUser: false } });
              }
            }
          }
        );
      } else {
        res
          .status(400)
          .json({ status: "fail", data: { user: "No follower relationship" } });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
};

module.exports = followController;
