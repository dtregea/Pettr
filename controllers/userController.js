require("dotenv").config();
const Post = require("../models/postModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const homeController = {
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
      const decodedToken = jwt.verify(req.params.token, process.env.SECRET);
      User.findOne({ email: decodedToken.email }, (error, user) => {
        if (error) return res.status(400).json({ error: "User not found" });
        else if (user) return res.status(200).json({ avatar: user.avatar });
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
};

module.exports = homeController;
