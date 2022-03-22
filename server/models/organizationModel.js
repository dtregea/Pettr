const mongoose = require("mongoose");

const organizationSchema = mongoose.Schema({
  apiId: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  email: String,
  phone: String,
  address1: String,
  address2: String,
  city: String,
  state: String,
  zip: Number,
  country: String,
  url: String,
  website: String,
  adoptionPolicy: String,
  adoptionUrl: String,
  photos: Array,
});

module.exports = mongoose.model("Organization", organizationSchema);
