const express = require("express");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const User = require("../Models/User");

router.post("/user/sign_up", (req, res) => {
  console.log(req.fields);

  const { email, username, password } = req.fields;
  const token = uid2(16);
  const salt = uid2(2);
  const hash = SHA256(password + salt).toString(encBase64);
  const user = new User({
    email: email,
    token: token,
    salt: salt,
    hash: hash,
    account: {
      username: username,
    }
  });
  console.log(user);
  try {
    user.save();
    res.json({ username: user.account.username, email: user.email, token: user.token });
  } catch (error) {
    console.log(error.message)
    res.status(400).json("An error as occured");
  }

});

router.post("/user/log_in", (req, res) => {
  User.findOne({ email: req.fields.email }).exec((err, user) => {
    if (err) return next(err.message);
    if (user) {
      console.log(req.fields);
      if (SHA256(req.fields.password + user.salt).toString(encBase64) === user.hash) {
        return res.json({
          _id: user._id,
          token: user.token,
          account: user.account
        })
      } else {
        return res.status(400).json({ error: "unauthorized" });
      }
    } else {
      return next("User not found");
    }
  });
});

module.exports = router;
