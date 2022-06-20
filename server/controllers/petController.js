require("dotenv").config();
const { default: mongoose } = require("mongoose");
var petfinder = require("@petfinder/petfinder-js");
const mongo = require("./mongoConstants");
var pf = new petfinder.Client({
  apiKey: process.env.PF_KEY,
  secret: process.env.PF_SECRET,
});

const Post = require("../models/postModel");

const petController = {
  getPets: async (req, res) => {
    try {
      let response = { data: { pets: [] } };
      let page = req.query.page;
      let firstPostTime = new Date(req.query.firstPostTime);

      let pets = await Post.aggregate([
        {
          $match: {
            $and: [
              { $expr: { $lte: ["$createdAt", firstPostTime] } },
              { pet: { $ne: null } },
            ],
          },
        },
        {
          $lookup: {
            from: "reposts",
            localField: "reposts",
            foreignField: "_id",
            as: "reposts",
          },
        },
        {
          $lookup: {
            from: "pets",
            localField: "pet",
            foreignField: "_id",
            as: "pet",
          },
        },
        {
          $unwind: "$pet",
        },
        mongo.USER_HAS_REPOSTED(req, "$reposts.user"),
        mongo.USER_HAS_LIKED(req, "$likes"),
        { $sort: { createdAt: -1 } },
        mongo.PAGINATE(page),
      ]);

      if (!pets) {
        return res.status(500).json({ no: "no" });
      }
      pets[0].data.forEach((pet) => {
        response.data.pets.push({
          _id: pet._id,
          pet: pet.pet,
          trendingView: false,
          likeCount: pet.likes.length,
          commentCount: pet.comments.length,
          repostCount: pet.reposts.length,
          isLiked: pet.isLiked,
          isReposted: pet.isReposted,
          createdAt: pet.createdAt,
        });
      });
      response.status = "success";
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
};

module.exports = petController;
