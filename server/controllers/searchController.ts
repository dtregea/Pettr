import { Request, Response } from "express";
import mongoose from "mongoose";
import aggregationBuilder from "../utils/aggregationBuilder";

function getPostFilters(query: string) {
  return [
    { content: { $regex: query, $options: "i" } },
    { "user.displayname": { $regex: query, $options: "i" } },
    { "user.username": { $regex: query, $options: "i" } }
  ];
}

interface searchResponse {
  status: string
  data: {
    posts: any[]
    users: any[]
  }
}
function getPetFilters(query: string) {
  return [{ "pet.name": { $regex: query, $options: "i" } }];
}
const searchController = {
  searchPhrase: async (req: Request, res: Response) => {
    try {
      let response: searchResponse = {
        status: "success",
        data: { posts: [], users: []},
      };
      let {type, query, cursor} = req.query;

      if (!(type === 'user' || type === 'post' || type === 'pet')) {
        return res.status(400).json({ status: "fail", message: "Invalid type" });
      }

      let results;
      if (type === 'user') {
        results = await searchUsers(query as string, cursor as string, req.user);
        response.data.users = results;
      } else if (type === 'post') {
        results = await searchPosts(query as string, cursor as string, req.user, getPostFilters);
        response.data.posts = results;
      } else if (type === 'pet') {
        results = await searchPets(query as string, cursor as string, req.user, getPetFilters);
        response.data.posts = results;
      }

      return res.status(200).json(response);
    } catch (error: any) {
      console.log(error);
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
};

async function searchUsers(query: string, cursor: string, userId: string) {
  let regex = new RegExp(".*" + query + ".*");
  let aggBuilder = new aggregationBuilder()
    .match({
      $or: [
        { displayname: { $regex: regex, $options: "i" } },
        { username: { $regex: regex, $options: "i" } }
      ]
    })
    .sortNewest("createdAt")
    .paginate(cursor, "createdAt")
    .lookup("follows", "_id", "followed", "followers")
    .addField("isFollowed", {
      $cond: [
        {
          $in: [
            new mongoose.Types.ObjectId(userId),
            "$followers.follower",
          ],
        },
        true,
        false,
      ],
    })
    .project({ followers: 0 })
    .cleanUser(null)

  return aggBuilder.execUser();
}

async function searchPosts(query: string, cursor: string, userId: string, getFiltersFunction: any) {
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
    .cleanPost(null)
    
  return aggBuilder.execPost();
}

async function searchPets(query: string, cursor: string, userId: string, getFiltersFunction: any) {
  let regex = new RegExp(".*" + query + ".*");

  let aggBuilder = new aggregationBuilder()
    .lookup("pets", "pet", "_id", "pet")
    .unwind("$pet", true)
    .match({
      $or: [
        ...getFiltersFunction(regex)
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
    .cleanPost(null)
    
  return aggBuilder.execPost();
}

export default searchController;
