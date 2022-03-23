const Post = require("../models/postModel");
const postController = {
  getPosts: (req, res) => {
    try {
      Post.find({}, (error, posts) => {
        if (error) {
          res.status(500).json({ status: "error", message: error.toString() });
        } else if (posts) {
          res.status(200).json({ status: "success", data: { posts: posts } });
        }
      });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  },
  createPost: async (req, res) => {
    try {
      new Post({
        content: req.body.content,
        images: [req.body.image],
        user: req.user._id,
      }).save((error, post) => {
        if (error) {
          res.status(500).json({ status: "error", message: error.toString() });
        } else if (post) {
          res.status(200).json({ status: "success", data: { post: post } });
        }
      });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  },
  getPost: async (req, res) => {
    try {
      Post.findOne({ _id: req.params.id }, (error, post) => {
        if (error) {
          res.status(500).json({ status: "error", message: error.toString() });
        } else if (post) {
          res.status(200).json({ status: "success", data: { post: post } });
        } else {
          res
            .status(400)
            .json({ status: "fail", data: { post: "No post found" } });
        }
      });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  },
  deletePost: async (req, res) => {
    try {
      Post.deleteOne({ _id: req.params.id }, (error, post) => {
        if (error) {
          res.status(500).json({ status: "error", message: error.toString() });
        } else if (post) {
          res.status(200).json({ status: "success", data: { post: post } });
        } else {
          res
            .status(400)
            .json({ status: "fail", data: { post: "No post found" } });
        }
      });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  },
};

module.exports = postController;
