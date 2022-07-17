require("dotenv").config();
const mongo = require("./mongoConstants");
const petfinder = require("petfinder-js-sdk");
const pf = new petfinder.Client({
  apiKey: process.env.PF_KEY,
  secret: process.env.PF_SECRET,
});

const Post = require("../models/postModel");
const Pet = require("../models/petModel");

const petController = {
  getPets: async (req, res) => {
    try {
      let page = req.query.page;
      let type = camelCaseToSentenceCase(req.query.type)
        .replace(/And\s/g, "")
        .replace(/\s/g, "-");

      // Retrieve data with "before" as the time the user started viewing
      // to keep new data from causing duplicate results in later pages
      let petFinderResults = await pf.animal.search({
        page: page,
        before: req.query.startedBrowsing,
        limit: 15,
        type: type,
      });

      let idToAnimal = {};
      petFinderResults.data.animals.forEach((animal) => {
        idToAnimal[animal.id] = animal;
      });

      // Upsert retreived animals to keep animal data up-to-date upon viewing
      let animalsToUpsert = Object.values(idToAnimal).map((animal) => {
        return {
          updateOne: {
            filter: {
              apiId: animal.id,
            },
            update: {
              name: animal.name,
              species: animal.species,
              photos:
                animal.photos[0] && animal.photos[0].medium
                  ? [animal.photos[0].medium]
                  : [],
              apiId: animal.id,
              published_at: new Date(animal.published_at),
            },
            upsert: true,
          },
        };
      });
      await Pet.bulkWrite(animalsToUpsert);

      // Get upserted pet objects
      let upsertedPets = await Pet.find({ apiId: Object.keys(idToAnimal) });
      let upsertedPetIds = upsertedPets.map((pet) => pet._id);

      // Map pet id to post, if it maps to undefined, this pet doesnt have an associated post
      // so we will create one
      let existingPetPosts = await Post.find({ pet: upsertedPetIds });
      let idToPost = {};
      existingPetPosts.forEach((post) => {
        idToPost[post.pet] = post;
      });

      let petsWithoutPosts = [];
      upsertedPets.forEach((pet) => {
        if (!idToPost[pet._id]) {
          petsWithoutPosts.push({
            isComment: false,
            isQuote: false,
            pet: pet._id,
          });
        }
      });
      await Post.insertMany(petsWithoutPosts);

      // Retrieve all posts associated with this page of pets
      let petPosts = await Post.aggregate([
        {
          $match: {
            $and: [
              { $expr: { $in: ["$pet", upsertedPetIds] } },
              { pet: { $ne: null } },
            ],
          },
        },
        mongo.LOOKUP("reposts", "reposts", "_id", "reposts"),
        mongo.LOOKUP("pets", "pet", "_id", "pet"),
        mongo.UNWIND("$pet", false),
        mongo.USER_HAS_REPOSTED(req, "$reposts.user"),
        mongo.USER_HAS_LIKED(req, "$likes"),
        mongo.ADD_FIELD("trendingView", false),
        mongo.ADD_FIELD("timestamp", "$createdAt"),
        mongo.ADD_COUNT_FIELD("likeCount", "$likes"),
        mongo.ADD_COUNT_FIELD("commentCount", "$comments"),
        mongo.ADD_COUNT_FIELD("repostCount", "$reposts"),
        { $sort: { "pet.published_at": -1 } },
      ]);

      if (!petPosts) {
        return res.status(500).json({ no: "no" });
      }
      return res
        .status(200)
        .json({ data: { pets: petPosts }, status: "success" });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
};

function camelCaseToSentenceCase(str) {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, function (str) {
      return str.toUpperCase();
    })
    .trim();
}

module.exports = petController;
