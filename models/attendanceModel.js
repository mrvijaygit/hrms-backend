const db = require('../config/db');

const attendanceModel = {
    async attendance(pagesize, offset, orderBY, where){
        let limit = `LIMIT ${pagesize} OFFSET ${offset}`;
     
        let [count] = await db.execute(`SELECT COUNT(att.attendance_id) AS counts FROM attendance att 
        INNER JOIN user_login ul ON ul.user_login_id = att.user_login_id AND ul.is_deleted = 0 
        WHERE att.is_deleted = 0 ${where}`);

        let sql = `SELECT ROW_NUMBER() OVER(${orderBY}) as s_no, att.attendance_id, att.user_login_id, ul.user_name, 
        DATE_FORMAT(att.punch_in, '%h:%i %p') AS punch_in, DATE_FORMAT(att.punch_out, '%h:%i %p') AS punch_out, 
        DATE_FORMAT(att.attendance_date, "%d-%b-%Y") AS attendance_date, DATE_FORMAT(TIMEDIFF(att.punch_out, att.punch_in), "%h:%i") AS working_hours,
        att.m_attendance_status_id , mas.attendance_status FROM attendance att
        INNER JOIN user_login ul ON ul.user_login_id = att.user_login_id AND ul.is_deleted = 0
        INNER JOIN m_attendance_status mas ON mas.m_attendance_status_id = att.m_attendance_status_id AND mas.is_deleted = 0
        WHERE att.is_deleted = 0 ${where}  ${limit}`;
   
        let [rows] = await db.execute(sql);
      
        return {data:rows, totalRecord:count[0]['counts']};
    },
    async viewAttendance(params){

        let [rows] = await db.execute(`SELECT att.attendance_id, att.user_login_id, 
        DATE_FORMAT(att.punch_in, '%h:%i') AS punch_in, 
        DATE_FORMAT(att.punch_out, '%h:%i') AS punch_out, 
        DATE_FORMAT(att.attendance_date, "%d-%b-%Y") AS attendance_date, 
        att.m_attendance_status_id FROM attendance att
        INNER JOIN user_login ul ON ul.user_login_id = att.user_login_id AND ul.is_deleted = 0
        WHERE att.is_deleted = 0 AND att.attendance_id = ?`, [params.attendance_id]);

        return rows;
    },
}

module.exports = attendanceModel;