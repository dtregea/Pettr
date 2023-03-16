require("dotenv").config();
import {Client} from "petfinder-js-sdk";
import {AxiosResponse} from "axios";
import { Schema } from "mongoose";

const pf = new Client({
  // @ts-ignore
  apiKey: process.env.PF_KEY,
  // @ts-ignore
  secret: process.env.PF_SECRET,
});

import Post from "../models/postModel";
import Pet from "../models/petModel";
import cloudinaryController from "./cloudinaryController";
import aggregationBuilder from "../utils/aggregationBuilder";
import { Request, Response } from "express";
import { ObjectId } from "mongoose";

const petController = {
  getPets: async (req: Request, res: Response) => {
    try {
      let { page, type, location, startedBrowsing, distance } = req.query;
      if (type) {
        type = camelCaseToSentenceCase(type as string)
          .replace(/And\s/g, "")
          .replace(/\s/g, "-");
      }

      let parameters: any = {
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
      let upsertedPetApiIds = await upsertPets(petFinderResults as AxiosResponse<any, any>);

      // Upsert retreived animals to keep animal data up-to-date upon viewing
      let upsertedPets = await Pet.find({ apiId: upsertedPetApiIds });
      let upsertedPetIds: any = upsertedPets.map(pet => pet._id);

      await upsertPetPosts(upsertedPetIds);

      // Retrieve all posts associated with this page of pets
      let aggBuilder = new aggregationBuilder()
        .match({
          $and: [
            { $expr: { $in: ["$pet", upsertedPetIds] } },
            { pet: { $ne: null } },
          ],
        })
        .lookup("reposts", "_id", "post", "reposts")
        .lookup("likes", "_id", "post", "likes")
        .lookup("posts", "_id", "replyTo", "comments")
        .lookup("pets", "pet", "_id", "pet")
        .unwind("$pet", false)
        .contains("isReposted", req.user, "$reposts.user")
        .contains("isLiked", req.user, "$likes.user")
        .addField("trendingView", false)
        .addField("timestamp", "$pet.publishedAt")
        .addCountField("likeCount", "$likes")
        .addCountField("commentCount", "$comments")
        .addCountField("repostCount", "$reposts")
        .sortNewest("pet.published_at")

      let petPosts = await aggBuilder.execPost();

      if (!petPosts) {
        return res.sendStatus(204);
      }
      return res
        .status(200)
        .json({ data: { pets: petPosts }, status: "success" });
    } catch (error: any) {
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
};

async function upsertPets(petFinderResults: AxiosResponse<any>) {

  let idToAnimal = {};
  petFinderResults.data.animals.forEach((animal: any) => {
    const animalId = animal.id as string;
    (idToAnimal as any)[animalId] = animal;
  });

  let animalsToUpsert = Object.values(idToAnimal).map((animal: any) => {
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

async function upsertPetPosts(petIds: Array<ObjectId>) {
  let postsToUpsert: any = [];

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

function camelCaseToSentenceCase(str: string) {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, function (str) {
      return str.toUpperCase();
    })
    .trim();
}

export default petController;
