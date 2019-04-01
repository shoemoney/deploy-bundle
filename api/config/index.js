"use strict";

const { NODE_ENV, IS_PROD } = process.env;
let isProd = false;

if (NODE_ENV === "prod" || IS_PROD === "yes")
  isProd = true;

module.exports = {
  port      : process.env.PROD_PORT || 51515,
  host      : process.env.HOST || "localhost",
  corsConfig: {
    origin: isProd ? /devhangout\.space$/u : /.*/u,
  },
};
