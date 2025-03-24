const { Schema, model } = require("mongoose");
const { mongoose } = require("mongoose");

const userSchema = new Schema({
  name: {
    first: String,
    middle: String,
    last: String,
    _id: { type: String, default: new mongoose.Types.ObjectId() },
  },
  isBusiness: Boolean,
  isAdmin: { type: Boolean, default: false },
  phone: String,
  email: String,
  password: String,
  address: {
    state: String,
    country: String,
    city: String,
    street: String,
    houseNumber: Number,
    zip: { type: Number, default: 0 },
    _id: { type: String, default: new mongoose.Types.ObjectId() },
  },
  image: {
    url: {
      type: String,
      default:
        "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
    },
    alt: { type: String, default: "Business Card Image" },
    _id: { type: String, default: new mongoose.Types.ObjectId() },
  },
  createdAt: { type: Date, default: Date.now() },
});

const User = model("users", userSchema);
module.exports = User;
