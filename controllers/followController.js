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
  followUser: (req, res) => {
    try {
      let followed = req.query.followedId;
      let follower = req.query.followerId;
      Follow.find(
        { followed: followed, follower: follower },
        (error, follow) => {
          if (error) {
            return res.status(500).json({ error: error.toString() });
          } else if (follow.length > 0) {
            return res
              .status(400)
              .json({ error: "User is already being followed" });
          } else if (follow.length === 0) {
            //create follower
            new Follow({
              followed: followed,
              follower: follower,
            }).save();
            res.status(200).json({ success: true });
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  },
  unfollowUser: (req, res) => {
    try {
      let followed = req.query.followedId;
      let follower = req.query.followerId;
      Follow.deleteOne(
        { followed: followed, follower: follower },
        (error, result) => {
          if (error) {
            return res.status(500).json({ error: error.toString() });
          } else if (result) {
            if (result.deletedCount === 0) {
              res.status(400).json({ error: "No follower relationship" });
            } else {
              res.status(200).json({ success: true });
            }
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  },
};

module.exports = followController;
