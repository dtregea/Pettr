const Post = require("../models/postModel");
const postController = {
  getPosts: (req, res) => {
    try {
      Post.find({
        $or: [{ user: { $in: followedIds } }, { user: req.user._id }],
        $not: { $and: [{ isReply: true }, { isRepost: false }] }, // filter out comments
      })
        .populate("user")
        .sort({ createdAt: "desc" })
        .limit(20)
        .exec((error, posts) => {
          if (error) {
            res
              .status(500)
              .json({ status: "error", message: error.toString() });
          } else if (posts) {
            res.status(200).json({ status: "success", data: { posts: posts } });
          }
        });
      // Post.find({}, (error, posts) => {
      //   if (error) {
      //     res.status(500).json({ status: "error", message: error.toString() });
      //   } else if (posts) {
      //     res.status(200).json({ status: "success", data: { posts: posts } });
      //   }
      // });
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
        isReply: false,
        isRepost: false,
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
  getTrending: (req, res) => {
    let response = { data: { posts: [] } };
    try {
      Post.aggregate(
        [
          { $unwind: "$likes" },
          { $group: { _id: "$likes", likesCount: { $sum: 1 } } },
          { $sort: { likesCount: -1 } },
          { $limit: 10 },
        ],
        (error, posts) => {
          if (error) {
            res
              .status(500)
              .json({ status: "error", message: error.toString() });
          } else if (posts) {
            posts.forEach((post, index) => {
              response.data.posts.push({
                id: post._id,
                user: post.user,
                text: post.content,
                image: post.images == null ? [] : post.images[0],
                trendingView: true,
                timestamp: post.createdAt,
                likeCount: post.likes.length,
                commentCount: post.comments.length,
                repostCount: post.reposts.length,
              });
            });
            response.status = "success";
            res.status(200).json(response);
          } else {
            res
              .status(400)
              .json({ status: "fail", data: { post: "No posts found" } });
          }
        }
      );
    } catch (error) {
      return res.status(500).json({ status: "error", error: error.toString() });
    }
  },
};

module.exports = postController;
