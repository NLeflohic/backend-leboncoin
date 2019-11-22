const mongoose = require("mongoose");

const User = mongoose.model("Users", {
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