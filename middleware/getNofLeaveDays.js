const db = require("../config/db");
const moment = require("moment");

const getNofLeaveDays = async(req, res, next) =>{
    let {leave_id} = req.body;
    
    if(leave_id  == -1){

        let {start_date, end_date} = req.body;

        if(end_date == null){
            next();
        }
        else{
            let x = moment(start_date).format("YYYY-MM-DD");
            let y = moment(end_date).format("YYYY-MM-DD");
            
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
    }
    else{
        next();
    }
}

module.exports = getNofLeaveDays;