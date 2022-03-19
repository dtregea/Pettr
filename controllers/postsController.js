const Post = require("../models/postModel");
const postController = {
  getPosts: (req, res) => {
    Post.find({}, (error, posts) => {
      if (error) {
        res.status(500).json({ status: "error", message: error.toString() });
      } else if (posts) {
        res.status(200).json({ status: "success", data: { posts: posts } });
      }
    });
  },
  createPost: async (req, res) => {
    new Post({
      content: req.body.content,
      image: [req.body.image],
      user: req.user._id,
    }).save((error, post) => {
      if (error) {
        res.status(500).json({ status: "error", message: error.toString() });
      } else if (post) {
        res.status(200).json({ status: "success", data: { post: post } });
      }
    });
  },
};

module.exports = postController;
