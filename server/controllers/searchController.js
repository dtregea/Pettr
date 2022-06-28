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
      let query = req.query.query; // Attribute named "query" in the url parameters
      let posts = await searchPosts(req, res, query);
      posts.forEach((post) => {
        let data = {
          _id: post._id,
          user: post.user,
          content: post.content,
          images: post.images,
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

  return Post.aggregate([
    constants.LOOKUP("pets", "pet", "_id", "pet"),
    constants.UNWIND("$pet", true),
    constants.LOOKUP("users", "user", "_id", "user"),
    constants.UNWIND("$user", true),
    {
      $match: {
        $or: [
          { content: { $regex: query, $options: "i" } },
          { "pet.name": { $regex: query, $options: "i" } },
          { "user.displayname": { $regex: query, $options: "i" } },
          { "user.username": { $regex: query, $options: "i" } },
        ],
      },
    },
    // Add a property that indicates whether the user has liked this post
    constants.USER_HAS_LIKED(req, "$likes"),
    // Convert repost id's to repost documents
    constants.LOOKUP("reposts", "reposts", "_id", "reposts"),
    // Add a property that indicates whether the user has reposted this post
    constants.USER_HAS_REPOSTED(req, "$reposts.user"),
    {
      $project: constants.USER_EXCLUSIONS,
    },
  ]);
}

module.exports = searchController;
