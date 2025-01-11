const db = require('../config/db');

const masterModel = {
    async gender(){
       let [rows] = await db.execute("SELECT CAST(mg.m_gender_id AS CHAR) AS `value`, mg.gender_name AS label FROM m_gender mg WHERE mg.is_deleted = 0");
       return rows;
    },
    async bloodGroup(){
       let [rows] = await db.execute("SELECT CAST(mbg.m_blood_group_id AS CHAR) AS 'value', mbg.blood_group AS label FROM m_blood_group mbg WHERE mbg.is_deleted = 0");
       return rows;
    },
    async userType(m_user_type_id){
       where = `AND mut.m_user_type_id  NOT IN (1000, ${m_user_type_id})`;
       let [rows] = await db.execute(`SELECT CAST(mut.m_user_type_id AS CHAR) AS 'value', mut.user_type AS label FROM m_user_type mut WHERE mut.is_deleted = 0 ${where}`);
       return rows;
    },
    async department(){
       let [rows] = await db.execute("SELECT CAST(md.m_department_id AS CHAR) AS 'value', md.department_name AS label FROM m_departments md WHERE md.is_deleted = 0");
       return rows;
    },
    async designation(m_department_id){
       let [rows] = await db.execute("SELECT CAST(mdn.m_designation_id AS CHAR) AS 'value', mdn.designation_name AS label FROM m_designation mdn WHERE mdn.is_deleted = 0 AND mdn.m_department_id = ?",[m_department_id]);
       return rows;
    },
    async employeeStatus(){
       let [rows] = await db.execute("SELECT CAST(mes.m_employee_status_id AS CHAR) AS 'value', mes.employee_status AS label FROM m_employee_status mes WHERE mes.is_deleted = 0");
       return rows;
    },
    async banks(){
       let [rows] = await db.execute("SELECT CAST(mb.m_bank_id AS CHAR) AS 'value', mb.bank_name AS label FROM m_bank mb WHERE mb.is_deleted = 0 ORDER BY mb.bank_name ASC");
       return rows;
    },
    async bankAccountType(){
       const rows = [
            {'value':'1', 'label':'Checking'},
            {'value':'2', 'label':'Current'},
            {'value':'3', 'label':'Salary Account'},
            {'value':'4', 'label':'Savings'}
       ];
       return rows;
    },
    async documentNames(){
       const rows = [
            {'value':'1', 'label':'Aadhaar Card'},
            {'value':'2', 'label':'Pan Card'},
            {'value':'3', 'label':'Passport'}
       ];
       return rows;
    },
    async attendanceStatus(){
        let [rows] = await db.execute("SELECT CAST(mas.m_attendance_status_id AS CHAR) AS 'value', mas.attendance_status AS label FROM m_attendance_status mas WHERE mas.is_deleted = 0");
        return rows;
    },
    async leaveStatus(){
        let [rows] = await db.execute("SELECT CAST(mls.m_leave_status_id AS CHAR) AS 'value', mls.leave_status AS label FROM m_leave_status mls WHERE mls.is_deleted = 0");
        return rows;
    },
    async leaveType(){
        let [rows] = await db.execute("SELECT CAST(mlt.m_leave_type_id AS CHAR) AS 'value', mlt.leave_type AS label FROM m_leave_type mlt WHERE mlt.is_deleted = 0");
        return rows;
    },
    async clients(){
        let [rows] = await db.execute("SELECT CAST(c.client_id AS CHAR) AS 'value' , c.client_name AS 'label' FROM clients c WHERE c.is_deleted = 0");
        return rows;
    },
    async projectStatus(){
        let [rows] = await db.execute("SELECT CAST(ps.project_status_id AS CHAR) AS 'value' , ps.project_status AS 'label' FROM project_status ps WHERE ps.is_deleted = 0");
        return rows;
    },
    async userList(params, m_user_type_id){
         let where = "";
         if(params.hasOwnProperty("m_user_type_id")){
            where += ` AND ul.m_user_type_id IN (${params.m_user_type_id}) `;
         }
         else{
            where += `AND ul.m_user_type_id  NOT IN (1000, ${m_user_type_id})`;
         }

         if(params.hasOwnProperty("reporting_id")){
            where += ` AND e.reporting_id IN (${params.reporting_id}) `;
         }

         let sql = `SELECT CAST(ul.user_login_id AS CHAR) AS 'value' , ul.user_name AS 'label' FROM user_login ul
         INNER JOIN employees e on e.user_login_id = ul.user_login_id AND e.is_deleted = 0 
         WHERE ul.is_deleted = 0  ${where} ORDER BY ul.user_name`;

        let [rows] = await db.execute(sql);
        return rows;
    },
}

module.exports = masterModel;