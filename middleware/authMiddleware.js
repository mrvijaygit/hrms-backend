const jwt = require('jsonwebtoken');

const authMiddleware = async(req, res, next) =>{
    let authorization = req.headers['authorization'];

    if(authorization && authorization != null){
        let token = authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, decode)=>{
            if(err) return res.status(403).json({'msg':'Token Expired'});
            req.body.userDetails = decode;
            next();
        });
    }
    else{
       return res.status(401).json({'msg':'Access Denied'});
    }
   
}

module.exports = authMiddleware;