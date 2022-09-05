//const { default: mongoose } = require("mongoose");
const mongoose = require('mongoose');
const Post = require("../models/postModel");
const Repost = require("../models/repostModel");
const mongo = require("./mongoHelper");
const cloudinaryController = require("./cloudinaryController");
const Follow = require("../models/followModel");
const Like = require('../models/likeModel');
//const Notification = require ('../models/notificationModel');

const postController = {
  getPosts: async (req, res) => {
    try {
      let posts = await Post.find({})
        .populate(
          "user",
          mongo.USER_EXCLUSIONS_MONGOOSE
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
        mongo.USER_EXCLUSIONS_MONGOOSE
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
      let post = await Post.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(req.params.id),
          },
        },
        mongo.LOOKUP("users", "user", "_id", "user"),
        mongo.UNWIND("$user", true),
        mongo.LOOKUP("pets", "pet", "_id", "pet"),
        mongo.UNWIND("$pet", true),
        mongo.LOOKUP("reposts", "_id", "post", "reposts"),
        mongo.LOOKUP("likes", "_id", "post", "likes"),
        mongo.LOOKUP("posts", "_id", "replyTo", "comments"),
        mongo.CONTAINS("isLiked", userId, "$likes.user"),
        mongo.CONTAINS("isReposted", userId, "$reposts.user"),
        mongo.ADD_FIELD("trendingView", false),
        mongo.ADD_FIELD("timestamp", "$createdAt"),
        mongo.ADD_COUNT_FIELD("likeCount", "$likes"),
        mongo.ADD_COUNT_FIELD("commentCount", "$comments"),
        mongo.ADD_COUNT_FIELD("repostCount", "$reposts"),
        {
          $project: { user: mongo.USER_EXCLUSIONS },
        },
      ]);

      if (!post) {
        return res.status(400).json({
          status: "error",
          error: 'This post does not exist',
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
      let trendingPosts = await Post.aggregate([
        mongo.LOOKUP("likes", "_id", "post", "likes"),
        mongo.UNWIND("$likes", false),
        // Unwind likes, group and get count to sort descendingly
        {
          $group: {
            _id: "$_id",
            likesCount: {
              $sum: 1,
            },
            doc: {
              $first: "$$ROOT",
            },
          },
        },
        mongo.SORT_BY_NEWEST("likesCount"),
        {
          $limit: 10,
        },
        mongo.LOOKUP("reposts", "_id", "post", "doc.reposts"),
        mongo.LOOKUP("likes", "_id", "post", "doc.likes"),
        mongo.LOOKUP("posts", "_id", "replyTo", "doc.comments"),
        mongo.LOOKUP("users", "doc.user", "_id", "doc.user"),
        mongo.UNWIND("$doc.user", true),
        mongo.LOOKUP("pets", "doc.pet", "_id", "doc.pet"),
        mongo.UNWIND("$doc.pet", true),
        mongo.CONTAINS("doc.isLiked", req.user, "$doc.likes.user"),
        mongo.CONTAINS("doc.isReposted",req.user, "$doc.reposts.user"),
        mongo.ADD_FIELD("doc.trendingView", true),
        mongo.ADD_FIELD("doc.timestamp", "$createdAt"),
        mongo.ADD_COUNT_FIELD("doc.likeCount", "$doc.likes"),
        mongo.ADD_COUNT_FIELD("doc.commentCount", "$doc.comments"),
        mongo.ADD_COUNT_FIELD("doc.repostCount", "$doc.reposts"),
        {
          $project: {
            doc: mongo.POST_EXCLUSIONS,
          },
        },
      ]);

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

      // let likedPost = await Post.findById(req.params._id);

      // let notification = await new Notification({
      //   sender: req.user,
      //   receiver: likedPost.user,
      // }).save();

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
      let userId = mongoose.Types.ObjectId(req.user);
      let post = await Post.aggregate([
        mongo.LOOKUP("reposts", "_id", "post", "reposts"),
        mongo.LOOKUP("likes", "_id", "post", "likes"),
        mongo.LOOKUP("users", "user", "_id", "user"),
        mongo.UNWIND("$user", true),
        mongo.LOOKUP("pets", "pet", "_id", "pet"),
        mongo.UNWIND("$pet", true),
        mongo.LOOKUP("posts", "_id", "replyTo", "comments"),
        mongo.ADD_FIELD("trendingView", false),
        mongo.ADD_FIELD("timestamp", "$createdAt"),
        mongo.ADD_COUNT_FIELD("likeCount", "$likes"),
        mongo.ADD_COUNT_FIELD("commentCount", "$comments"),
        mongo.ADD_COUNT_FIELD("repostCount", "$reposts"),
        mongo.CONTAINS("isReposted", userId, "$reposts.user"),
        mongo.CONTAINS("isLiked", userId, "$likes.user"),
        {
          $match: {
            replyTo: mongoose.Types.ObjectId(req.params.id),
          },
        },
        mongo.SORT_BY_NEWEST("createdAt"),
        {
          $project: {
            user: mongo.USER_EXCLUSIONS
          },
        },
      ]);

      if (!post) {
        return res.status(400).json({
          status: "fail",
          message: "Post not found",
        });
      }
      let results = [];
      if (post) {
        results = post;
      }
      return res.status(200).json({
        status: "success",
        data: {
          comments: results,
        },
      });
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
        mongo.USER_EXCLUSIONS_MONGOOSE
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
  getRecentUserPosts: async (req, res) => {
    try {
      const follows = await Follow.find({ follower: req.params.id });
      let followedIds = follows.map(follow => follow.followed._id);
      followedIds.push(mongoose.Types.ObjectId(req.user));
      let posts = await getPostsPaginated(req, followedIds, "createdAt", {
        $match: {
          pet: null,
          isComment: false,
        },
      });

      if (posts.length === 0) {
        return res.sendStatus(204);
      } else {
        return res.status(200).json({ message: "success", data: { posts } });
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

      const posts = await getPostsPaginated(req, followedIds, "lastInteraction", {
        $match: {
          $or: matchOrConditions
        },
      });

      if (posts.length === 0) {
        return res.sendStatus(204);
      }

      return res.status(200).json({ message: "success", data: { posts } });

    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
  getUserPosts: async (req, res) => {
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

      let posts = await getPostsPaginated(req, followedIds, "lastInteraction", {
        $match: {
          $or: matchOrConditions
        },
      });

      if (posts.length === 0) {
        return res.sendStatus(204);
      } else {
        return res.status(200).json({ message: 'success', data: { posts } });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },

};

/**
 * 
 * @param req Request containing the id of the last post on the users feed
 * @param followedIds List of ids to base repost time sorting off of
 * @param sortBy Field to sort by in descending order. 
 *               -$lastInteraction to sort by repost time by
 *               users provided in followedIds.
 *               -$createdAt to sort by post creation time.
 * @param matchConditions A $match aggregation to filter results
 * @returns A paginated list of posts sorted based on the reposts made by the users
 *          in followedIds
 */
async function getPostsPaginated(req, followedIds, sortBy, matchConditions) {
  let userId = req.user;
  let { cursor } = req.query;
  let aggregate = [
    mongo.LOOKUP("reposts", "_id", "post", "reposts"),
    matchConditions,
    mongo.LOOKUP("likes", "_id", "post", "likes"),
    mongo.LOOKUP("users", "user", "_id", "user"),
    mongo.UNWIND("$user", true),
    mongo.LOOKUP("pets", "pet", "_id", "pet"),
    mongo.UNWIND("$pet", true),
    mongo.LOOKUP("posts", "_id", "replyTo", "comments"),
    mongo.ADD_FIELD("trendingView", false),
    mongo.ADD_FIELD("timestamp", "$createdAt"),
    mongo.ADD_COUNT_FIELD("likeCount", "$likes"),
    mongo.ADD_COUNT_FIELD("commentCount", "$comments"),
    mongo.ADD_COUNT_FIELD("repostCount", "$reposts"),
    mongo.CONTAINS("isReposted", userId, "$reposts.user"),
    mongo.CONTAINS("isLiked", userId, "$likes.user"),
    // Get a list of reposts made by followed users
    {
      $addFields: {
        repostedBy: {
          $filter: {
            input: "$reposts",
            as: "repost",
            cond: { $in: ["$$repost.user", followedIds] },
          },
        },
      },
    },
    // Get the most recent repost made by a followed user
    {
      $addFields: {
        mostRecentRepost: {
          $cond: [
            {
              $gt: [{ $size: "$repostedBy" }, 0],
            },
            { $last: "$repostedBy" },
            [],
          ],
        },
      },
    },
    // Convert that most recent repost to a single repost object
    mongo.UNWIND("$mostRecentRepost", true),

    // Determine whether the last interaction was the post creation
    // or a repost made by a followed user
    {
      $addFields: {
        lastInteraction: {
          $cond: [
            {
              $ifNull: ["$mostRecentRepost", false],
            },
            "$mostRecentRepost.createdAt",
            "$createdAt",
          ],
        },
      },
    },
    // Convert repost objects to users
    mongo.LOOKUP("users", "reposts.user", "_id", "reposts"),
    // Convert most recent repost to the user
    mongo.LOOKUP("users", "mostRecentRepost.user", "_id", "mostRecentRepost"),
    // Convert it from an array to a property
    mongo.UNWIND("$mostRecentRepost", true),
    mongo.ADD_FIELD("repostedBy", "$mostRecentRepost.displayname"),
    mongo.SORT_BY_NEWEST(sortBy),
    {
      $project: mongo.POST_EXCLUSIONS,
    },
  ];

  if (cursor != '') { // last interactions are eliminated from this whenever a cursor is provided and sort is by createdDate
    aggregate.push(mongo.PAGINATE(cursor, sortBy));
  }

  aggregate.push({ $limit: 15 });
  let posts = await Post.aggregate(aggregate);
  return posts;

}

module.exports = postController;
