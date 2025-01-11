
const db = require('../config/db');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authModel = {
   login(params) {
    console.log(params);
    return new Promise(async (resolve, reject) =>{
        try{
            const {email_id, pass_word} = params;
            const [rows] = await db.execute(`SELECT ul.user_login_id, ul.user_name, ul.email_id, ul.pass_word as encrypt_pass_word,
                        ul.m_user_type_id, mut.user_type FROM user_login ul
                        INNER JOIN m_user_type mut ON mut.m_user_type_id = ul.m_user_type_id AND mut.is_deleted = 0
                        WHERE ul.is_deleted = 0 AND ul.email_id = ?`, [email_id]);

            console.log(rows)

            const {user_login_id, user_name, m_user_type_id, encrypt_pass_word, user_type} = rows[0];

            const is_password_valid = await bcrypt.compare(pass_word, encrypt_pass_word);
            
            console.log(is_password_valid)
            if(!is_password_valid){
                return reject('Password is incorrect');
            }

            let access_token  = jwt.sign({user_login_id, user_name, m_user_type_id, user_type}, process.env.JWT_TOKEN_SECRET, {'expiresIn':'1h'});
            let refresh_token  = jwt.sign({user_login_id, user_name, m_user_type_id, user_type}, process.env.JWT_REVERSE_TOKEN_SECRET, {'expiresIn':'2 days'});

            return resolve({access_token, refresh_token, msg:'Successfully Logged.'});
        }
        catch(err){
            return reject('User not found');
        }
    });
  
  },

}

module.exports = authModel;
