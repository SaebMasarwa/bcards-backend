const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const users = require("./routes/users");
const cards = require("./routes/cards");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const fs = require("node:fs");
const path = require("node:path");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.DB)
  .then(() => console.log("MongoDB connected"))
  .then(() => {
    mySeeder();
  })
  .catch((error) => console.log(error));

// Seed data to database for initail users setup if none exists
async function mySeeder() {
  const data = await User.find({}).exec();
  const hashedPassword = await bcrypt.hash("1234567890", 14);
  if (data.length !== 0) {
    // Data exists, no need to seed.
    return;
  }
  const users = [
    {
      _id: new mongoose.Types.ObjectId(),
      name: {
        first: "First",
        middle: "",
        last: "User",
      },
      phone: "0501234567",
      email: "firstuser@gmail.com",
      password: hashedPassword,
      image: {
        url: "",
        alt: "",
      },
      address: {
        state: "Jerusalem",
        country: "Israel",
        city: "Jerusalem",
        street: "Ben Gurion",
        houseNumber: 5,
        zip: 8920435,
      },
      isBusiness: false,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: {
        first: "Business",
        middle: "",
        last: "User",
      },
      phone: "0501234567",
      email: "bizuser@gmail.com",
      password: hashedPassword,
      image: {
        url: "",
        alt: "",
      },
      address: {
        state: "Jerusalem",
        country: "Israel",
        city: "Jerusalem",
        street: "Ben Gurion",
        houseNumber: 5,
        zip: 8920435,
      },
      isBusiness: true,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: {
        first: "Admin",
        middle: "",
        last: "User",
      },
      phone: "0501234567",
      email: "adminuser@gmail.com",
      password: hashedPassword,
      image: {
        url: "",
        alt: "",
      },
      address: {
        state: "Jerusalem",
        country: "Israel",
        city: "Jerusalem",
        street: "Ben Gurion",
        houseNumber: 5,
        zip: 8920435,
      },
      isBusiness: true,
      isAdmin: true,
    },
  ];
  await User.create(users);
}
// Middleware to log requests to console
app.use(morgan(":date[web] - :method - :url - :status - :response-time ms"));
// morgan token for error logging message
morgan.token("error", function (req, res) {
  console.log(res.statusMessage);

  return res.statusMessage;
});

// Logging errors to file if status code is 400 or higher
app.use(
  morgan(":date[web] - :status - :error", {
    skip: function (req, res) {
      return res.statusCode < 400;
    },
    stream: fs.createWriteStream(
      path.join(
        __dirname,
        "logs/" +
          new Date().getFullYear() +
          "-" +
          new Date().getMonth() +
          "-" +
          new Date().getDate() +
          ".log"
      ),
      {
        flags: "a+",
      }
    ),
  })
);
app.use(cors());
app.use(express.json());
app.use("/users", users);
app.use("/cards", cards);

app.listen(port, () => console.log("Server started on port", port));
