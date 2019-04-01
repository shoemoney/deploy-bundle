"use strict";

const express = require("express");
const cors = require("cors");
const { port, host, corsConfig } = require("./config");

let count = 0;

// Set up express
const app = express();

app.use(express.json());

// CORS

app.use(cors(corsConfig));

// GET paths
app.get("/", (req, res) => {
  res.send(`I have been visited ${++count} times!`);
});

// Todo import models?
require("./routes/v1")(app);

// TODO: TO BE REMOVED
app.use("/dev", require("./routes/dev"));

// Start server

app.listen(port, host, () => process.stdout.write(`Server started @ http://${host}:${port}/`));
