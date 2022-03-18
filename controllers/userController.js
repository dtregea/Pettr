require("dotenv").config();
const Post = require("../models/postModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Follow = require("../models/followModel");
const userController = {
  getUsers: (req, res) => {
    try {
      User.find({}, (err, users) => {
        if (err) {
          return res.status(400).json({ error: err });
        } else if (users) {
          return res.status(200).json({ users: users });
        }
      });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  },
  getUser: (req, res) => {
    try {
      User.find({ _id: req.params.id }, (error, user) => {
        if (error) {
          return res.status(400).json({ error: error });
        } else if (user) {
          return res.status(200).json({ user: user });
        }
      });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  },
  createUser: async (req, res) => {
    try {
      const newPassword = await bcrypt.hash(req.query.password, 10);
      User.create(
        {
          username: req.query.username,
          displayname: req.query.displayname,
          password: newPassword,
        },
        (error, user) => {
          if (error) {
            console.log(error);
            if (error.code === 11000) {
              res.status(400).json({ token: false, error: "Duplicate User" });
            } else {
              res.status(400).json({ token: false, error: error });
            }
          } else if (user) {
            const token = jwt.sign(
              {
                email: req.body.username,
              },
              process.env.SECRET
            );
            console.log("User created");
            res.status(200).json({ token: token, user: user });
          }
        }
      );
    } catch (error) {
      res.status(500).json({ token: false, error: error });
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
            res.status(400).json({ error: error });
          } else if (user) {
            res.status(200).json({});
          }
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.toString() });
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
            res.status(400).json({ error: error });
          } else if (user) {
            res.status(200).json({});
          }
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  },
  getDisplayname: (req, res) => {
    try {
      User.find({ _id: req.params.id }, (error, user) => {
        if (error) {
          return res.status(400).json({ error: error });
        } else if (user) {
          return res.status(200).json({ displayname: user.displayname });
        }
      });
    } catch (err) {
      return res.status(500).json({ error: error });
    }
  },
  updateDisplayname: (req, res) => {
    try {
      User.updateOne(
        { _id: req.params.id },
        { displayname: req.query.displayname },
        (error, user) => {
          if (error) {
            return res.status(400).json({ error: error });
          } else if (user) {
            return res.status(200).json({});
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ error: error });
    }
  },
  getAvatar: (req, res) => {
    try {
      User.find({ _id: req.params.id }, (error, user) => {
        if (error) {
          return res.status(400).json({ error: error });
        } else if (user) {
          return res.status(200).json({ avatar: user.avatar });
        }
      });
    } catch (err) {
      return res.status(500).json({ error: error });
    }
  },
  updateAvatar: (req, res) => {
    try {
      User.updateOne(
        { _id: req.params.id },
        { avatar: req.query.avatar },
        (error, user) => {
          if (error) {
            return res.status(400).json({ error: error });
          } else if (user) {
            return res.status(200).json({});
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ error: error });
    }
  },
  getBio: (req, res) => {
    try {
      User.find({ _id: req.params.id }, (error, user) => {
        if (error) {
          return res.status(400).json({ error: error });
        } else if (user) {
          return res.status(200).json({ bio: user.bio });
        }
      });
    } catch (err) {
      return res.status(500).json({ error: error });
    }
  },
  updateBio: (req, res) => {
    try {
      User.updateOne(
        { _id: req.params.id },
        { bio: req.query.bio },
        (error, user) => {
          if (error) {
            return res.status(400).json({ error: error });
          } else if (user) {
            return res.status(200).json({});
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ error: error });
    }
  },
  getBookmarks: (req, res) => {
    try {
      User.find({ _id: req.params.id }, (err, user) => {
        if (err) {
          return res.status(400).json({ error: err });
        } else if (user) {
          return res.status(200).json({ bookmarks: user.bookmarks });
        }
      });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  },
  addBookmark: (req, res) => {
    try {
      User.find({ _id: req.params.id }, (err, user) => {
        if (err) {
          return res.status(400).json({ error: err });
        } else if (user) {
          user.bookmarks.push(req.query.postId);
          user.save();
          return res.status(200).json({ bookmarks: user.bookmarks });
        }
      });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  },
  // Measure run time of this to optimize later
  getFeed: (req, res) => {
    try {
      Follow.find({ follower: req.params.id }, (followErr, follows) => {
        if (followErr) {
          return res.status(400).json({ error: followErr });
        } else if (follows) {
          let followedIds = follows.map((follow) => follow.followed._id);
          Post.find({ user: { $in: followedIds } })
            .sort({ createdAt: "desc" })
            .exec((postErr, posts) => {
              if (postErr) {
                return res.status(400).json({ error: postErr });
              } else if (posts) {
                return res.status(200).json({ posts: posts });
              }
            });
        }
      });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  },
};

module.exports = userController;
