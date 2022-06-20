const { default: mongoose } = require("mongoose");
const Post = require("../models/postModel");
const Repost = require("../models/repostModel");
const mongo = require("./mongoConstants");
const cloudinary = require("../middleware/cloudinary");

const postController = {
  getPosts: (req, res) => {
    try {
      Post.find({})
        .populate(
          "user",
          "-password -logins -bookmarks -createdAt -updatedAt -__v"
        )
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
      let images = [];
      if (req.file != null) {
        let result = await cloudinary.uploader.upload(req.file.path);
        images.push(result.secure_url);
      }
      let newPost = await new Post({
        content: req.body.content,
        images: images,
        user: req.user,
        isComment: false,
        isQuote: false,
      }).save();
      return res
        .status(200)
        .json({ status: "success", data: { post: newPost } });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
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
  getReplyTo: async (req, res) => {
    try {
      let posts = await Post.aggregate([
        {
          $match: {
            comments: mongoose.Types.ObjectId(req.params.id),
          },
        },
        // Convert the user id the post to a user object
        mongo.LOOKUP("users", "user", "_id", "user"),
        // Turn user array to a single user object
        mongo.UNWIND("$user", true),
        // Indicate whether client has liked this post
        mongo.USER_HAS_LIKED(req, "$likes"),
        // Convert repost ids to reposts
        mongo.LOOKUP("reposts", "reposts", "_id", "reposts"),
        mongo.ADD_FIELD("trendingView", true),
        mongo.ADD_FIELD("timestamp", "$createdAt"),
        mongo.ADD_COUNT_FIELD("likeCount", "$likes"),
        mongo.ADD_COUNT_FIELD("commentCount", "$comments"),
        mongo.ADD_COUNT_FIELD("repostCount", "$reposts"),
        // Add a property that indicates whether the client has reposted each comment
        {
          $addFields: {
            isReposted: {
              $cond: [
                {
                  $in: [mongoose.Types.ObjectId(req.user), "$reposts.user"],
                },
                true,
                false,
              ],
            },
          },
        },
        // Convert pet ids to pet objects
        mongo.LOOKUP("pets", "pet", "_id", "pet"),
        // Turn pet array to a single pet object
        mongo.UNWIND("$pet", true),
        {
          $project: mongo.USER_EXCLUSIONS,
        },
      ]);
      if (!posts) {
        return res.status(400).json({ post: "Not found" });
      }
      return res.status(200).json({
        status: "success",
        data: { post: posts },
      });
    } catch (error) {
      return res.status(500).json({ error: error });
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
  getTrending: async (req, res) => {
    let response = { data: { posts: [] }, status: "success" };
    try {
      let posts = await Post.aggregate([
        // Add a property that indicates whether the user has liked this post
        mongo.USER_HAS_LIKED(req, "$likes"),
        // Convert repost id's to repost documents
        mongo.LOOKUP("reposts", "reposts", "_id", "reposts"),
        // Add a property that indicates whether the user has reposted this post
        mongo.USER_HAS_REPOSTED(req, "$reposts.user"),
        mongo.LOOKUP("users", "user", "_id", "user"),
        mongo.UNWIND("$user", true),
        mongo.LOOKUP("pets", "pet", "_id", "pet"),
        mongo.UNWIND("$pet", true),
        mongo.ADD_FIELD("trendingView", true),
        mongo.ADD_FIELD("timestamp", "$createdAt"),
        mongo.ADD_COUNT_FIELD("likeCount", "$likes"),
        mongo.ADD_COUNT_FIELD("commentCount", "$comments"),
        mongo.ADD_COUNT_FIELD("repostCount", "$reposts"),
        mongo.UNWIND("$likes", false),
        // Unwind likes, group and get count to sort descendingly
        {
          $group: {
            _id: "$_id",
            likesCount: { $sum: 1 },
            doc: { $first: "$$ROOT" },
          },
        },
        { $sort: { likesCount: -1 } },
        { $limit: 10 },
        {
          $project: {
            doc: mongo.USER_EXCLUSIONS,
          },
        },
      ]);

      if (!posts) {
        return res.status(400).json({ trending: "Not found" });
      }

      response.data.posts = posts.map((post) => post.doc);
      response.status = "success";
      res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ status: "error", error: error.toString() });
    }
  },
  likePost: async (req, res) => {
    try {
      let likedPost = await Post.findOneAndUpdate(
        {
          _id: req.params.id,
          likes: { $ne: mongoose.Types.ObjectId(req.user) },
        },
        {
          $push: { likes: mongoose.Types.ObjectId(req.user) },
        },
        {
          new: true,
        }
      );

      if (!likedPost) {
        return res.status(400).json({
          status: "fail",
          data: { post: "Failed to like.", isLiked: true },
        });
      }

      return res.status(200).json({
        status: "success",
        data: { likeCount: likedPost.likes.length, isLiked: true },
      });
    } catch (error) {
      return res.status(500).json({ error: error.toString() });
    }
  },
  unlikePost: async (req, res) => {
    try {
      let unlikedPost = await Post.findOneAndUpdate(
        {
          _id: req.params.id,
          likes: { $eq: mongoose.Types.ObjectId(req.user) },
        },
        {
          $pull: { likes: mongoose.Types.ObjectId(req.user) },
        },
        {
          new: true,
        }
      );

      if (!unlikedPost) {
        return res.status(400).json({
          status: "fail",
          data: { post: "Post is already unliked.", isLiked: false },
        });
      }

      return res.status(200).json({
        status: "success",
        data: { likeCount: unlikedPost.likes.length, isLiked: false },
      });
    } catch (error) {
      return res.status(500).json({ error: error.toString() });
    }
  },
  repost: async (req, res) => {
    try {
      let newRepost = await new Repost({
        user: req.user,
        post: req.params.id,
      }).save();
      let repostedPost = await Post.findOneAndUpdate(
        {
          _id: req.params.id,
          reposts: { $ne: mongoose.Types.ObjectId(req.user) },
        },
        {
          $push: { reposts: newRepost },
        },
        {
          new: true,
        }
      );

      if (!repostedPost) {
        return res.status(400).json({
          status: "fail",
          data: { post: "Post is already reposted.", isReposted: true },
        });
      }

      return res.status(200).json({
        status: "success",
        data: { repostCount: repostedPost.reposts.length, isReposted: true },
      });
    } catch (error) {
      return res.status(500).json({ error: error.toString() });
    }
  },
  undoRepost: async (req, res) => {
    try {
      let repostToDelete = await Repost.findOne({
        post: req.params.id,
        user: req.user,
      });

      let updatedPost = await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { reposts: repostToDelete._id },
        },
        {
          new: true,
        }
      );

      await Repost.findOneAndDelete({
        _id: repostToDelete._id,
      });

      if (!updatedPost) {
        return res.status(400).json({
          status: "fail",
          data: { post: "Post is already reposted.", isReposted: false },
        });
      }

      return res.status(200).json({
        status: "success",
        data: { repostCount: updatedPost.reposts.length, isReposted: false },
      });
    } catch (error) {
      return res.status(500).json({ error: error.toString() });
    }
  },

  getComments: async (req, res) => {
    try {
      let post = await Post.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
        // Convert comment id's to Posts
        mongo.LOOKUP("posts", "comments", "_id", "comments"),
        // Get an array of the post with each separate comment
        mongo.UNWIND("$comments", false),
        // Convert the user id on each comment to a user object
        mongo.LOOKUP("users", "comments.user", "_id", "comments.user"),
        // Turn user array to a single user object
        mongo.UNWIND("$comments.user", false),
        // Add a property that indicates whether the client has liked each comment
        {
          $addFields: {
            "comments.isLiked": {
              $cond: [
                {
                  $in: [mongoose.Types.ObjectId(req.user), "$comments.likes"],
                },
                true,
                false,
              ],
            },
          },
        },
        // Convert repost ids on comments to reposts
        mongo.LOOKUP("reposts", "comments.reposts", "_id", "comments.reposts"),
        // Add a property that indicates whether the client has reposted each comment
        {
          $addFields: {
            "comments.isReposted": {
              $cond: [
                {
                  $in: [
                    mongoose.Types.ObjectId(req.user),
                    "$comments.reposts.user",
                  ],
                },
                true,
                false,
              ],
            },
          },
        },
        mongo.ADD_FIELD("comments.trendingView", false),
        mongo.ADD_FIELD("timestamp", "$comments.createdAt"),
        mongo.ADD_COUNT_FIELD("comments.likeCount", "$comments.likes"),
        mongo.ADD_COUNT_FIELD("comments.commentCount", "$comments.comments"),
        mongo.ADD_COUNT_FIELD("comments.repostCount", "$comments.reposts"),
        // Group the array of the post with each separate comment back into a single post
        // with an array of each comment
        {
          $group: {
            _id: "$_id",
            comments: {
              $push: "$comments",
            },
          },
        },
        {
          $project: {
            comments: mongo.USER_EXCLUSIONS,
          },
        },
      ]);
      if (!post) {
        return res.status(400).json({ comments: "Not found" });
      }
      let results = [];
      if (post[0]?.comments) {
        results = post[0].comments;
      }
      return res.status(200).json({
        status: "success",
        data: { comments: results },
      });
    } catch (error) {
      return res.status(500).json({ error: error.toString() });
    }
  },

  postComment: async (req, res) => {
    try {
      let images = [];
      if (req.file != null) {
        let result = await cloudinary.uploader.upload(req.file.path);
        images.push(result.secure_url);
      }
      let newComment = await new Post({
        content: req.body.comment,
        images: images,
        user: req.user,
        isComment: true,
        isQuote: false,
      }).save();

      if (!newComment) {
        return res.status(400).json({
          status: "fail",
          data: { comment: "Could not create comment" },
        });
      }

      let post = await Post.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { comments: newComment } },
        { new: true }
      );

      if (!post) {
        return res
          .status(400)
          .json({ status: "fail", data: { post: "Not found" } });
      }
      return res.status(200).json({
        status: "success",
        data: { commentCount: post.comments.length },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  },
};

module.exports = postController;
