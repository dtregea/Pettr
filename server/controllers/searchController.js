const User = require("../models/userModel");
const Post = require("../models/postModel");
const constants = require("./mongoConstants");
const searchController = {
  searchPhrase: async (req, res) => {
    try {
      let response = {
        status: "success",
        data: { pets: [], posts: [], users: [] },
      };
      let query = req.query.query;

      let posts = await searchPosts(req, res, query);
      console.log(posts);
      posts.forEach((post) => {
        let data = {
          _id: post._id,
          user: post.user,
          content: post.content,
          image: post.images == null ? [] : post.images[0],
          trendingView: false,
          timestamp: post.createdAt,
          likeCount: post.likes.length,
          commentCount: post.comments.length,
          repostCount: post.reposts.length,
          isLiked: post.isLiked,
          isQuote: post.isQuote,
          isComment: post.isComment,
          isReposted: post.isReposted,
          repostedBy:
            post.mostRecentRepost != null
              ? post.mostRecentRepost.displayname
              : null,
          pet: post.pet,
        };
        response.data[data.pet != null ? "pets" : "posts"].push(data);
      });

      console.log(response);
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
};

async function searchUsers(req, res, query) {
  //return query results
}
async function searchPosts(req, res, query) {
  query = new RegExp(".*" + query + ".*");
  //return query results.
  return Post.aggregate([
    {
      $lookup: {
        from: "pets",
        localField: "pet",
        foreignField: "_id",
        as: "pet",
      },
    },
    {
      $unwind: {
        path: "$pet",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: {
        $or: [
          { content: query },
          { "pet.name": query },
          { "user.displayname": query },
          { "user.username": query },
        ],
      },
    },
    // Add a property that indicates whether the user has liked this post
    constants.USER_HAS_LIKED(req, "$likes"),
    // // Convert repost id's to repost documents
    {
      $lookup: {
        from: "reposts",
        localField: "reposts",
        foreignField: "_id",
        as: "reposts",
      },
    },
    // // Add a property that indicates whether the user has reposted this post
    constants.USER_HAS_REPOSTED(req, "$reposts.user"),

    {
      $lookup: {
        from: "images",
        localField: "images",
        foreignField: "_id",
        as: "images",
      },
    },

    {
      $project: constants.USER_EXCLUSIONS,
    },
  ]);
}

module.exports = searchController;
