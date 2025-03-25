const express = require("express");
const Joi = require("joi");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Card = require("../models/Card");
const User = require("../models/User");
const auth = require("../middlewares/auth");

const router = express.Router();

const cardSchema = Joi.object({
  title: Joi.string().required(),
  subtitle: Joi.string().required(),
  description: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().required().email(),
  web: Joi.string().required().uri(),
  image: Joi.object({
    url: Joi.string().uri().allow(null, ""),
    alt: Joi.string().allow(null, ""),
  }),
  address: Joi.object({
    state: Joi.string().allow(null, ""),
    country: Joi.string().required(),
    city: Joi.string().required(),
    street: Joi.string().required(),
    houseNumber: Joi.number().required(),
    zip: Joi.number(),
  }),
});

// Get all cards without authorization restriction
router.get("/", async (req, res) => {
  try {
    const allCards = await Card.find();
    res.status(200).send(allCards);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get card of logged in user
router.get("/my-cards", auth, async (req, res) => {
  try {
    const user = await User.findById(req.payload._id);
    if (!user) return res.status(404).send("User not found, login please");
    console.log(user);

    const allCards = await Card.find({ user_id: req.payload._id });
    res.status(200).send(allCards);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get card by ID
router.get("/:id", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).send("Card not found, login please");
    res.status(200).send(card);
  } catch (error) {
    res.status(400).send(error);
  }
});

// New card for user with a business account
router.post("/", auth, async (req, res) => {
  try {
    const { error } = cardSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.payload._id);
    if (!user) return res.status(400).send("Can't find user");
    if (user.isBusiness === false) {
      return res
        .status(404)
        .send("Can't create card, user does not have a business account.");
    } else {
      let card = new Card(req.body);
      card.user_id = req.payload._id;
      await card.save();
      res.status(201).send(card);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { error } = cardSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const user = await User.findById(req.payload._id);
    if (!user) return res.status(404).send("No such user");

    const card = await Card.findById(req.params.id);
    if (!card) return res.status(400).send("Can't find business card");

    if (card.user_id === req.payload._id) {
      let card = new Card(req.body);
      await card.save();
      res.status(200).send(card);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

// Like status
router.patch("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.payload._id);
    if (!user) return res.status(404).send("No such user");

    const card = await Card.findById(req.params.id);
    if (!card) return res.status(400).send("Can't find business card");

    if (!card.likes.includes(req.payload._id)) {
      card.likes.push(req.payload._id);
      await card.save();
      res.status(200).send(card);
    } else {
      card.likes.pop(req.payload._id);
      await card.save();
      res.status(200).send(card);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
// Delete card by id for who created it and admins
router.delete("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.payload._id);
    if (!user) return res.status(404).send("No such user, not logged in");

    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).send("Can't find business card");
    } else {
      console.log(req.payload._id, card.user_id);

      if (req.payload._id === card.user_id || req.payload.isAdmin === true) {
        const card = await Card.findByIdAndDelete(req.params.id);
        if (!card) return res.status(404).send("No such card");
        res.status(200).send(card);
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
