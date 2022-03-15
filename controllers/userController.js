/* 
From Stackoverflow:

req.query will return a JS object after the query string is parsed.
/user?name=tom&age=55 - req.query would yield {name:"tom", age: "55"}

req.params will return parameters in the matched route. 
If your route is /user/:id and you make a request to /user/5 - req.params would yield {id: "5"} 
*/

require("dotenv").config();
const Post = require("../models/postModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userController = {
  getUsers: (req, res) => {
    try {
      User.find({}, (err, docs) => {
        if (err) {
          return res.status(500).json({ error: err });
        } else {
          return res.status(200).json({ users: docs });
        }
      });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  },
  getUserByUsername: (req, res) => {
    try {
      User.find({ username: req.params.username }, (err, docs) => {
        if (err) {
          return res.status(500).json({ error: err });
        } else {
          return res.status(200).json({ users: docs });
        }
      });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  },
  createUser: async (req, res) => {
    try {
      const newPassword = await bcrypt.hash(req.query.password, 10);
      User.create(
        {
          username: req.query.username,
          displayname: req.query.displayname,
          email: req.query.email,
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
                email: req.body.email,
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
        { username: req.params.username },
        updatedAttributes,
        (error, user) => {
          if (error) {
            res.status(400).json({ error: error });
          } else if (user) {
            res.status(200).json({ user: user });
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
        { username: req.params.username },
        updatedAttributes,
        (error, user) => {
          if (error) {
            res.status(400).json({ error: error });
          } else if (user) {
            res.status(200).json({ user: user });
          }
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  },

  getFeed: (req, res) => {
    Post.find({}, (err, results) => {
      if (err) {
        res.send("error");
      } else if (results) {
        res.json(results);
      }
    });
  },
  getAvatar: (req, res) => {
    try {
      const decodedToken = jwt.verify(req.querys.token, process.env.SECRET);
      User.findOne({ email: decodedToken.email }, (error, user) => {
        if (error) return res.status(400).json({ error: "User not found" });
        else if (user) return res.status(200).json({ avatar: user.avatar });
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
};

module.exports = userController;
