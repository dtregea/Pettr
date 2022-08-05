const mongoose = require("mongoose");

const petSchema = mongoose.Schema(
  {
    apiId: {
      type: Number,
      required: true,
      unique: true,
    },
    org: {
      type: mongoose.Types.ObjectId,
      ref: "Organization",
    },
    apiOrgId: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    species: String,
    breeds: {
      primary: String,
      secondary: String,
      mixed: Boolean,
      unknown: Boolean
    },
    size: String,
    gender: String,
    age: String,
    colors: {
      primary: String,
      secondary: String,
      tertiary: String
    },
    coat: String,
    status: String,
    contact: {
      email: String,
      phone: String,
      address: {
        address1: String,
        address2: String,
        city: String,
        state: String,
        postcode: String,
        country: String
      }
    },
    attributes: {
      spayed_neutered: Boolean,
      house_trained: Boolean,
      declawed: Boolean,
      special_needs: Boolean,
      shots_current: Boolean
    },
    environment: {
      children: Boolean,
      dogs: Boolean,
      cats: Boolean
    },
    images: {
      type: [String],
      maxlength: 4,
      default: undefined,
    },
    videos: Array,
    tags: Array,
    published_at: Date,
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("Pet", petSchema);
