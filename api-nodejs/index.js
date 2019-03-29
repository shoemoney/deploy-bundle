"use strict";

const express = require("express");
const cors = require("cors");
const { host, port, corsConfig } = require("./config/server");

// Set up express
const app = express();

app.use(express.json());

// CORS
app.use(cors(corsConfig));

// GET paths
app.get("/", (req, res) => {
  let count = 0;

  res.send(`I have been visited ${++count} times!`);
});

// Todo import models?
require("./routes/v1")(app);
require("./routes/dev")(app);

// Start server
app.listen(port, host, () => process.stdout.write(`Server started @ http://${host}:${port}/`));
