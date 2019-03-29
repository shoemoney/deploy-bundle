"use strict";

const { check, validationResult } = require("express-validator/check");
const DB = require("../../core/db");

const { MUST_MATCH } = process.env;

const rootGet = {
  func: async (req, res) => {
    const { rows } = await DB.query("SELECT * FROM pg_catalog.pg_tables WHERE tablename NOT LIKE 'pg_%' AND tablename NOT LIKE 'sql_%'");

    res.status(200).json({ data: rows });
  },
};

const cmdPost = {};

cmdPost.validate = [
  check("mustMatch").custom((val) => {
    if (val === MUST_MATCH)
      return true;

    throw new Error("Invalid Token");

  })
    .escape(),
];

cmdPost.func = async (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const { sql, tables } = req.body;
    let queries = [];

    switch (req.params.cmd) {
      case "delete":
        queries = [];

        for (const one in tables) {
          if (Object.prototype.hasOwnProperty.call(tables, one))
            queries.push(DB.query(`DELETE FROM ${tables[one]}`));
        }
        await Promise.all(queries);
        queries = [];
        res.status(200).json({ data: "delete done" });
        break;
      case "drop":
        for (const one in tables) {
          if (Object.prototype.hasOwnProperty.call(tables, one))
            queries.push(DB.query(`DROP TABLE IF EXISTS ${tables[one]}`));
        }
        await Promise.all(queries);
        queries = [];
        res.status(200).json({ data: "drop done" });
        break;
      case "insert":
        for (const stmnt in sql) {
          if (Object.prototype.hasOwnProperty.call(sql, stmnt)) {
            process.stdout.write(stmnt);
            queries.push(DB.query(sql[stmnt]));
          }
        }
        await Promise.all(queries);
        res.status(200).json({ data: "insert done" });
        break;
      default:
        res.status(200).json({ data: "nothing done" });
    }
  } else {
    process.stdout.write("error");

    return res.status(422).json({ errors: errors.array() });
  }
};

module.exports = {
  rootGet,
  cmdPost,
};
