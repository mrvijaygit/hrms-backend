const mysql = require("mysql2");

const pool = mysql.createPool({
    host:"147.93.96.119",
    user:"u343166541_HRMDB",
    password:"Zap@hrms_99",
    database:"u343166541_HRMDB"
});

module.exports = pool.promise();