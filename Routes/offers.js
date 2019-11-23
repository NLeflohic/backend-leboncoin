const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary");

const Offers = require("../Models/Offers");
const User = require("../Models/User");

const getSort = (query) => {
  if (query === "date-asc") {
    return { date: 1 };
  } else if (query === "date-desc") {
    return { date: -1 };
  } else if (query === "price-asc") {
    return { price: 1 };
  } else if (query === "price-desc") {
    return { price: -1 };
  };
}

router.get("/offers", async (req, res) => {
  try {
    let offers = Offers.find();
    if (offers) {
      if (req.query.sort !== undefined) {
        sort = getSort(req.query.sort);
        offers = offers.sort(sort);
      };

      if (req.query.priceMin && (req.query.priceMin > 0)) {
        const priceMin = Number(req.query.priceMin);
        offers = offers.find({ price: { $gte: priceMin } })
      }
      if (req.query.priceMax && (req.query.priceMax > 0)) {
        const priceMax = Number(req.query.priceMax);
        offers = offers.find({ price: { $lte: priceMax } })
      }
      if (req.query.title !== undefined) {
        const regExp = new RegExp(req.query.title, "i");
        offers = offers.find({ "title": regExp });
      }

      const skip = req.query.skip;
      const limit = req.query.limit;
      offers = offers.skip(parseInt(skip)).limit(parseInt(limit));
      const result = await offers.find();
      const count = result.length;

      return res.json({ count: count, result });
    } else {
      return res.json("Offers not found");
    }
  } catch (error) {
    return res.json("error : " + error.message)
  }
})

router.post("/offer/publish", async (req, res) => {
  const { title, description, price, token } = req.fields;
  const currDate = new Date().toJSON();

  const tabPictures = [];
  console.log(req.fields);
  const filesKey = Object.keys(req.files);
  let fileUploaded = "";

  let vendor = {};
  let userName = "";
  let userId = "";

  try {
    vendor = await User.find({ token: token });
    if (!vendor) {
      return res.status(400).json("User not found");
    } else {
      console.log(vendor);
      userName = vendor[0].account.username;
      userId = vendor[0]._id;
    }

  } catch (error) {
    return res.status(400).json(error.message);
  }

  filesKey.forEach(async element => {
    const file = req.files[element];
    cloudinary.v2.uploader.upload(
      file.path,
      async (error, result) => {

        if (error) {
          return { error: "Upload error" };
        } else {
          try {
            const reslt = await result.secure_url;
            tabPictures.push(reslt);
            if (tabPictures.length === filesKey.length) {
              // console.log(user);
              console.log("res : " + userName + userId);
              const offer = new Offers({
                title: title,
                description: description,
                pictures: tabPictures,
                price: price,
                creator: {
                  _id: userId,
                  created: currDate,
                  account: {
                    username: userName
                  }
                }
              });

              console.log(offer);
              await offer.save();
              res.json("Offer saved");
            }
          } catch (error) {
            res.status(400).json(error.message)
          }
        }
      }
    )
  });
})


module.exports = router;