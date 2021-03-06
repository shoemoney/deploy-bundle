"use strict";

const {
  check,
  param,
  validationResult,
} = require("express-validator/check");
const Argon2 = require("argon2");
const ghCrypto = require("../../core/crypto");
const DB = require("../../core/db");
const { minPWLength } = require("../../core/config");

const cols = [
  "user_id", "full_name", "member_of", "email",

  // 'password'
];
const tbl = "USERS";

// Todo verify everything works

const rootGet = {};
const useridGet = {};
const useridPut = {};
const orgidGet = {};
const orgidPost = {};
const orgidPut = {};

rootGet.func = async (req, res) => {
  const {
    rows,
  } = await DB.query(`SELECT ${cols} FROM ${tbl}`);

  res.status(200).json({
    data: rows,
  });
};

useridGet.validate = [param("userid").isInt()];

useridGet.func = async (req, res) => {
  // Todo
  const {
    userid,
  } = req.params;
  const sql = {
    cols,
    tbl,
    data: {
      user_id: userid,
    },
  };

  process.stdout.write(sql);
  const {
    rows,
  } = await DB.doSelect(sql);

  res.status(200).json({
    data: rows,
  });
};

useridPut.validate = [param("userid").isInt()];

useridPut.func = async (req, res) => {
  // Todo
  res.status(403).send("Under Construction");
};

orgidGet.validate = [param("orgid").isInt()];

orgidGet.func = async (req, res) => {
  // Todo confirm done
  const {
    orgid,
    userid,
  } = req.params;
  const sql = {
    cols,
    tbl,
    data: {
      member_of: orgid,
    },
  };

  process.stdout.write(sql);
  const {
    rows,
  } = await DB.doSelect(sql);

  res.status(200).json({
    data: rows,
  });
};

orgidPost.validate = [
  param("orgid").isInt(), // .toInt(),
  check("username").isLength({
    min: 3,
  })
    .trim()
    .escape(),
  check("password").isLength({
    min: minPWLength,
  })
    .trim()
    .escape(),
  check("cpassword").custom((val, {
    req,
  }) => {
    if (val === req.body.password)
      return true;
    throw new Error("Password fields do not match");

  })
    .escape(),
  check("full_name").isLength({
    min: 4,
  })
    .trim()
    .escape(),
  check("email").isEmail()
    .normalizeEmail(),
];

orgidPost.argon = (req, res, next) => {
  req.body.password = ghCrypto.encryptPW(req.body.password);
  next();
};

orgidPost.func = async (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    process.stdout.write("pass");
    const {
      username,
      password,
      full_name,
      email,
    } = req.body;
    const sql = {
      tbl,
      data: {
        member_of: req.params.orgid,
        username,
        password,
        full_name,
        email,
      },
    };
    const {
      rows,
    } = await DB.doInsert(sql);

    res.status(200).json({
      rows,
    });

    // Res.status(200).json({ rows: 'hit' })
  } else {
    process.stdout.write("error");

    return res.status(422).json({
      errors: errors.array(),
    });
  }
};

orgidPut.validate = [param("userid").isInt()];

orgidPut.func = async (req, res) => {
  // Todo
  res.status(403).send("Under Construction");
};

// FUNCTIONS

// EXPORT ROUTES
module.exports = {
  rootGet,
  useridGet,
  useridPut,
  orgidGet,
  orgidPost,
  orgidPut,
};
