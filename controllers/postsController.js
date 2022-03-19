require("dotenv").config();
const Post = require("../models/postModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const postController = {
  getPosts: (req, res) => {
    Post.find({}, (error, result) => {
      if (error) {
        res.status(500).json({ error: error.toString() });
      } else if (result) {
        res.status(200).json({ result: result });
      }
    });
  },
  createPost: async (req, res) => {
    const decodedToken = jwt.verify(req.params.token, process.env.SECRET);
    User.findOne({ username: decodedToken.username }, (error, user) => {
      if (error) {
        return res.status(500).json({ error: "Server Error" });
      } else if (user) {
        new Post({
          content: req.body.content,
          image: [req.body.image],
          user: user._id,
        }).save((err) => {
          if (err) {
            res.status(500).json({ error: "Server Error on Post creation" });
          } else {
            res.status(200).json({ message: "Post Created" });
          }
        });
      }
    });
  },
};

module.exports = postController;
