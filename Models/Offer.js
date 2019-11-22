const mongoose = require("mongoose");

const Offer = mongoose.model("Offer", {
  email: String,
  username: String,
  token: String,
  salt: String,
  hash: String,
  account: {
    username: String
  }
});

module.exports = User;