const db = require('../config/db');

const payrollModel = {
    async payrollList(pagesize, offset, orderBY, where){
        let limit = `LIMIT ${pagesize} OFFSET ${offset}`;

        let joins = `INNER JOIN user_login ul ON ul.user_login_id = pr.user_login_id AND ul.is_deleted = 0`;
       
        let [count] = await db.execute(`SELECT COUNT(*) AS counts FROM payroll pr ${joins} WHERE pr.is_deleted = 0 ${where}`);
       
        let sql = `SELECT ROW_NUMBER() OVER(${orderBY}) AS s_no, pr.payroll_id, 
        pr.user_login_id, DATE_FORMAT(pr.payroll_month, "%b-%Y") AS payroll_month, pr.basic_salary, ul.user_name,
        (pr.house_rent_allowance + pr.house_rent_allowance + pr.medical_allowance + pr.transport_allowance + pr.other_allowance) AS allowances, 
        pr.gross_salary, pr.tax, pr.other_deduction, pr.net_salary
        FROM payroll pr ${joins} WHERE pr.is_deleted = 0 ${where} ${limit}`;
     
        let [rows] = await db.execute(sql);

        return {data:rows, totalRecord:count[0]['counts']};
    },
    async viewPayroll(params){

        let [rows] = await db.execute(`SELECT  pr.payroll_id, 
        pr.user_login_id, DATE_FORMAT(pr.payroll_month, "%d-%b-%Y") AS payroll_month, 
        pr.basic_salary, ul.user_name, pr.house_rent_allowance, pr.house_rent_allowance , pr.medical_allowance, pr.transport_allowance , pr.other_allowance,
        pr.gross_salary, pr.tax, pr.other_deduction, pr.net_salary
        FROM payroll pr INNER JOIN user_login ul ON ul.user_login_id = pr.user_login_id AND ul.is_deleted = 0 
        WHERE pr.is_deleted = 0 AND pr.payroll_id = ?`, [params.payroll_id]);

        return rows;
    },

    async payslip(params){

        let [rows] = await db.execute(`SELECT ul.user_name, e.emp_code, mdn.designation_name, md.department_name, 
        e.pan_card_no, mb.bank_name,eb.account_number, eb.ifsc_code, 
        DATE_FORMAT(LAST_DAY(py.payroll_month), '%M %Y') AS payroll_month, 
        DATE_FORMAT(LAST_DAY(py.payroll_month), '%d') AS monthly_working_days,
        COUNT(CASE WHEN a.m_attendance_status_id = 2 THEN a.attendance_id END) AS absent_days,
        py.basic_salary, py.house_rent_allowance, py.medical_allowance, py.transport_allowance, py.other_allowance, py.gross_salary, py.tax,
        py.other_deduction, py.net_salary, (SELECT JSON_OBJECT('company_name', c.company_name, 'address', c.address, 'domain', c.domain, 'cin_no', c.cin_no) 
        FROM company c WHERE company_id = 1 ) AS company_details FROM payroll py
        INNER JOIN user_login ul ON ul.user_login_id = py.user_login_id AND py.is_deleted = 0
        INNER JOIN employees e ON e.user_login_id = py.user_login_id AND e.is_deleted = 0
        INNER JOIN m_departments md ON md.m_department_id = e.m_department_id AND md.is_deleted = 0
        INNER JOIN m_designation mdn ON mdn.m_designation_id = e.m_designation_id AND mdn.is_deleted = 0
        INNER JOIN employee_bank eb ON eb.user_login_id = py.user_login_id AND eb.is_deleted = 0
        INNER JOIN m_bank mb ON mb.m_bank_id = eb.m_bank_id AND md.is_deleted = 0
        INNER JOIN attendance a ON a.user_login_id = py.user_login_id AND a.is_deleted = 0 
        AND DATE_FORMAT(a.attendance_date, '%M-%Y') = DATE_FORMAT(py.payroll_month, '%M-%Y')
        WHERE py.is_deleted = 0 AND py.payroll_id = ?`, [params.payroll_id]);

        return rows;
    },

}

module.exports = payrollModel;