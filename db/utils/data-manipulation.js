const db = require("../connection");
const fsPromise = require("fs").promises;

exports.formatData = (data, keys) => {
  const formattedData = data.map((item) => {
    const x = [];
    keys.forEach((key) => {
      x.push(item[key]);
    });
    return x;
  });
  return formattedData;
};

exports.addKeys = (objArr, key, keyValues) => {
  for (let i = 0; i < objArr.length; i++) {
    objArr[i][key] = keyValues[i][key] - 1;
  }
  return objArr;
};

exports.checkExists = async (table, column, item) => {
  const query = await db.query(
    `SELECT * FROM ${table} WHERE ${column} = '${item}'`
  );
  if (query.rows.length === 0) {
    return false;
  } else {
    return true;
  }
};

exports.readFile = (path) => {
  return fsPromise
    .readFile(path, "utf-8")
    .then((response) => {
      console.log(response)
      return response.split("\n");
    })
  }