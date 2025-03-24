const express = require("express");
const Joi = require("joi");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Card = require("../models/Card");
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
    houseNumber: Joi.string().required(),
    zip: Joi.string(),
  }),
});

router.get("/", async (req, res) => {
  try {
    const allCards = await Card.find();
    res.status(200).send(allCards);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/my-cards", auth, async (req, res) => {
  try {
    const user = await User.findById(req.payload._id);
    if (!user) return res.status(404).send("User not found, login please");
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
