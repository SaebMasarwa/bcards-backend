const express = require("express");
const Joi = require("joi");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Card = require("../models/Card");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const allCards = await Card.find();
    res.status(200).send(allCards);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
