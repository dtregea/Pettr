const User = require("../models/userModel");
const Post = require("../models/postModel");
const mongo = require("./mongoHelper");
const mongoose = require("mongoose");

function getPostFilters(query) {
  return [
    { content: { $regex: query, $options: "i" } },
    { "user.displayname": { $regex: query, $options: "i" } },
    { "user.username": { $regex: query, $options: "i" } }
  ];
}

function getPetFilters(query) {
  return [{ "pet.name": { $regex: query, $options: "i" } }];
}
const searchController = {
  searchPhrase: async (req, res) => {
    try {
      let response = {
        status: "success",
        data: { posts: [], users: [] },
      };
      let type = req.query.type;

      if (!(type === 'user' || type === 'post' || type === 'pet')) {
        return res.status(400).json({ status: "fail", message: "Invalid type" });
      }
      let results;
      if (type === 'user') {
        results = await searchUsers(req, res);
        response.data.users = results;
      } else if (type === 'post') {
        results = await searchPosts(req, res, getPostFilters);
        response.data.posts = results;
      } else if (type === 'pet') {
        results = await searchPosts(req, res, getPetFilters);
        response.data.posts = results;
      } else {

      }


      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
};

async function searchUsers(req, res) {
  let { query, cursor } = req.query; // Attribute named "query" in the url parameters
  query = new RegExp(".*" + query + ".*");
  let aggregate = [{
    $match: {
      $or: [
        { displayname: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } }
      ]
    },
  },
  mongo.LOOKUP("follows", "_id", "followed", "followers"),
  {
    $addFields: {
      isFollowed: {
        $cond: [
          {
            $in: [
              mongoose.Types.ObjectId(req.user),
              "$followers.follower",
            ],
          },
          true,
          false,
        ],
      },
    },
  },
  mongo.SORT_BY_NEWEST("createdAt"),
  {
    $project: mongo.USER_EXCLUSIONS
  },];

  if (cursor != '') {
    aggregate.push(mongo.PAGINATE(cursor, "createdAt"));
  }
  aggregate.push({ $limit: 15 });
  return User.aggregate(aggregate);
}
async function searchPosts(req, res, getFiltersFunction) {
  let { query, cursor } = req.query; // Attribute named "query" in the url parameters
  query = new RegExp(".*" + query + ".*");

  let aggregate = [
    mongo.LOOKUP("users", "user", "_id", "user"),
    mongo.UNWIND("$user", true),
    mongo.LOOKUP("pets", "pet", "_id", "pet"),
    mongo.UNWIND("$pet", true),
    {
      $match: {
        $or: [
          ...getFiltersFunction(query)
        ]
      }
    },
    mongo.LOOKUP("likes", "_id", "post", "likes"),
    // Add a property that indicates whether the user has liked this post
    mongo.CONTAINS("isLiked", req.user, "$likes.user"),
    // Convert repost id's to repost documents
    mongo.LOOKUP("reposts", "_id", "post", "reposts"),
    // Add a property that indicates whether the user has reposted this post
    mongo.CONTAINS("isReposted", req.user, "$reposts.user"),
    mongo.ADD_FIELD("trendingView", false),
    mongo.ADD_FIELD("timestamp", "$createdAt"),
    mongo.LOOKUP("posts", "_id", "replyTo", "comments"),
    mongo.ADD_COUNT_FIELD("likeCount", "$likes"),
    mongo.ADD_COUNT_FIELD("commentCount", "$comments"),
    mongo.ADD_COUNT_FIELD("repostCount", "$reposts"),
    mongo.SORT_BY_NEWEST("createdAt"),
    {
      $project: { user: mongo.USER_EXCLUSIONS },
    },
  ];

  if (cursor != '') {
    aggregate.push(mongo.PAGINATE(cursor, "createdAt"));
  }

  aggregate.push({ $limit: 15 });
  return Post.aggregate(aggregate);
}

module.exports = searchController;
