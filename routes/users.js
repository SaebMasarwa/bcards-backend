const express = require("express");
const Joi = require("joi");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middlewares/auth");

const router = express.Router();

const registerSchema = Joi.object({
  name: Joi.object({
    first: Joi.string().required(),
    middle: Joi.string().allow(null, ""),
    last: Joi.string().required(),
  }),
  isBusiness: Joi.boolean(),
  phone: Joi.string().required(),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8),
  address: Joi.object({
    state: Joi.string().allow(null, ""),
    country: Joi.string().required(),
    city: Joi.string().required(),
    street: Joi.string().required(),
    houseNumber: Joi.string().required(),
  }),
  image: Joi.object({
    url: Joi.string().uri().allow(null, ""),
    alt: Joi.string().allow(null, ""),
  }),
});

// Register
router.post("/", async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already exists");

    user = new User(req.body);
    const salt = await bcryptjs.genSalt(14);
    user.password = await bcryptjs.hash(user.password, salt);
    await user.save();

    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Login schema for body validation
const loginSchema = Joi.object({
  email: Joi.string().required().email().min(2),
  password: Joi.string().required().min(8),
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Email or password are incorrect");

    const result = await bcryptjs.compare(req.body.password, user.password);
    if (!result) return res.status(400).send("Email or password are incorrect");

    const token = jwt.sign(
      { _id: user._id, isAdmin: user.isAdmin, isBusiness: user.isBusiness },
      process.env.JWTKEY
    );
    res.status(200).send(token);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.payload._id);
    if (user.isAdmin === false) {
      return res.status(404).send("User has no admin access");
    } else {
      const allUsers = await User.find();
    }
    res.status(200).send(allUsers);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    if (req.payload._id === req.params.id || req.payload.isAdmin === true) {
      const user = await User.findById(req.payload._id);
      if (!user) return res.status(404).send("No such user");
    }
    const userResult = await User.findById(
      { _id: req.params.id },
      { password: 0 }
    );
    res.status(200).send(userResult);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.payload._id);
    if (!user) return res.status(404).send("No such user");
    const userResult = await User.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).send(userResult);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    if (req.payload._id === req.params.id) {
      const user = await User.findById(req.payload._id);
      if (!user) return res.status(404).send("No such user");
      if (user.isBusiness === true) {
        const userResult = await User.findByIdAndUpdate(req.params.id, {
          isBusiness: false,
        });
      } else {
        const userResult = await User.findByIdAndUpdate(req.params.id, {
          isBusiness: true,
        });
      }
    }
    const userResult = await User.findById(req.params.id);
    res.status(200).send(userResult);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.payload._id === req.params.id || req.payload.isAdmin === true) {
      const user = await User.findByIdAndDelete(
        { _id: req.params.id },
        { password: 0 }
      );
      if (!user) return res.status(404).send("No such user");
      res.status(200).send(user);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
