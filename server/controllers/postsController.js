const Post = require("../models/postModel");
//const Like = require("../models/likeModel");
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
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  },
  createPost: async (req, res) => {
    try {
      new Post({
        content: req.body.content,
        images: req.body.image,
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
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $unwind: "$user",
          },
          { $unwind: "$likes" },
          {
            $group: {
              _id: "$_id",
              likesCount: { $sum: 1 },
              doc: { $first: "$$ROOT" },
            },
          },
          { $sort: { likesCount: -1 } },
          { $limit: 10 },
        ],
        (error, posts) => {
          //console.log(posts);
          if (error) {
            res
              .status(500)
              .json({ status: "error", message: error.toString() });
          } else if (posts) {
            posts.forEach((post, index) => {
              response.data.posts.push({
                id: post.doc._id,
                user: post.doc.user,
                text: post.doc.content,
                image: post.doc.images == null ? [] : post.doc.images[0],
                trendingView: true,
                timestamp: post.doc.createdAt,
                likeCount: post.likesCount,
                commentCount: post.doc.comments.length,
                repostCount: post.doc.reposts.length,
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
  likePost: async (req, res) => {
    try {
      const post = await Post.find({
        _id: req.params.id,
        likes: req.user._id,
      });
      if (post.length > 0) {
        return res
          .status(400)
          .json({ status: "fail", data: { like: "Duplicate Like" } });
      }

      let likedPost = await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { likes: req.user._id },
        }
      );

      if (!likedPost) {
        return res
          .status(400)
          .json({ status: "fail", data: { post: "Failed to like." } });
      }
      res.status(200).json({
        status: "success",
        data: { likeCount: likedPost.likes.length },
      });
    } catch (error) {
      return res.status(500).json({ error: error.toString() });
    }
  },
  unlikePost: async (req, res) => {},
};

module.exports = postController;
