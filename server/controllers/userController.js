const Post = require("../models/postModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const Follow = require("../models/followModel");
const authController = require("./authController");
const { default: mongoose } = require("mongoose");
const userController = {
  getUsers: (req, res) => {
    try {
      User.find({}, (error, users) => {
        if (error) {
          return res
            .status(500)
            .json({ status: "error", message: error.toString() });
        } else if (users) {
          return res
            .status(200)
            .json({ status: "success", data: { users: users } });
        }
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
  getUser: (req, res) => {
    try {
      User.findOne({ _id: req.params.id }, (error, user) => {
        if (error) {
          return res
            .status(400)
            .json({ status: "fail", message: error.toString() });
        } else if (user) {
          return res
            .status(200)
            .json({ status: "success", data: { user: user } });
        }
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
  createUser: async (req, res) => {
    try {
      const newPassword = await bcrypt.hash(req.body.password, 10);
      User.create(
        {
          username: req.body.username,
          displayname: req.body.displayname,
          password: newPassword,
        },
        (error, user) => {
          if (error) {
            console.log("printing error: " + error);
            if (error.code === 11000) {
              return res.status(400).json({
                status: "fail",
                data: { username: "Username already exists" },
              });
            } else {
              return res
                .status(400)
                .json({ status: "error", message: error.toString() });
            }
          } else if (user) {
            const token = authController.createToken(
              user._id,
              req.body.username
            );
            return res
              .status(200)
              .json({ status: "success", data: { token: token, user: user } });
          }
        }
      );
    } catch (error) {
      return res
        .status(500)
        .json({ status: "success", message: error.toString() });
    }
  },
  replaceUser: (req, res) => {
    try {
      const updatedAttributes = {};
      // Do not replace the user id
      if (req.query._id) {
        delete req.query._id;
      }
      // Dynamically add new attributes to user
      for (let attr in req.query) {
        updatedAttributes[attr] = req.query[attr];
      }
      User.replaceOne(
        { _id: req.params.id },
        updatedAttributes,
        (error, user) => {
          if (error) {
            return res
              .status(400)
              .json({ status: "fail", data: { user: error.toString() } });
          } else if (user) {
            return res
              .status(200)
              .json({ status: "success", data: { user: user } });
          }
        }
      );
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
  updateUser: (req, res) => {
    try {
      const updatedAttributes = {};
      // Do not update the user id
      if (req.query._id) {
        delete req.query._id;
      }
      for (let attr in req.query) {
        updatedAttributes[attr] = req.query[attr];
      }
      User.updateOne(
        { _id: req.params.id },
        updatedAttributes,
        (error, user) => {
          if (error) {
            return res
              .status(400)
              .json({ status: "fail", data: { user: error.toString() } });
          } else if (user) {
            return res
              .status(200)
              .json({ status: "success", data: { user: user } });
          }
        }
      );
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
  getDisplayname: (req, res) => {
    try {
      User.findOne({ _id: req.params.id }, (error, user) => {
        if (error) {
          return res
            .status(400)
            .json({ status: "fail", data: { user: error.toString() } });
        } else if (user) {
          return res.status(200).json({
            status: "success",
            data: { displayname: user.displayname },
          });
        }
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
  updateDisplayname: (req, res) => {
    try {
      User.updateOne(
        { _id: req.params.id },
        { displayname: req.query.displayname },
        (error, user) => {
          if (error) {
            return res
              .status(400)
              .json({ status: "fail", data: { user: error.toString() } });
          } else if (user) {
            return res.status(200).json({
              status: "success",
              data: { displayname: user.displayname },
            });
          }
        }
      );
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
  getUsername: (req, res) => {
    try {
      User.findOne({ _id: req.params.id }, (error, user) => {
        if (error) {
          return res
            .status(400)
            .json({ status: "fail", data: { user: error.toString() } });
        } else if (user) {
          return res.status(200).json({
            status: "success",
            data: { username: user.username },
          });
        }
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
  getAvatar: (req, res) => {
    try {
      User.findOne({ _id: req.params.id }, (error, user) => {
        if (error) {
          return res
            .status(400)
            .json({ status: "fail", data: { user: error.toString() } });
        } else if (user) {
          return res
            .status(200)
            .json({ status: "success", data: { avatar: user.avatar } });
        }
      });
    } catch (err) {
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
  updateAvatar: (req, res) => {
    try {
      User.updateOne(
        { _id: req.params.id },
        { avatar: req.query.avatar },
        (error, user) => {
          if (error) {
            return res
              .status(400)
              .json({ status: "fail", data: { user: error.toString() } });
          } else if (user) {
            return res
              .status(200)
              .json({ status: "success", data: { avatar: user.avatar } });
          }
        }
      );
    } catch (err) {
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
  getBio: (req, res) => {
    try {
      User.find({ _id: req.params.id }, (error, user) => {
        if (error) {
          return res
            .status(400)
            .json({ status: "fail", data: { user: error.toString() } });
        } else if (user) {
          return res
            .status(200)
            .json({ status: "success", data: { bio: user.bio } });
        }
      });
    } catch (err) {
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
  updateBio: (req, res) => {
    try {
      User.updateOne(
        { _id: req.params.id },
        { bio: req.query.bio },
        (error, user) => {
          if (error) {
            return res
              .status(400)
              .json({ status: "fail", data: { user: error.toString() } });
          } else if (user) {
            return res
              .status(200)
              .json({ status: "success", data: { bio: user.bio } });
          }
        }
      );
    } catch (err) {
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
  getBookmarks: (req, res) => {
    try {
      User.find({ _id: req.params.id }, (error, user) => {
        if (error) {
          return res
            .status(400)
            .json({ status: "fail", data: { user: error.toString() } });
        } else if (user) {
          return res
            .status(200)
            .json({ status: "success", data: { bookmarks: user.bookmarks } });
        }
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
  addBookmark: (req, res) => {
    try {
      User.find({ _id: req.params.id }, (error, user) => {
        if (error) {
          return res
            .status(400)
            .json({ status: "fail", data: { user: error.toString() } });
        } else if (user) {
          user.bookmarks.push(req.query.postId);
          user.save();
          return res
            .status(200)
            .json({ status: "success", data: { bookmark: req.query.posyId } });
        }
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
  // Measure run time of this to optimize later
  getFeed: async (req, res) => {
    try {
      let response = { data: { posts: [] } };
      // Get users that the client is following
      const follows = await Follow.find({ follower: req.params.id });
      if (!follows) {
        return res
          .status(500)
          .json({ status: "error", message: "Following feed error" });
      }

      let matchOrConditions = [];
      let followedIds = [];

      // Get Posts that have been reposted by followed users
      follows.forEach((follow) => {
        matchOrConditions.push({
          reposts: follow.followed._id,
        });
        followedIds.push(follow.followed._id);
      });

      // Get posts and reposts from the client
      followedIds.push(req.user._id);
      matchOrConditions.push({ reposts: req.user._id });

      // Get posts from followed users that are not comments
      matchOrConditions.push({
        $and: [
          {
            $expr: {
              $in: ["$user", followedIds],
            },
          },
          { isComment: false },
        ],
      });

      // Get posts for feed matching either of conditions above
      const posts = await Post.aggregate([
        {
          $match: {
            $or: matchOrConditions,
          },
        },
        // Add a property that indicates whether the user has liked this post
        {
          $addFields: {
            // fix this on trending
            isLiked: {
              $cond: [
                {
                  $in: [req.user._id, "$likes"],
                },
                true,
                false,
              ],
            },
          },
        },
        // Add a property that indicates whether the user has reposted this post
        {
          $addFields: {
            // fix this on trending
            isReposted: {
              $cond: [
                {
                  $in: [req.user._id, "$reposts"],
                },
                true,
                false,
              ],
            },
          },
        },
        // Get a list of followed people who reposted this post
        {
          $addFields: {
            repostedBy: {
              $filter: {
                input: "$reposts",
                as: "user",
                cond: { $in: ["$$user", followedIds] },
              },
            },
          },
        },
        // Get user info on reposters
        {
          $lookup: {
            from: "users",
            localField: "repostedBy",
            foreignField: "_id",
            as: "repostedBy",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        // Convert the author info array to a single user object
        {
          $unwind: "$user",
        },
        // Sort by newest to oldest
        { $sort: { createdAt: -1 } },
      ]);

      if (!posts) {
        return res
          .status(500)
          .json({ status: "error", message: "Feed posts error" });
      }
      posts.forEach((post) => {
        response.data.posts.push({
          id: post._id,
          user: post.user,
          text: post.content,
          image: post.images == null ? [] : post.images[0],
          trendingView: false,
          timestamp: post.createdAt,
          likeCount: post.likes.length,
          commentCount: post.comments.length,
          repostCount: post.reposts.length,
          isLiked: post.isLiked,
          isQuote: post.isQuote,
          isComment: post.isComment,
          isReposted: post.isReposted,
          repostedBy:
            post.repostedBy.length > 0 ? post.repostedBy[0].displayname : null,
        });
      });

      response.status = "success";
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
  getFollowers: (req, res) => {
    try {
      Follow.find({ followed: req.params.id }, (error, follows) => {
        if (error) {
          return res
            .status(500)
            .json({ status: "error", message: error.toString() });
        } else if (follows) {
          let followers = follows.map((follow) => follow.follower._id);
          return res
            .status(200)
            .json({ status: "success", data: { followers: followers } });
        }
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
  getFollowing: (req, res) => {
    try {
      Follow.find({ follower: req.params.id }, (error, follows) => {
        if (error) {
          return res
            .status(500)
            .json({ status: "error", message: error.toString() });
        } else if (follows) {
          let followedUsers = follows.map((follow) => follow.followed._id);
          return res
            .status(200)
            .json({ status: "success", data: { followed: followedUsers } });
        }
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
};

module.exports = userController;
