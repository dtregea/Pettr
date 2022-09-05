require("dotenv").config();
const mongo = require("./mongoHelper");
const petfinder = require("petfinder-js-sdk");
const pf = new petfinder.Client({
  apiKey: process.env.PF_KEY,
  secret: process.env.PF_SECRET,
});

const Post = require("../models/postModel");
const Pet = require("../models/petModel");
const cloudinaryController = require("./cloudinaryController");

const petController = {
  getPets: async (req, res) => {
    try {
      let { page, type, location, startedBrowsing, distance } = req.query;
      if (type) {
        type = camelCaseToSentenceCase(type)
          .replace(/And\s/g, "")
          .replace(/\s/g, "-");
      }

      let parameters = {
        page: page,
        before: startedBrowsing,
        limit: 15,
        type,
        distance
      };

      // Type can be empty but location cannot be
      if (location) {
        parameters.location = location;
      }

      // Retrieve data with "before" as the time the user started viewing
      // to keep new data from causing duplicate results in later pages
      let petFinderResults = await pf.animal.search(parameters);
      let upsertedPetApiIds = await upsertPets(petFinderResults);

      // Upsert retreived animals to keep animal data up-to-date upon viewing
      let upsertedPets = await Pet.find({ apiId: upsertedPetApiIds});
      let upsertedPetIds = upsertedPets.map(pet => pet._id);

      await upsertPetPosts(upsertedPetIds);

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
        mongo.LOOKUP("reposts", "_id", "post", "reposts"),
        mongo.LOOKUP("likes", "_id", "post", "likes"),
        mongo.LOOKUP("posts", "_id", "replyTo", "comments"),
        mongo.LOOKUP("pets", "pet", "_id", "pet"),
        mongo.UNWIND("$pet", false),
        mongo.CONTAINS("isReposted", req.user, "$reposts.user"),
        mongo.CONTAINS("isLiked", req.user, "$likes.user"),
        mongo.ADD_FIELD("trendingView", false),
        mongo.ADD_FIELD("timestamp", "$pet.publishedAt"),
        mongo.ADD_COUNT_FIELD("likeCount", "$likes"),
        mongo.ADD_COUNT_FIELD("commentCount", "$comments"),
        mongo.ADD_COUNT_FIELD("repostCount", "$reposts"),
        { $sort: { "pet.published_at": -1 } },
      ]);

      if (!petPosts) {
        return res.sendStatus(204);
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

async function upsertPets(petFinderResults) {

  let idToAnimal = {};
  petFinderResults.data.animals.forEach((animal) => {
    idToAnimal[animal.id] = animal;
  });

  let animalsToUpsert = Object.values(idToAnimal).map((animal) => {
    return {
      updateOne: {
        filter: {
          apiId: animal.id,
        },
        update: {
          name: animal.name,
          species: animal.species,
          images:
            animal.photos[0] ? Object.values(animal.photos[0]) : [cloudinaryController.NO_PICTURE_AVAILABLE_LINK],
          apiId: animal.id,
          published_at: new Date(animal.published_at),
          breeds: animal.breeds,
          age: animal.age,
          gender: animal.gender,
          size: animal.size,
          colors: animal.colors,
          attributes: animal.attributes,
          environment: animal.environment,
          status: animal.status,
          contact: animal.contact,
          orgApiId: animal.organization_id,
          tags: animal.tags
        },
        upsert: true,
      },
    };
  });
  await Pet.bulkWrite(animalsToUpsert);
  return Object.keys(idToAnimal);
}

async function upsertPetPosts(petIds) {
  let postsToUpsert = [];

  petIds.forEach((petId) => {

    postsToUpsert.push({
      updateOne: {
        filter: {
          pet: petId,
        },
        update: {
          pet: petId,
          isQuote: false,
          isComment: false,
        },
        upsert: true,
      },
    });
  });

  await Post.bulkWrite(postsToUpsert);


}

function camelCaseToSentenceCase(str) {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, function (str) {
      return str.toUpperCase();
    })
    .trim();
}

module.exports = petController;
