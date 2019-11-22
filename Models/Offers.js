const mongoose = require("mongoose");

const Offers = mongoose.model("Offers", {
  title: String,
  description: String,
  pictures: [String],
  price: Number,
  creator: {
    account: {
      username: String
    },
    _id: String,
    created: String
  }
});

module.exports = Offers;