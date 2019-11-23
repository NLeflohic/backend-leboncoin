require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const formidableMiddleware = require("express-formidable");
const cors = require("cors");
const cloudinary = require("cloudinary");

const offersRoutes = require("./Routes/offers");
const userRoutes = require("./Routes/user");
const offerRoutes = require("./Routes/offer");

require("./Models/Offers");
require("./Models/User");

mongoose.connect(process.env.MONGOOSE_URI,
  { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(cors());
app.use(formidableMiddleware());
app.use(offersRoutes);
app.use(userRoutes);
app.use(offerRoutes);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
})

