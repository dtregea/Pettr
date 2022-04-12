const mongoose = require("mongoose");

const petSchema = mongoose.Schema({
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
  breed: String,
  size: String,
  gender: String,
  age: Number,
  color: String,
  coat: String,
  status: String,
  contactEmail: String,
  contactPhone: String,
  address1: String,
  city: String,
  state: String,
  zip: Number,
  country: String,
  attributes: Array,
  environment: Array,
  photos: [String],
  description: String,
  videos: Array,
  tags: Array,
});

module.exports = mongoose.model("Pet", petSchema);
