const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const users = require("./routes/users");
const cards = require("./routes/cards");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.DB)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));
app.use(morgan(":date[clf] - :method - :url - :status - :response-time ms"));
app.use(cors());
app.use(express.json());
app.use("/users", users);
app.use("/cards", cards);

app.listen(port, () => console.log("Server started on port", port));
