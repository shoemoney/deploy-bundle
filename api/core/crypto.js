"use strict";

const Argon2 = require("argon2");
const Crypto = require("crypto");
const Passport = require("passport");
const BearerStrategy = require("passport-http-bearer").Strategy;
const DB = require("../core/db");

// INTERNAL VARS
// const table

// INTERAL FUNCTIONS
function cError (txt = "", err = null) {
  return new Error({
    msg: txt,
    err,
  });
}

Passport.use(new BearerStrategy(/* Todo */ (token, done) => {
  process.stdout.write("pp hit");
  User.findOne({ token }, (err, user) => {
    if (err)
      return done(err);
    if (!user)
      return done(null, false);

    return done(null, user, { scope: "all" });
  });
}));

function genCrypto ({ base = "base64", bytes = 32 } = {}) {
  Crypto.randomBytes(48).toString("hex");

  function generateToken ({ stringBase = "base64", byteLength = 48 } = {}) {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(byteLength, (err, buffer) => {
        if (err)
          reject(err);
        else
          resolve(buffer.toString(stringBase));

      });
    });
  }

}

function issueToken () {
  // Todo
  let ret;

  DB.saveToken();

  return ret;
}

// EXPORTED FUNCTIONS

async function verifyToken (tkn = "", uid = 0, uName = "") {
  const sql = {
    tkn,
  };

  const { rows } = await DB.findToken(sql);

  if (rows.length === 0) {
    throw new Error("Invalid Token");
  } else {
    for (const i in rows) {

    }
  }
}

async function encryptPW (rawpw = "") {

  return await Argon2.hash(rawpw);

  // .then(hash => {
  // process.stdout.write(hash)
  // req.body.password = hash
  // next()
  // })
  // .catch(err => process.stdout.write(err))

}

async function verifyLogin (against = "", toCheck = "") {
  if (!toCheck.length || !against.length) {
    throw cError("2 Arguments Required");
  } else {
    Argon2.verify(against, toCheck)
      .then((success) => {
        if (success) {
          const tkn = issueToken();

          return {
            msg: "Auth Sucessful",
            tkn,
          };
        }
        throw cError("Auth Failed");

      })
      .catch((err) => {
        throw cError("Auth Error", err);
      });
  }
}

module.exports = {
  verifyLogin,
  encryptPW,
};
