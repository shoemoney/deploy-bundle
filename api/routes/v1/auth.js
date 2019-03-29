"use strict";

const expRtr = require("express-promise-router")();
const {
  NotSupp,
} = require("../../controllers/shared/");
const {
  rootPost,
} = require("../../controllers/v1/auth");

expRtr.route("/")
  .get(NotSupp)
  .post(rootPost.func)
  .put(NotSupp);

module.exports = expRtr;
