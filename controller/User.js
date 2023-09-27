const userRouter = require("express").Router();
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { secretKey } = require("../utils/config");

// add a new user
userRouter.post("/", async (req, res) => {
  const saltRounds = 10;
  const { username, password } = req.body;
  bcrypt.hash(password, saltRounds, async function (err, hash) {
    // Store hash in your password DB.
    if (err) {
      res.status(400).send("Error encountered when adding new user");
    }
    const newUser = new User({
      username,
      hashedPassword: hash,
    });
    const newUserEntry = await newUser.save();
    return res.status(201).send(newUserEntry);
  });
});

userRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // find that user from the DB
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).send({ error: "Login unsuccessful" });
  }
  const match = await bcrypt.compare(password, user.hashedPassword);
  const modifiedUser = {
    username: user.username,
    hashedPassword: user.hashedPassword,
    id: user._id,
  };
  // if the match is successful, add a jwt to the local storage
  if (match) {
    const token = jwt.sign(modifiedUser, secretKey, { expiresIn: "48h" });
    res.status(200).send({ ok: true, token, username: user.username });
  } else {
    res.status(404).send({ error: "Login unsuccessful" });
  }
});

userRouter.post("/verify", async (req, res) => {
  const user = req.body;
  try {
    const result = jwt.verify(user.token, secretKey);
    return res.status(200).send({ ok: true, ...user });
  } catch (err) {
    return res.status(200).send({ error: "User not logged in" });
  }
});

module.exports = userRouter;
