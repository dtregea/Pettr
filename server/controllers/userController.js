const Post = require("../models/postModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const Follow = require("../models/followModel");
const cloudinaryController = require("./cloudinaryController");
const aggregationBuilder = require("../utils/aggregationBuilder");

const userController = {
  getUsers: async (req, res) => {
    try {
      let users = await User.find(
        {},
        new aggregationBuilder().USER_EXCLUSIONS
      );

      if (!users) {
        return res.status(400).json({
          status: "fail",
          message: "No users found",
        });
      }

      return res
        .status(200)
        .json({ status: "success", data: { users: users } });
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
        new aggregationBuilder().USER_EXCLUSIONS
      );
      if (!user) {
        return res
          .status(400)
          .json({ status: "fail", data: { user: "Not Found" } });
      }

      const [userPosts, userFollowing, userFollowers] = await Promise.all([
        Post.find({ user: user._id }),
        Follow.find({ follower: user._id }),
        Follow.find({ followed: user._id }),
      ]);

      // Determine is client is following this user
      const userIdString = req.user.toString();
      const followedByClient = userFollowers.some((relationship) =>
        relationship.follower._id.toString() === userIdString
      );

      return res.status(200).json({
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
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
  createUser: async (req, res, next) => {
    try {
      const newPassword = await bcrypt.hash(req.body.password, 10);
      let newUser = await User.create({
        username: req.body.username,
        password: newPassword,
        displayname: req.body.displayname,
      });

      if (!newUser) {
        return res.status(400).json({
          status: "fail",
          message: "Failed to create user",
        });
      }
      next(); // Login user
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          status: "fail",
          message: "A User with this username already exists",
        });
      }
      return res
        .status(500)
        .json({ status: "error", message: "Error registering" });
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
  updateUser: async (req, res) => {
    try {
      const updatedAttributes = {};
      // Do not update the user id if provided
      if (req.query._id) {
        delete req.query._id;
      }

      // Get all modifed attributes in parameters
      for (let attr in req.query) {
        if (attr) {
          updatedAttributes[attr] = req.query[attr];
        }
      }

      // Get all modified attributes in form data
      for (let attr in req.body) {
        if (attr) {
          updatedAttributes[attr] = req.body[attr];
        }
      }

      // Update profile picture if file provided
      if (req.file != null) {
        let result = await cloudinaryController.uploadImage(
          req.file.path,
          "avatars"
        );

        updatedAttributes["avatar"] = result.secure_url;
      }
      let userUpdate = await User.updateOne(
        { _id: req.params.id },
        updatedAttributes,
        { runValidators: true }
      );

      if (!userUpdate) {
        return res
          .status(400)
          .json({ status: "fail", data: { user: "Not found" } });
      }
      let updatedUser = await User.findOne(
        { _id: req.params.id },
        new aggregationBuilder().USER_EXCLUSIONS
      );
      if (!updatedUser) {
        return res
          .status(400)
          .json({ status: "fail", data: { user: "Not found" } });
      }
      return res
        .status(200)
        .json({ status: "success", data: { user: updatedUser } });
    } catch (error) {
      let message = 'Server error';
      for (let key in error?.errors) {
        if (error?.errors?.[key]?.kind === 'maxlength') {
          message = `${capitalizeFirstLetter(key)} can only have ${error.errors[key].properties?.maxlength} characters or less`;
        }
      }
      return res.status(500).json({
        status: "error",
        message,
      });
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
    } catch (error) {
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
        { runValidators: true },
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
        },
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

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
module.exports = userController;
