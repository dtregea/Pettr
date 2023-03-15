const mongoose = require('mongoose');
const Post = require("../models/postModel");
const Repost = require("../models/repostModel");
const cloudinaryController = require("./cloudinaryController");
const Follow = require("../models/followModel");
const Like = require('../models/likeModel');
const aggregationBuilder = require('../utils/aggregationBuilder');

const postController = {
  getPosts: async (req, res) => {
    try {
      let posts = await Post.find({})
        .populate(
          "user",
          new aggregationBuilder().USER_EXCLUSIONS_MONGOOSE
        )
        .sort({
          createdAt: "desc",
        })
        .limit(20);

      if (!posts) {
        return res.status(400).json({
          status: "fail",
          message: "No posts found",
        });
      }
      return res.status(200).json({
        status: "success",
        data: {
          posts: posts,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        error: error.toString(),
      });
    }
  },
  createPost: async (req, res) => {
    try {
      let images = [];
      if (req.file != null) {
        let result = await cloudinaryController.uploadImage(
          req.file.path,
          "posts"
        );
        images.push(result.secure_url);
      }
      let insertedPost = await new Post({
        content: req.body.content,
        images: images,
        user: req.user,
        isComment: false,
        isQuote: false,
      }).save();


      let newPost = await Post.findById(insertedPost._id).populate(
        "user",
        new aggregationBuilder().USER_EXCLUSIONS_MONGOOSE
      ).lean();
      newPost.likeCount = 0;
      newPost.commentCount = 0;
      newPost.repostCount = 0;

      return res.status(200).json({
        status: "success",
        data: {
          post: newPost,
        },
      });
    } catch (error) {
      let message;
      if (error.errors.content.kind === 'maxlength') {
        message = 'Posts can only have 280 characters or less';
      } else {
        message = 'Server error';
      }
      return res.status(500).json({
        status: "error",
        message,
      });
    }
  },
  getPost: async (req, res) => {
    try {
      let userId = mongoose.Types.ObjectId(req.user);
      let aggBuilder = new aggregationBuilder()
        .match({
          _id: mongoose.Types.ObjectId(req.params.id),
        })
        .lookup("users", "user", "_id", "user")
        .unwind("$user", true)
        .lookup("pets", "pet", "_id", "pet")
        .unwind("$pet", true)
        .lookup("reposts", "_id", "post", "reposts")
        .lookup("likes", "_id", "post", "likes")
        .lookup("posts", "_id", "replyTo", "comments")
        .contains("isLiked", userId, "$likes.user")
        .contains("isReposted", userId, "$reposts.user")
        .addField("trendingView", false)
        .addField("timestamp", "$createdAt")
        .addCountField("likeCount", "$likes")
        .addCountField("commentCount", "$comments")
        .addCountField("repostCount", "$reposts")
        .cleanPost();

        let post = await aggBuilder.execPost();

      if (post.length === 0) {
        return res.status(400).json({
          status: "error",
          error: 'This post is no longer available',
        });
      }

      return res.status(200).json({
        status: "success",
        data: {
          post: post[0],
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        error: error.toString(),
      });
    }
  },
  deletePost: async (req, res) => {
    try {
      let deletedPost = await Post.findByIdAndDelete(req.params.id);
      if (!deletedPost) {
        return res.status(400).json({
          status: "fail",
          message: "No post found",
        });
      }
      return res.status(200).json({
        status: "success",
        data: {
          post: deletedPost,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        error: error.toString(),
      });
    }
  },
  getTrending: async (req, res) => {
    try {
      let aggBuilder = new aggregationBuilder()
        .lookup("likes", "_id", "post", "likes")
        .unwind("$likes", false)
        // Unwind likes, group and get count to sort descendingly
        .push({
          $group: {
            _id: "$_id",
            likesCount: {
              $sum: 1,
            },
            doc: {
              $first: "$$ROOT",
            },
          },
        })
        .sortNewest("likesCount")
        .limit(10)
        .lookup("reposts", "_id", "post", "doc.reposts")
        .lookup("likes", "_id", "post", "doc.likes")
        .lookup("posts", "_id", "replyTo", "doc.comments")
        .lookup("users", "doc.user", "_id", "doc.user")
        .unwind("$doc.user", true)
        .lookup("pets", "doc.pet", "_id", "doc.pet")
        .unwind("$doc.pet", true)
        .contains("doc.isLiked", req.user, "$doc.likes.user")
        .contains("doc.isReposted", req.user, "$doc.reposts.user")
        .addField("doc.trendingView", true)
        .addField("doc.timestamp", "$createdAt")
        .addCountField("doc.likeCount", "$doc.likes")
        .addCountField("doc.commentCount", "$doc.comments")
        .addCountField("doc.repostCount", "$doc.reposts")
        .cleanPost("doc");

      let trendingPosts = await aggBuilder.execPost();

      if (!trendingPosts) {
        return res.status(400).json({
          status: "fail",
          message: "Could not get trending posts",
        });
      }
      return res.status(200).json({
        status: "success",
        data: {
          posts: trendingPosts.map((post) => post.doc),
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        error: error.toString(),
      });
    }
  },
  likePost: async (req, res) => {
    try {
      let existingLike = await Like.findOne({
        post: req.params.id,
        user: req.user,
      });

      if (existingLike) {
        return res.status(400).json({
          status: "fail",
          message: "You have already liked this post",
        });
      }

      let newLike = await new Like({ user: req.user, post: req.params.id }).save();

      if (!newLike) {
        return res.status(400).json({
          status: "fail",
          message: "Failed to like post",
        });
      }

      return res.status(200).json({
        status: "success",
        data: {
          isLiked: true,
        },
      });
    } catch (error) {
      return res.status(500).json({
        error: error.toString(),
      });
    }
  },
  unlikePost: async (req, res) => {
    try {
      let likeToDelete = await Like.findOneAndDelete({
        post: req.params.id,
        user: req.user,
      });

      if (!likeToDelete) {
        return res.status(400).json({
          status: "fail",
          message: "User has not liked this post",
        });
      }

      return res.status(200).json({
        status: "success",
        data: {
          isLiked: false,
        },
      });
    } catch (error) {
      return res.status(500).json({
        error: error.toString(),
      });
    }
  },
  repost: async (req, res) => {
    try {
      let existingRepost = await Repost.findOne({
        post: req.params.id,
        user: req.user,
      });

      if (existingRepost) {
        return res.status(400).json({
          status: "fail",
          message: "You have already reposted this post",
        });
      }

      let newRepost = await new Repost({
        user: req.user,
        post: req.params.id,
      }).save();

      if (!newRepost) {
        return res.status(400).json({
          status: "fail",
          message: "Failed to repost",
        });
      }

      return res.status(200).json({
        status: "success",
        data: {
          isReposted: true,
        },
      });
    } catch (error) {
      return res.status(500).json({
        error: error.toString(),
      });
    }
  },
  undoRepost: async (req, res) => {
    try {
      let repostToDelete = await Repost.findOneAndDelete({
        post: req.params.id,
        user: req.user,
      });

      if (!repostToDelete) {
        return res.status(400).json({
          status: "fail",
          message: "User has not reposted this post",
        });
      }

      return res.status(200).json({
        status: "success",
        data: {
          isReposted: false,
        },
      });
    } catch (error) {
      return res.status(500).json({
        error: error.toString(),
      });
    }
  },

  getComments: async (req, res) => {
    try {
      console.log(req.query.cursor);
      let aggBuilder = new aggregationBuilder()
        .match({
          replyTo: mongoose.Types.ObjectId(req.params.id)
        })
        .sortNewest("createdAt")
        .paginate(req.query.cursor, "createdAt")
        .lookup("users", "user", "_id", "user")
        .unwind("$user", true)
        .lookup("reposts", "_id", "post", "reposts")
        .lookup("likes", "_id", "post", "likes")
        .lookup("pets", "pet", "_id", "pet")
        .unwind("$pet", true)
        .lookup("posts", "_id", "replyTo", "comments")
        .addField("trendingView", false)
        .addField("timestamp", "$createdAt")
        .addCountField("likeCount", "$likes")
        .addCountField("commentCount", "$comments")
        .addCountField("repostCount", "$reposts")
        .contains("isReposted", req.user, "$reposts.user")
        .contains("isLiked", req.user, "$likes.user")
        .cleanPost()

      let posts = await aggBuilder.execPost();
      if (!posts) {
        return res.status(400).json({
          status: "fail",
          message: "Post not found",
        });
      }

      if (posts.length === 0) {
        return res.sendStatus(204);
      } else {
        return res.status(200).json({ status: "success", data: { comments: posts } });
      }
    } catch (error) {
      return res.status(500).json({
        error: error.toString(),
      });
    }
  },

  postComment: async (req, res) => {
    try {
      let images = [];
      if (req.file != null) {
        let result = await cloudinaryController.uploadImage(
          req.file.path,
          "posts"
        );
        images.push(result.secure_url);
      }
      let newComment = await new Post({
        replyTo: req.params.id,
        content: req.body.content,
        images: images,
        user: req.user,
        isComment: true,
        isQuote: false,
      }).save();

      newComment = await Post.findById(newComment._id).populate(
        "user",
        new aggregationBuilder().USER_EXCLUSIONS_MONGOOSE
      ).lean();
      newComment.likeCount = 0;
      newComment.commentCount = 0;
      newComment.repostCount = 0;

      return res.status(200).json({
        status: "success",
        data: {
          post: newComment,
        },
      });
    } catch (error) {
      let message;
      if (error.errors.content.kind === 'maxlength') {
        message = 'Posts can only have 280 characters or less';
      } else {
        message = 'Server error';
      }
      return res.status(500).json({
        status: "error",
        message,
      });
    }
  },
  getExplore: async (req, res) => {
    try {
      let aggBuilder = new aggregationBuilder()
        .match({
          pet: null,
          isComment: false,
        })
        .sortNewest("createdAt")
        .paginate(req.query.cursor, "createdAt")
        .lookup("reposts", "_id", "post", "reposts")
        .lookup("likes", "_id", "post", "likes")
        .lookup("users", "user", "_id", "user")
        .unwind("$user", true)
        .lookup("pets", "pet", "_id", "pet")
        .unwind("$pet", true)
        .lookup("posts", "_id", "replyTo", "comments")
        .addField("trendingView", false)
        .addField("timestamp", "$createdAt")
        .addCountField("likeCount", "$likes")
        .addCountField("commentCount", "$comments")
        .addCountField("repostCount", "$reposts")
        .contains("isReposted", req.user, "$reposts.user")
        .contains("isLiked", req.user, "$likes.user")
        
        .cleanPost()

      let posts = await aggBuilder.execPost();
      if (posts.length === 0) {
        return res.sendStatus(204);
      } else {
        return res.status(200).json({ status: "success", data: { posts } });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: error.toString(),
      });
    }
  },
  getTimeline: async (req, res) => {
    try {
      // Get users that the client is following
      const follows = await Follow.find({ follower: req.params.id });

      // reposting doesnt show latest repost
      let matchOrConditions = [];
      let followedIds = [];

      // Get posts from the client
      followedIds.push(mongoose.Types.ObjectId(req.user));

      // Get Posts that have been reposted by followed users
      follows.forEach((follow) => {
        matchOrConditions.push({
          reposts: { $elemMatch: { user: follow.followed._id } },
        });
        followedIds.push(follow.followed._id);
      });

      // Get posts that have been reposted by the client
      matchOrConditions.push({
       reposts: { $elemMatch: { user: mongoose.Types.ObjectId(req.user) } },
      });

      // Get posts from followed users that are not comments
      matchOrConditions.push({
        $and: [
          {
            $expr: {
              $in: ["$user", followedIds],
            },
          },
          { isComment: false },
        ],
      });

      let aggBuilder = new aggregationBuilder()
        .lookup("reposts", "_id", "post", "reposts")
        .match({
          $or: matchOrConditions
        })
        .specifyRepostedByFollowing(followedIds)
        .sortNewest("lastInteraction")
        .paginate(req.query.cursor, "lastInteraction")
        .lookup("likes", "_id", "post", "likes")
        .lookup("users", "user", "_id", "user")
        .unwind("$user", true)
        .lookup("pets", "pet", "_id", "pet")
        .unwind("$pet", true)
        .lookup("posts", "_id", "replyTo", "comments")
        .addField("trendingView", false)
        .addField("timestamp", "$createdAt")
        .addCountField("likeCount", "$likes")
        .addCountField("commentCount", "$comments")
        .addCountField("repostCount", "$reposts")
        .contains("isReposted", req.user, "$reposts.user")
        .contains("isLiked", req.user, "$likes.user")
        .cleanPost();
        

      let posts = await aggBuilder.execPost();

      if (posts.length === 0) {
        return res.sendStatus(204);
      }

      return res.status(200).json({ status: "success", data: { posts } });

    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
  getProfilePosts: async (req, res) => {
    try {
      let matchOrConditions = [];
      const userId = mongoose.Types.ObjectId(req.params.id);
      let followedIds = [userId];

      // Get posts that have been reposted by the client
      matchOrConditions.push({
        reposts: {
          $elemMatch: { user: userId },
        },
      });

      // Get posts from the user that are not comments
      matchOrConditions.push({
        $and: [
          {
            "user": userId
          },
          { isComment: false },
        ],
      });

      let aggBuilder = new aggregationBuilder()
        .lookup("reposts", "_id", "post", "reposts")
        .match({
          $or: matchOrConditions
        })
        .specifyRepostedByFollowing(followedIds)
        .sortNewest("lastInteraction")
        .paginate(req.query.cursor, "lastInteraction")
        .lookup("likes", "_id", "post", "likes")
        .lookup("users", "user", "_id", "user")
        .unwind("$user", true)
        .lookup("pets", "pet", "_id", "pet")
        .unwind("$pet", true)
        .lookup("posts", "_id", "replyTo", "comments")
        .addField("trendingView", false)
        .addField("timestamp", "$createdAt")
        .addCountField("likeCount", "$likes")
        .addCountField("commentCount", "$comments")
        .addCountField("repostCount", "$reposts")
        .contains("isReposted", req.user, "$reposts.user")
        .contains("isLiked", req.user, "$likes.user")
        .cleanPost();

      let posts = await aggBuilder.execPost();

      if (posts.length === 0) {
        return res.sendStatus(204);
      } else {
        return res.status(200).json({ status: 'success', data: { posts } });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },

};


module.exports = postController;
