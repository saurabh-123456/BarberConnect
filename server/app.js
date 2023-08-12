const express = require('express')
const _ = require("dotenv");
require('dotenv').config(); 

var cors = require("cors");
const app = express()
const port = 8000

app.use(express.json());
app.use(cors());

// app.use("/api/auth", require("./routes/auth"));

app.listen(port, () => {
  console.log(`BarberConnect is listening on port ${port}`)
})