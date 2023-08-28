const express = require("express");
const mongoose = require("mongoose");
const _ = require("dotenv");
require("dotenv").config();

var cors = require("cors");
const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

const URL = process.env.mongo_URL;
console.log(URL);

mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to mongo succesfully");
  })
  .catch((e) => console.log(e));

// app.use("/api/auth", require("./routes/auth"));

app.listen(port, () => {
  console.log(`BarberConnect is listening on port ${port}`);
});
