const User = require("../models/userModel");
const Post = require("../models/postModel");
const mongoose = require("mongoose");
const aggregationBuilder = require("../utils/aggregationBuilder");

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
  let aggBuilder = new aggregationBuilder()
    .match({
      $or: [
        { displayname: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } }
      ]
    }).lookup("follows", "_id", "followed", "followers")
    .addField("isFollowed", {
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
    })
    .project({ followers: 0 })
    .sortNewest("createdAt")
    .cleanUser()
    .paginate(cursor, "createdAt")

  return aggBuilder.execUser();
}
async function searchPosts(req, res, getFiltersFunction) {
  let { query, cursor } = req.query; // Attribute named "query" in the url parameters
  query = new RegExp(".*" + query + ".*");

  let aggBuilder = new aggregationBuilder()
    .lookup("users", "user", "_id", "user")
    .unwind("$user", true)
    .lookup("pets", "pet", "_id", "pet")
    .unwind("$pet", true)
    .match({
      $or: [
        ...getFiltersFunction(query)
      ]
    })
    .lookup("likes", "_id", "post", "likes")
    .contains("isLiked", req.user, "$likes.user")
    .lookup("reposts", "_id", "post", "reposts")
    .contains("isReposted", req.user, "$reposts.user")
    .addField("trendingView", false)
    .addField("timestamp", "$createdAt")
    .lookup("posts", "_id", "replyTo", "comments")
    .addCountField("likeCount", "$likes")
    .addCountField("commentCount", "$comments")
    .addCountField("repostCount", "$reposts")
    .sortNewest("createdAt")
    .cleanPost()
    .paginate(cursor, "createdAt")
  return aggBuilder.execPost();
}

module.exports = searchController;
