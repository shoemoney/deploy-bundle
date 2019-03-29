"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

let count = 0;
let isProd = false;

// Misc ENV vars
const { NODE_ENV, IS_PROD } = process.env;

if (NODE_ENV === "prod" || IS_PROD === "yes")
  isProd = true;

// Set up express
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS
const corsConfig = {
  origin: isProd ? /devhangout\.space$/u : /.*/u,
};

app.use(cors(corsConfig));

// GET paths
app.get("/", (req, res) => {
  res.send(`I have been visited ${++count} times!`);
});

// Todo import models?
const v1Routes = require("./routes/v1");

v1Routes(app);

// TODO: TO BE REMOVED
app.use("/dev", require("./routes/dev"));

// Start server
const port = process.env.PROD_PORT || 51515;

app.listen(port, () => process.stdout.write(`Server listening on port: ${port}`));
