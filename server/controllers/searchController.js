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
      let {type, query, cursor} = req.query;

      if (!(type === 'user' || type === 'post' || type === 'pet')) {
        return res.status(400).json({ status: "fail", message: "Invalid type" });
      }

      let results;
      if (type === 'user') {
        results = await searchUsers(query, cursor, req.user);
        response.data.users = results;
      } else if (type === 'post') {
        results = await searchPosts(query, cursor, req.user, getPostFilters);
        response.data.posts = results;
      } else if (type === 'pet') {
        results = await searchPets(query, cursor, req.user, getPetFilters);
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

async function searchUsers(query, cursor, userId) {
  query = new RegExp(".*" + query + ".*");
  let aggBuilder = new aggregationBuilder()
    .match({
      $or: [
        { displayname: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } }
      ]
    })
    .sortNewest("createdAt")
    .paginate(cursor, "createdAt")
    .lookup("follows", "_id", "followed", "followers")
    .addField("isFollowed", {
      $cond: [
        {
          $in: [
            mongoose.Types.ObjectId(userId),
            "$followers.follower",
          ],
        },
        true,
        false,
      ],
    })
    .project({ followers: 0 })
    .cleanUser()

  return aggBuilder.execUser();
}

async function searchPosts(query, cursor, userId, getFiltersFunction) {
  let aggBuilder = new aggregationBuilder()
    .lookup("users", "user", "_id", "user")
    .unwind("$user", true)
    .match({
      $or: [
        ...getFiltersFunction(query)
      ]
    })
    .sortNewest("createdAt")
    .paginate(cursor, "createdAt")
    .lookup("pets", "pet", "_id", "pet")
    .unwind("$pet", true)
    .lookup("likes", "_id", "post", "likes")
    .contains("isLiked", userId, "$likes.user")
    .lookup("reposts", "_id", "post", "reposts")
    .contains("isReposted", userId, "$reposts.user")
    .addField("trendingView", false)
    .addField("timestamp", "$createdAt")
    .lookup("posts", "_id", "replyTo", "comments")
    .addCountField("likeCount", "$likes")
    .addCountField("commentCount", "$comments")
    .addCountField("repostCount", "$reposts")
    .cleanPost()
    
  return aggBuilder.execPost();
}

async function searchPets(query, cursor, userId, getFiltersFunction) {
  query = new RegExp(".*" + query + ".*");

  let aggBuilder = new aggregationBuilder()
    .lookup("pets", "pet", "_id", "pet")
    .unwind("$pet", true)
    .match({
      $or: [
        ...getFiltersFunction(query)
      ]
    })
    .sortNewest("createdAt")
    .paginate(cursor, "createdAt")
    .lookup("users", "user", "_id", "user")
    .unwind("$user", true)
    .lookup("likes", "_id", "post", "likes")
    .contains("isLiked", userId, "$likes.user")
    .lookup("reposts", "_id", "post", "reposts")
    .contains("isReposted", userId, "$reposts.user")
    .addField("trendingView", false)
    .addField("timestamp", "$createdAt")
    .lookup("posts", "_id", "replyTo", "comments")
    .addCountField("likeCount", "$likes")
    .addCountField("commentCount", "$comments")
    .addCountField("repostCount", "$reposts")
    .cleanPost()
    
  return aggBuilder.execPost();
}

module.exports = searchController;
