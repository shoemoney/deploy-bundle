"use strict";

function makeTimestamp () {
  return Math.floor(Date.now() / 1000);
}

module.exports = { makeTimestamp };
