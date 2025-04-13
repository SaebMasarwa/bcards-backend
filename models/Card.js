const { Schema, model } = require("mongoose");
const { mongoose } = require("mongoose");

const cardSchema = new Schema({
  title: String,
  subtitle: String,
  description: String,
  phone: String,
  email: String,
  web: String,
  image: {
    url: {
      type: String,
      default:
        "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
    },
    alt: { type: String, default: "Business Card Imag" },
    _id: { type: String, default: new mongoose.Types.ObjectId() },
  },
  address: {
    state: String,
    country: String,
    city: String,
    street: String,
    houseNumber: Number,
    zip: Number,
    _id: { type: String, default: new mongoose.Types.ObjectId() },
  },
  bizNumber: Number,
  likes: [String],
  user_id: { type: String, default: new mongoose.Types.ObjectId() },
  createdAt: { type: Date, default: Date.now() },
});

const Card = model("cards", cardSchema);
module.exports = Card;
