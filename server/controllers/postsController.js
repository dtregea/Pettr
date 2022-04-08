const { default: mongoose } = require("mongoose");
const Post = require("../models/postModel");
const Repost = require("../models/repostModel");
const Image = require("../models/imageModel");
const fs = require("fs");
const path = require("path");
const constants = require("./mongoConstants");

//const Like = require("../models/likeModel");
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
        let newImage = await new Image({
          img: {
            data: fs.readFileSync(path.join("./uploads/" + req.file.filename)),
            contentType: "image/png",
          },
        }).save();
        images.push(newImage._id);
      }
      new Post({
        content: req.body.content,
        images: images.length > 0 ? [images] : [],
        user: req.user._id,
        isComment: false,
        isQuote: false,
      }).save((error, post) => {
        if (error) {
          res.status(500).json({ status: "error", message: error.toString() });
        } else if (post) {
          res.status(200).json({ status: "success", data: { post: post } });
        }
      });
    } catch (error) {
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
          // Add a property that indicates whether the user has liked this post
          constants.USER_HAS_LIKED(req, "$likes"),
          // Convert repost id's to repost documents
          {
            $lookup: {
              from: "reposts",
              localField: "reposts",
              foreignField: "_id",
              as: "reposts",
            },
          },
          // Add a property that indicates whether the user has reposted this post
          constants.USER_HAS_REPOSTED(req, "$reposts.user"),
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
          {
            $lookup: {
              from: "images",
              localField: "images",
              foreignField: "_id",
              as: "images",
            },
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
          {
            $project: {
              doc: constants.USER_EXCLUSIONS,
            },
          },
        ],
        (error, posts) => {
          if (error) {
            res
              .status(500)
              .json({ status: "error", message: error.toString() });
          } else if (posts) {
            //project fields later so this isnt necessary
            posts.forEach((post, index) => {
              response.data.posts.push({
                _id: post.doc._id,
                user: post.doc.user,
                content: post.doc.content,
                image: post.doc.images == null ? [] : post.doc.images[0],
                trendingView: true,
                timestamp: post.doc.createdAt,
                likeCount: post.likesCount,
                commentCount: post.doc.comments.length,
                repostCount: post.doc.reposts.length,
                isLiked: post.doc.isLiked,
                isReposted: post.doc.isReposted,
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
      let likedPost = await Post.findOneAndUpdate(
        { _id: req.params.id, likes: { $ne: req.user._id } },
        {
          $push: { likes: req.user._id },
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
        { _id: req.params.id, likes: { $eq: req.user._id } },
        {
          $pull: { likes: req.user._id },
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
        user: req.user._id,
        post: req.params.id,
      }).save();
      let repostedPost = await Post.findOneAndUpdate(
        { _id: req.params.id, reposts: { $ne: req.user._id } },
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
        user: req.user._id,
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
        {
          $lookup: {
            from: "posts",
            localField: "comments",
            foreignField: "_id",
            as: "comments",
          },
        },
        // Get an array of the post with each separate comment
        {
          $unwind: { path: "$comments" },
        },

        // Convert the user id on each comment to a user object
        {
          $lookup: {
            from: "users",
            localField: "comments.user",
            foreignField: "_id",
            as: "comments.user",
          },
        },
        // Convert images ids to image objects
        {
          $lookup: {
            from: "images",
            localField: "comments.images",
            foreignField: "_id",
            as: "comments.images",
          },
        },
        // Turn user array to a single user object
        {
          $unwind: { path: "$comments.user" },
        },
        // Add a property that indicates whether the client has liked each comment
        {
          $addFields: {
            "comments.isLiked": {
              $cond: [
                {
                  $in: [req.user._id, "$comments.likes"],
                },
                true,
                false,
              ],
            },
          },
        },
        // Convert repost ids to reposts
        {
          $lookup: {
            from: "reposts",
            localField: "comments.reposts",
            foreignField: "_id",
            as: "comments.reposts",
          },
        },
        // Add a property that indicates whether the client has reposted each comment
        {
          $addFields: {
            "comments.isReposted": {
              $cond: [
                {
                  $in: [req.user._id, "$comments.reposts.user"],
                },
                true,
                false,
              ],
            },
          },
        },
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
      ]);
      if (!post) {
        return res.status(400).json({ comments: "Not found" });
      }
      let results = [];
      if (post.length > 0) {
        post[0].comments.forEach((comment) => {
          results.push({
            _id: comment._id,
            user: comment.user,
            content: comment.content,
            image: comment.images == null ? [] : comment.images[0],
            trendingView: false,
            timestamp: comment.createdAt,
            likeCount: comment.likes.length,
            commentCount: comment.comments.length,
            repostCount: comment.reposts.length,
            isLiked: comment.isLiked,
            isQuote: comment.isQuote,
            isComment: comment.isComment,
            isReposted: comment.isReposted,
          });
        });
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
        let newImage = await new Image({
          img: {
            data: fs.readFileSync(path.join("./uploads/" + req.file.filename)),
            contentType: "image/png",
          },
        }).save();
        images.push(newImage._id);
      }
      let newComment = await new Post({
        content: req.body.comment,
        images: images.length > 0 ? [images] : [],
        user: req.user._id,
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
