"use strict";

const { NODE_ENV, IS_PROD } = process.env;
let isProd = false;

if (NODE_ENV === "prod" || IS_PROD === "yes")
  isProd = true;

module.exports = {
  host      : process.env.HOST || "localhost",
  port      : process.env.PORT || 51515,
  corsConfig: {
    origin: isProd ? /devhangout\.space$/u : /.*/u,
  },
};
