"use strict";

const expRtr = require("express-promise-router")();
const {
  NotSupp,
} = require("../controllers/shared/");
const {
  rootGet,
  cmdPost,
} = require("../controllers/dev");

expRtr.route("/")
  .get(rootGet.func)
  .post(NotSupp)
  .put(NotSupp);

expRtr.route("/:cmd")
  .get(NotSupp)
  .post(cmdPost.validate, cmdPost.func)
  .put(NotSupp);

// EXPORT ROUTES
module.exports = expRtr;
