"use strict";

const {
  PGUSER,
  PGPASSWORD,
  PGHOST,
  PGPORT,
  PGDATABASE,
  IS_PROD,
} = process.env;
const {
  Pool,
} = require("pg");

let pgConfig;

if (IS_PROD === false) {
  pgConfig = {
    user    : "postgres",
    host    : "localhost",
    database: "postgres",
    password: "postgres",
    port    : "5432",
  };
} else {
  pgConfig = {
    user    : PGUSER,
    host    : PGHOST,
    database: PGDATABASE,
    password: PGPASSWORD,
    port    : PGPORT,
  };
}

const PGPool = new Pool(pgConfig);

// FUNCTIONS
function cleanArray (arr) {
  return arr.filter(x => !isNaN(parseInt(x))).map(x => parseInt(x));
}

function makeWhere (vals = "", field = "provider_id") {
  const valArr = cleanArray(vals.split("-"));

  return vals ? `WHERE ${field} IN (${valArr})` : "";
}

function makeUpdates (updateObj = {}) {
  let retString = "";

  for (const key in updateObj) {
    if (Object.prototype.hasOwnProperty.call(updateObj, key)) {
      retString += `${key} = `;
      const parsed = parseInt(updateObj[key]);

      if (isNaN(parsed))
        retString += `'${updateObj[key]}'`;
      else
        retString += `${parsed}`;

      retString += ", ";
    }
  }

  return retString.slice(0, -2); //* Trim trailing ', '
}

function deleteToken (qryObj) {
  const { tkn = "" } = qryObj;
  const sql = {
    text  : "DELETE FROM USER_SESSIONS WHERE session_token = $1",
    values: [tkn],
  };

  return PGPool.query(sql);
}

function makePlaces (x) {
  let str = `\$${x}`;

  if (x > 1)
    str = makePlaces(x - 1).concat(", ", str);

  return str;
}

function makeMarkers (x) {
  const markerCols = Object.keys(x);

  return {
    markerCols,
    markerData  : Object.values(x),
    markerPlaces: makePlaces(markerCols.length),
  };
}

// EXPORTED FUNCTIONS
function query (sql) {
  return PGPool.query(sql);
}

function findToken (qryObj) {
  const cols = [ username, user_id, refresh_token, session_token, expires ];
  const { tkn = "", user = "" } = qryObj;
  const sql = {
    text  : `SELECT ${cols} FROM USERS LEFT JOIN USER_SESSIONS using(user_id) WHERE session_token = $1 OR username = $2`,
    values: [ tkn, user ],
  };

  return PGPool.query(sql);
}

function saveToken (qryObj) {
  // Todo
  const cols = [ username, user_id, refresh_token, session_token, expires ];
  const { tkn = "", user = "" } = qryObj;
  const sql = {
    text  : `SELECT ${cols} FROM USERS LEFT JOIN USER_SESSIONS using(user_id) WHERE session_token = $1 OR username = $2`,
    values: [ tkn, user ],
  };

  return PGPool.query(sql);
}

function refreshToken () {
  // Todo
  const cols = [ username, user_id, refresh_token, session_token, expires ];
  const { tkn = "", user = "" } = qryObj;
  const sql = {
    text  : `SELECT ${cols} FROM USERS LEFT JOIN USER_SESSIONS using(user_id) WHERE session_token = $1 OR username = $2`,
    values: [ tkn, user ],
  };

  return PGPool.query(sql);
}

function doSelect (qryObj) {
  const {
    tbl,
    cols,
    data,
  } = qryObj;
  const {
    markerCols,
    markerData,
    markerPlaces,
  } = makeMarkers(data);
  const sql = {
    text  : `SELECT ${cols} FROM ${tbl} WHERE ${markerCols} = ${markerPlaces}`,
    values: markerData,
  };

  return PGPool.query(sql);
}

function doUpdate (qryObj) {
  const {
    dataObj,
    tbl,
    inField,
    wVals,
  } = qryObj;
  const sql = `UPDATE ${tbl} SET ${makeUpdates(dataObj)} ${makeWhere(wVals, inField)}`;

  return PGPool.query(sql);
}

function doInsert (qryObj) {
  const {
    tbl,
    data,
  } = qryObj;
  const {
    markerCols,
    markerData,
    markerPlaces,
  } = makeMarkers(data);
  const sql = {
    text  : `INSERT INTO ${tbl} (${markerCols}) VALUES (${markerPlaces})`,
    values: markerData,
  };

  return PGPool.query(sql);
}

module.exports = {
  query,
  doSelect,
  doInsert,
  doUpdate,
  findToken,
  saveToken,
  refreshToken,
};
