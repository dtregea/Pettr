require("dotenv").config();
const Post = require("../models/postModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Follow = require("../models/followModel");
const authController = require("./authController");
const userController = {
  getUsers: (req, res) => {
    try {
      User.find({}, (error, users) => {
        if (err) {
          return res.status(400).json({ error: error.toString() });
        } else if (users) {
          return res.status(200).json({ users: users });
        }
      });
    } catch (error) {
      return res.status(500).json({ error: error.toString() });
    }
  },
  getUser: (req, res) => {
    try {
      User.findOne({ _id: req.params.id }, (error, user) => {
        if (error) {
          return res.status(400).json({ error: error.toString() });
        } else if (user) {
          return res.status(200).json({ user: user });
        }
      });
    } catch (error) {
      return res.status(500).json({ error: error.toString() });
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
            if (error.code === 11000) {
              res.status(400).json({ token: false, error: "Duplicate User" });
            } else {
              res.status(400).json({ token: false, error: error.toString() });
            }
          } else if (user) {
            const token = authController.createToken(
              user._id,
              req.body.username
            );
            res.status(200).json({ token: token });
          }
        }
      );
    } catch (error) {
      res.status(500).json({ token: false, error: error.toString() });
    }
  },
  replaceUser: (req, res) => {
    try {
      const updatedAttributes = {};
      if (req.query._id) {
        delete req.query._id;
      }
      for (let attr in req.query) {
        updatedAttributes[attr] = req.query[attr];
      }
      User.replaceOne(
        { _id: req.params.id },
        updatedAttributes,
        (error, user) => {
          if (error) {
            res.status(400).json({ error: error.toString() });
          } else if (user) {
            res.status(200).json({});
          }
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.toString().toString() });
    }
  },
  updateUser: (req, res) => {
    try {
      const updatedAttributes = {};
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
            res.status(400).json({ error: error.toString() });
          } else if (user) {
            res.status(200).json({});
          }
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.toString().toString() });
    }
  },
  getDisplayname: (req, res) => {
    try {
      User.find({ _id: req.params.id }, (error, user) => {
        if (error) {
          return res.status(400).json({ error: error.toString() });
        } else if (user) {
          return res.status(200).json({ displayname: user.displayname });
        }
      });
    } catch (err) {
      return res.status(500).json({ error: error.toString() });
    }
  },
  updateDisplayname: (req, res) => {
    try {
      User.updateOne(
        { _id: req.params.id },
        { displayname: req.query.displayname },
        (error, user) => {
          if (error) {
            return res.status(400).json({ error: error.toString() });
          } else if (user) {
            return res.status(200).json({});
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ error: error.toString() });
    }
  },
  getAvatar: (req, res) => {
    try {
      User.find({ _id: req.params.id }, (error, user) => {
        if (error) {
          return res.status(400).json({ error: error.toString() });
        } else if (user) {
          return res.status(200).json({ avatar: user.avatar });
        }
      });
    } catch (err) {
      return res.status(500).json({ error: error.toString() });
    }
  },
  updateAvatar: (req, res) => {
    try {
      User.updateOne(
        { _id: req.params.id },
        { avatar: req.query.avatar },
        (error, user) => {
          if (error) {
            return res.status(400).json({ error: error.toString() });
          } else if (user) {
            return res.status(200).json({});
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ error: error.toString() });
    }
  },
  getBio: (req, res) => {
    try {
      User.find({ _id: req.params.id }, (error, user) => {
        if (error) {
          return res.status(400).json({ error: error.toString() });
        } else if (user) {
          return res.status(200).json({ bio: user.bio });
        }
      });
    } catch (err) {
      return res.status(500).json({ error: error.toString() });
    }
  },
  updateBio: (req, res) => {
    try {
      User.updateOne(
        { _id: req.params.id },
        { bio: req.query.bio },
        (error, user) => {
          if (error) {
            return res.status(400).json({ error: error.toString() });
          } else if (user) {
            return res.status(200).json({});
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ error: error.toString() });
    }
  },
  getBookmarks: (req, res) => {
    try {
      User.find({ _id: req.params.id }, (error, user) => {
        if (error) {
          return res.status(400).json({ error: error.toString() });
        } else if (user) {
          return res.status(200).json({ bookmarks: user.bookmarks });
        }
      });
    } catch (error) {
      return res.status(500).json({ error: error.toString() });
    }
  },
  addBookmark: (req, res) => {
    try {
      User.find({ _id: req.params.id }, (error, user) => {
        if (error) {
          return res.status(400).json({ error: error.toString() });
        } else if (user) {
          user.bookmarks.push(req.query.postId);
          user.save();
          return res.status(200).json({ bookmarks: user.bookmarks });
        }
      });
    } catch (error) {
      return res.status(500).json({ error: error.toString() });
    }
  },
  // Measure run time of this to optimize later
  getFeed: (req, res) => {
    try {
      Follow.find({ follower: req.params.id }, (followErr, follows) => {
        if (followErr) {
          return res.status(400).json({ error: followErr.toString() });
        } else if (follows) {
          let followedIds = follows.map((follow) => follow.followed._id);
          Post.find({ user: { $in: followedIds } })
            .sort({ createdAt: "desc" })
            .exec((postErr, posts) => {
              if (postErr) {
                return res.status(400).json({ error: postErr.toString() });
              } else if (posts) {
                return res.status(200).json({ posts: posts });
              }
            });
        }
      });
    } catch (error) {
      return res.status(500).json({ error: error.toString() });
    }
  },
};

module.exports = userController;
