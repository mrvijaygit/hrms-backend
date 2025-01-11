const mysql = require("mysql2");

const pool = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"hrms"
});

module.exports = pool.promise();