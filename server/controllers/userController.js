const Post = require("../models/postModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const Follow = require("../models/followModel");
const authController = require("./authController");
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
      // Get users that the client is following
      const follows = await Follow.find({ follower: req.params.id });
      let response = { data: { posts: [] } };
      let responsePosts = {};
      let responseCounts = {};
      if (!follows) {
        return res
          .status(500)
          .json({ status: "error", message: "Following feed error" });
      }
      const followedIds = follows.map((follow) => follow.followed._id);

      // Get posts from the client and users the client is following
      const posts = await Post.find({
        $or: [{ user: { $in: followedIds } }, { user: req.user._id }],
        $not: { $and: [{ isReply: true }, { isRepost: false }] }, // filter out comments
      })
        .populate("user")
        .sort({ createdAt: "desc" })
        .limit(20)
        .exec();

      if (!posts) {
        return res
          .status(500)
          .json({ status: "error", message: "Feed posts error" });
      }
      // Set the post data and initial counts to zero
      posts.forEach((post) => {
        responsePosts[post._id] = post;
        responseCounts[post._id] = {};
        responseCounts[post._id].likeCount =
          post.likes == null ? 0 : post.likes.length;
        responseCounts[post._id].commentCount = 0;
        responseCounts[post._id].repostCount = 0;
      });

      const postIds = posts.map((post) => post._id);

      // Get all replies, retweets, etc to post
      const replies = await Post.find({ replyTo: { $in: postIds } });

      if (!replies) {
        return res
          .status(500)
          .json({ status: "error", message: "replies posts error" });
      }
      // Increment retweet and comment count
      replies.forEach((reply) => {
        if (reply.isRepost) {
          responseCounts[reply.replyTo].repostCount++;
        } else {
          responseCounts[reply.replyTo].commentCount++;
        }
      });

      // Put post data in objects into array element
      let keys = Object.keys(responsePosts);
      keys.forEach((key, index) => {
        response.data.posts.push({
          id: responsePosts[key]._id,
          user: responsePosts[key].user,
          text: responsePosts[key].content,
          image:
            responsePosts[key].images == null
              ? []
              : responsePosts[key].images[0],
          trendingView: false,
          timestamp: responsePosts[key].createdAt,
          likeCount: responseCounts[key].likeCount,
          commentCount: responseCounts[key].commentCount,
          repostCount: responseCounts[key].repostCount,
        });
      });

      // Sort the posts by date descendingly
      for (let i = 0; i < response.data.posts.length; i++) {
        let latestDateIndex = i;
        for (let j = i + 1; j < response.data.posts.length; j++) {
          if (response.data.posts[j] > response.data.posts[latestDateIndex]) {
            latestDateIndex = j;
          }
        }
        let temp = response.data.posts[i];
        response.data.posts[i] = response.data.posts[latestDateIndex];
        response.data.posts[latestDateIndex] = temp;
      }

      response.status = "success";
      return res.status(200).json(response);
    } catch (error) {
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
