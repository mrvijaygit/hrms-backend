const db = require("../config/db");
const moment = require("moment");
const checkPayrollAlreadyExist = async(req, res, next) =>{
    let {user_login_id, payroll_date, payroll_id} = req.body;
    
    if(payroll_id  == -1){
        let x = moment(payroll_date).format("YYYY-MM-DD");
        let sql = `SELECT pr.payroll_id FROM payroll pr WHERE pr.is_deleted = 0 AND pr.user_login_id = ${user_login_id} 
        AND DATE_FORMAT(pr.payroll_month, "%m-%Y") = DATE_FORMAT(DATE('${x}'), '%m-%Y')`;
   
        let [rows] = await db.execute(sql);
    
        if(rows.length > 0){
            return res.status(400).json({'msg':'Employee data already exists for this month'});
        }
        else{
            next();
        }
    }
    else{
        next();
    }
}

module.exports = checkPayrollAlreadyExist;