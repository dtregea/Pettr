const Post = require("../models/postModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const Follow = require("../models/followModel");
const authController = require("./authController");
const { default: mongoose } = require("mongoose");
const constants = require("./mongoConstants");
const userController = {
  getUsers: (req, res) => {
    try {
      User.find(
        {},
        {
          password: 0,
          createdAt: 0,
          updatedAt: 0,
          logins: 0,
          bookmarks: 0,
          __v: 0,
        },
        (error, users) => {
          if (error) {
            return res
              .status(500)
              .json({ status: "error", message: error.toString() });
          } else if (users) {
            return res
              .status(200)
              .json({ status: "success", data: { users: users } });
          }
        }
      );
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await User.findOne(
        { _id: req.params.id },
        {
          password: 0,
          createdAt: 0,
          updatedAt: 0,
          logins: 0,
          bookmarks: 0,
          __v: 0,
        }
      );
      if (!user) {
        return res
          .status(400)
          .json({ status: "fail", data: { user: "Not Found" } });
      }

      const userPosts = await Post.find({ user: user._id });
      const userFollowing = await Follow.find({ follower: user._id }); //convert to sets later?
      const userFollowers = await Follow.find({ followed: user._id });

      // Determine is client is following this user
      const userIdString = req.user.toString();
      let followedByClient = false;
      userFollowers.forEach((relationship) => {
        if (userIdString === relationship.follower._id.toString()) {
          followedByClient = true;
          return true;
        }
      });
      let response = {
        status: "success",
        data: {
          user: user,
          counts: {
            posts: userPosts.length,
            following: userFollowing.length,
            followers: userFollowers.length,
          },
          followedByUser: followedByClient,
        },
      };

      return res.status(200).json(response);
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
            return res.status(200).json({ status: "success" });
          }
        }
      );
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
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
            return res.status(200).json({ status: "success" });
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
            return res.status(200).json({ status: "success" });
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
            .json({ status: "success", data: { bookmark: req.query.postId } });
        }
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
  // Measure run time of this to optimize later
  getTimeline: async (req, res) => {
    try {
      let response = { data: { posts: [] } };
      let page = parseInt(req.query.page); // if no page send error

      // Get users that the client is following
      const follows = await Follow.find({ follower: req.params.id });
      if (!follows) {
        return res
          .status(500)
          .json({ status: "error", message: "Following timeline error" });
      }

      // reposting doesnt show latest repost
      let matchOrConditions = [];
      let followedIds = [];

      // Get posts from the client
      followedIds.push(mongoose.Types.ObjectId(req.user));

      // Get Posts that have been reposted by followed users
      follows.forEach((follow) => {
        matchOrConditions.push({
          reposts: { $elemMatch: { user: follow.followed._id } },
        });
        followedIds.push(follow.followed._id);
      });

      // Get posts that have been reposted by the client
      matchOrConditions.push({
        reposts: { $elemMatch: { user: mongoose.Types.ObjectId(req.user) } },
      });

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

      const posts = await Post.aggregate([
        // Convert Reposts ids to objects
        {
          $lookup: {
            from: "reposts",
            localField: "reposts",
            foreignField: "_id",
            as: "reposts",
          },
        },
        // Get posts for timeline matching either of conditions above
        {
          $match: {
            $or: matchOrConditions,
          },
        },
        // Get a list of reposts made by followed users
        {
          $addFields: {
            repostedBy: {
              $filter: {
                input: "$reposts",
                as: "repost",
                cond: { $in: ["$$repost.user", followedIds] },
              },
            },
          },
        },
        // Get the most recent repost made by a followed user
        {
          $addFields: {
            mostRecentRepost: {
              $cond: [
                {
                  $gt: [{ $size: "$repostedBy" }, 0],
                },
                { $last: "$repostedBy" },
                [],
              ],
            },
          },
        },
        // Convert that most recent repost to a single repost object
        {
          $unwind: {
            path: "$mostRecentRepost",
            preserveNullAndEmptyArrays: true,
          },
        },
        // Determine whether the last interaction was the post creation
        // or a repost made by a followed user
        {
          $addFields: {
            lastInteractionFromUserFollowing: {
              $cond: [
                {
                  $ifNull: ["$mostRecentRepost", false],
                },
                "$mostRecentRepost.createdAt",
                "$createdAt",
              ],
            },
          },
        },
        // Convert repost objects to users
        {
          $lookup: {
            from: "users",
            localField: "reposts.user",
            foreignField: "_id",
            as: "reposts",
          },
        },
        // Convert most recent repost to the user
        {
          $lookup: {
            from: "users",
            localField: "mostRecentRepost.user",
            foreignField: "_id",
            as: "mostRecentRepost",
          },
        },
        // Convert it from an array to a property
        {
          $unwind: {
            path: "$mostRecentRepost",
            preserveNullAndEmptyArrays: true,
          },
        },
        // Add a property that indicates whether the client has reposted this post
        constants.USER_HAS_REPOSTED(req, "$repostedBy.user"),
        // Add a property that indicates whether the client has liked this post
        constants.USER_HAS_LIKED(req, "$likes"),
        // Get the posts author info
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
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },
        // change image id's to images
        {
          $lookup: {
            from: "images",
            localField: "images",
            foreignField: "_id",
            as: "images",
          },
        },
        {
          $lookup: {
            from: "pets",
            localField: "pet",
            foreignField: "_id",
            as: "pet",
          },
        },
        {
          $unwind: {
            path: "$pet",
            preserveNullAndEmptyArrays: true,
          },
        },
        // Sort by newest to oldest
        { $sort: { lastInteractionFromUserFollowing: -1 } },
        {
          $project: constants.USER_EXCLUSIONS,
        },
        constants.PAGINATE(page),
      ]);

      if (!posts) {
        return res
          .status(500)
          .json({ status: "error", message: "Feed posts error" });
      }
      posts[0].data.forEach((post) => {
        //console.log(post.content);
        response.data.posts.push({
          _id: post._id,
          user: post.user,
          content: post.content,
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
            post.mostRecentRepost != null
              ? post.mostRecentRepost.displayname
              : null,
          pet: post.pet,
        });
      });

      if (response.data.posts.length === 0) {
        return res.status(204).json({});
      } else {
        response.status = "success";
        return res.status(200).json(response);
      }
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
  getUserPosts: async (req, res) => {
    try {
      let response = { data: { posts: [] } };
      let page = req.query.page;
      let matchOrConditions = [];
      const userId = mongoose.Types.ObjectId(req.params.id);

      // Get posts that have been reposted by the client
      matchOrConditions.push({
        reposts: {
          $elemMatch: { user: userId },
        },
      });

      // Get posts from the user that are not comments
      matchOrConditions.push({
        $and: [
          {
            user: userId,
          },
          { isComment: false },
        ],
      });

      const posts = await Post.aggregate([
        // Convert Reposts ids to objects
        {
          $lookup: {
            from: "reposts",
            localField: "reposts",
            foreignField: "_id",
            as: "reposts",
          },
        },
        // Get posts for timeline matching either of conditions above
        {
          $match: {
            $or: matchOrConditions,
          },
        },
        //Get a list of reposts made by this user
        {
          $addFields: {
            repostedBy: {
              $filter: {
                input: "$reposts",
                as: "repost",
                cond: { $eq: ["$$repost.user", userId] },
              },
            },
          },
        },

        // Get the most recent repost made by a followed user
        {
          $addFields: {
            mostRecentRepost: {
              $cond: [
                {
                  $gt: [{ $size: "$repostedBy" }, 0],
                },
                { $last: "$repostedBy" },
                [],
              ],
            },
          },
        },
        // Convert that most recent repost to a single repost object
        {
          $unwind: {
            path: "$mostRecentRepost",
            preserveNullAndEmptyArrays: true,
          },
        },
        // Determine whether the last interaction was the post creation
        // or a repost made by a followed user
        {
          $addFields: {
            lastInteractionFromUserFollowing: {
              $cond: [
                {
                  $ifNull: ["$mostRecentRepost", false],
                },
                "$mostRecentRepost.createdAt",
                "$createdAt",
              ],
            },
          },
        },
        // Convert repost objects to users
        {
          $lookup: {
            from: "users",
            localField: "reposts.user",
            foreignField: "_id",
            as: "reposts",
          },
        },
        // Convert most recent repost to the user
        {
          $lookup: {
            from: "users",
            localField: "mostRecentRepost.user",
            foreignField: "_id",
            as: "mostRecentRepost",
          },
        },
        // Convert it from an array to a property
        {
          $unwind: {
            path: "$mostRecentRepost",
            preserveNullAndEmptyArrays: true,
          },
        },
        // Add a property that indicates whether the client has reposted this post

        constants.USER_HAS_REPOSTED(req, "$repostedBy.user"),
        // Add a property that indicates whether the client has liked this post
        constants.USER_HAS_LIKED(req, "$likes"),
        // Get the posts author info
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
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },
        // change image id's to images
        {
          $lookup: {
            from: "images",
            localField: "images",
            foreignField: "_id",
            as: "images",
          },
        },
        {
          $lookup: {
            from: "pets",
            localField: "pet",
            foreignField: "_id",
            as: "pet",
          },
        },
        {
          $unwind: {
            path: "$pet",
            preserveNullAndEmptyArrays: true,
          },
        },

        // Sort by newest to oldest
        { $sort: { lastInteractionFromUserFollowing: -1 } },
        {
          $project: constants.USER_EXCLUSIONS,
        },
        constants.PAGINATE(page),
      ]);

      if (!posts) {
        return res
          .status(500)
          .json({ status: "error", message: "Feed posts error" });
      }

      posts[0].data.forEach((post) => {
        response.data.posts.push({
          _id: post._id,
          user: post.user,
          content: post.content,
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
            post.mostRecentRepost != null
              ? post.mostRecentRepost.displayname
              : null,
          pet: post.pet,
        });
      });

      if (response.data.posts.length === 0) {
        return res.status(204).json({});
      } else {
        response.status = "success";
        return res.status(200).json(response);
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
};

module.exports = userController;
