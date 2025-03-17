const { Schema, model } = require("mongoose");

const cardSchema = new Schema({
  title: String,
  subtitle: String,
  description: String,
  phone: String,
  email: String,
  web: String,
  image: {
    url: String,
    alt: String,
  },
  address: {
    state: String,
    country: String,
    city: String,
    street: String,
    houseNumber: Number,
    zip: Number,
  },
  bizNumber: Number,
  likes: [String],
});

const Card = model("cards", cardSchema);
module.exports = Card;
