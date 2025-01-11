const authModel = require('../models/authModel');
const jwt = require('jsonwebtoken');

const authController = {
  async login(req, res){
      try {
        const users = await authModel.login(req.body);
        return res.status(200).json(users);
      } catch (err) {
        return res.status(404).json({ error: err});
      }
  },

  async token(req, res){
      try {
        let token = req.body.refresh_token;
        if(token == null) return res.status(400).json({'msg':'Token Field is Missing'});
        jwt.verify(token , process.env.JWT_REVERSE_TOKEN_SECRET, (err, decode)=>{
          if(err) throw new Error('Refresh Token Expired.');
          let x = {
            user_type: decode.user_type,
            user_name: decode.user_name,
            user_login_id: decode.user_login_id,
            m_user_type_id: decode.m_user_type_id
          }
          let access_token = jwt.sign(x, process.env.JWT_TOKEN_SECRET, {expiresIn:'1h'});
          return  res.status(200).json({access_token});
        });
      } catch (err) {
        return res.status(403).json({'msg':err.message});
      }
  },

}

module.exports = authController;
