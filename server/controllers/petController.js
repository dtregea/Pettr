require("dotenv").config();

var petfinder = require("@petfinder/petfinder-js");

var pf = new petfinder.Client({
  apiKey: process.env.PF_KEY,
  secret: process.env.PF_SECRET,
});

const Pet = require("../models/petModel");
const constants = require("./mongoConstants");

const petController = {
  getPets: async (req, res) => {
    try {
      let page = req.query.page;
      let pets = await Pet.aggregate([
        { $sort: { createdAt: -1 } },
        constants.PAGINATE(page),
      ]);
      return res.status(200).json({
        status: "success",
        data: { animals: pets[0].data },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: error.toString() });
    }
  },
};

module.exports = petController;
