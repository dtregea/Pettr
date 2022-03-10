require("dotenv").config();
const Post = require("../models/postModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const postController = {
  createPost: async (req, res) => {
    const decodedToken = jwt.verify(req.params.token, process.env.SECRET);
    User.findOne({ email: decodedToken.email }, (error, user) => {
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
