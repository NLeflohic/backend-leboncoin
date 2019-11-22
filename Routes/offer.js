const express = require("express");
const router = express.Router();

const Offers = require("../Models/Offers");

router.get("/offer/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const offer = await Offers.findById(id);
  console.log(offer);

  if (offer) {
    return res.json(offer)
  } else {
    return res.status(400).json("error : " + error.message);
  }
});

module.exports = router;