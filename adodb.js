const db = require("./config/db");
const moment = require("moment");
const bcrypt = require("bcrypt");

const adodb = {
  getColumnNames(tableName) {
    return new Promise(async (resolve, reject) => {
      try {
        const [rows] = await db.query(`DESCRIBE ${tableName}`);
        const columnNames = rows.map((row) => row.Field);
        return resolve(columnNames);
      } catch (err) {
        return reject(err.message);
      }
    });
  },

  checkRecord(table_name, primary_key, id) {
    return new Promise(async (resolve, reject) => {
      try {
        let [rows] = await db.query(
          `SELECT * FROM ${table_name} WHERE ${primary_key} = '${id}' LIMIT 1`
        );
        return resolve(rows.length);        
      } catch (err) {
        return reject(err.message);
      }
    });
  },

  async insertSql(table_name, data) {
    try {
      let columnHolder = [], valueHolder = [];
      const columns = await this.getColumnNames(table_name);
    
      // check columnswith request data
      for (let key in data) {
        let value = data[key];
        if (columns.includes(key)) {
          columnHolder.push(key);

          if (typeof value === 'string') {
            valueHolder.push(`${value.replace(/'/g, "\\'")}`);
          } else {
            valueHolder.push(value);
          }
        }
      }
     
      let sql = `INSERT INTO ${table_name} (${columnHolder.join(', ')}) VALUES (${valueHolder.map(val => '?').join(', ')});`;
      return {sql, valueHolder};

    } catch (err) {
      return err;
    }
  },

  async updateSql(table_name, primary_key, data) {
    
    try {
      let columnHolder = [], valueHolder = [];
      const columns = await this.getColumnNames(table_name);
      
      // check columnswith request data
      for (let key in data) {
        let value = data[key];
        if (columns.includes(key)) { 
          columnHolder.push(` ${key} = ? `);
          if (typeof value === 'string') {
            valueHolder.push(`${value.replace(/'/g, "\\'")}`);
          } else {
            valueHolder.push(value);
          }
        }
      }
      
      let sql = `UPDATE ${table_name} SET ${columnHolder.map(val => val).join(",")} WHERE ${primary_key} = ${data[primary_key]}`;
      return {sql, valueHolder};

    } catch (err) {
      return err;
    }
  },

  saveData(table_name, primary_key, data) {
    return new Promise(async (resolve, reject) =>{

    let query = {};
    try {
      let current_date_time = moment().format("YYYY-MM-DD hh:mm:ss");
     
      let id = data.hasOwnProperty(primary_key) ? data[primary_key] : -1;
      
      let is_record = await this.checkRecord(table_name, primary_key, id);

      if (is_record > 0) {
        // Update query
        data["updated_on"] = current_date_time;
        data["updated_by"] = data.userDetails.user_login_id;
        query = await this.updateSql(table_name, primary_key ,data);
       
      } else {
        //  Insert query
       delete data[primary_key];
       data['created_by'] = data.userDetails.user_login_id;
       query = await this.insertSql(table_name, data);
      }
      
      if(query.hasOwnProperty('sql')){
        const [result] = await db.query(query.sql, query.valueHolder);
       
        let id =  is_record > 0 ? data[primary_key] : result['insertId'];
        return resolve(id);
      }
      else{
        throw new Error('Data Failed to Fetch');
      }

    } catch (err) {
        return reject(err.message);
    }

  });

  },
};

module.exports = adodb;
