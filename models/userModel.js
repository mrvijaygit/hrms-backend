
const db = require('../config/db');

const userModel = {

  async getUserList(pagesize, offset, orderBY, where) {

    let limit = `LIMIT ${pagesize} OFFSET ${offset}`;

    const [count] = await db.query(`SELECT count(e.employee_id) as counts FROM employees e 
    INNER JOIN user_login ul ON ul.user_login_id = e.user_login_id AND ul.is_deleted = 0
    INNER JOIN m_user_type mut ON mut.m_user_type_id = ul.m_user_type_id AND mut.is_deleted = 0
    LEFT JOIN m_departments md ON md.m_department_id = e.m_department_id AND md.is_deleted = 0
    LEFT JOIN m_designation mdn ON mdn.m_designation_id = e.m_designation_id AND mdn.is_deleted =0 
    WHERE e.is_deleted = 0 ${where}`);

    const [rows] = await db.query(`SELECT ROW_NUMBER() OVER(${orderBY}) AS s_no, e.employee_id, ul.user_login_id, ul.user_name, ul.email_id, mut.user_type,  
    e.phone_number, md.department_name, mdn.designation_name FROM employees e 
    INNER JOIN user_login ul ON ul.user_login_id = e.user_login_id AND ul.is_deleted = 0
    INNER JOIN m_user_type mut ON mut.m_user_type_id = ul.m_user_type_id AND mut.is_deleted = 0
    LEFT JOIN m_departments md ON md.m_department_id = e.m_department_id AND md.is_deleted = 0
    LEFT JOIN m_designation mdn ON mdn.m_designation_id = e.m_designation_id AND mdn.is_deleted =0 
    WHERE e.is_deleted = 0 ${where} ${limit}`);
    return {data:rows, totalRecord:count[0]['counts']};
  },

  async basic(user_login_id){

    let sql = `SELECT e.employee_id, e.emp_code, e.first_name, e.last_name, 
    ul.user_name, ul.email_id, ul.m_user_type_id, mut.user_type, e.m_gender_id, mg.gender_name,
    DATE_FORMAT(e.date_of_birth, "%d-%b-%Y") AS date_of_birth, e.m_blood_group_id, mbg.blood_group,
    e.phone_number, e.aadhaar_no, e.pan_card_no, e.m_department_id, md.department_name, e.m_designation_id, mdn.designation_name,
    e.m_employee_status_id, mes.employee_status, DATE_FORMAT(e.date_of_joining, "%d-%b-%Y") AS date_of_joining, e.reporting_id, 
    ul2.user_name AS reporting_user_name, e.permant_address, e.current_address  FROM employees e
    INNER JOIN user_login ul ON ul.user_login_id = e.user_login_id AND ul.is_deleted = 0
    INNER JOIN m_user_type mut ON mut.m_user_type_id = ul.m_user_type_id AND mut.is_deleted = 0
    LEFT JOIN m_gender mg ON mg.m_gender_id = e.m_gender_id AND mg.is_deleted = 0
    LEFT JOIN m_blood_group mbg ON mbg.m_blood_group_id = e.m_blood_group_id AND mbg.is_deleted = 0
    LEFT JOIN m_departments md ON md.m_department_id = e.m_department_id AND md.is_deleted = 0
    LEFT JOIN m_designation mdn ON mdn.m_designation_id = e.m_designation_id AND mdn.is_deleted = 0
    LEFT JOIN m_employee_status mes ON mes.m_employee_status_id = e.m_employee_status_id AND mes.is_deleted = 0
    LEFT JOIN user_login ul2 ON ul2.user_login_id = e.reporting_id AND ul2.is_deleted = 0
    WHERE e.is_deleted = 0 AND e.user_login_id = ${user_login_id}`;

    const [rows] = await db.query(sql);

    return rows;
  },

  async education(user_login_id){

    let sql = `SELECT ee.employee_education_id, ee.degree_name, ee.field_of_study, ee.institution_name,
    ee.institution_location, ee.graduation_year, ee.cgpa FROM employee_education ee 
    WHERE ee.is_deleted = 0 AND ee.user_login_id = ${user_login_id}`;

    const [rows] = await db.query(sql);

    return rows;
  },

  async experience(user_login_id) {
    const [rows] = await db.query(`SELECT ROW_NUMBER() OVER(ORDER BY ee.end_date DESC) AS s_no, ee.employee_experience_id,
    ee.previous_job_title,ee.previous_company_name,  ee.previous_job_location,
    DATE_FORMAT(ee.start_date, "%d-%b-%Y") AS start_date, DATE_FORMAT(ee.end_date, "%d-%b-%Y") AS end_date 
    FROM employee_experience ee 
    WHERE ee.is_deleted = 0 AND ee.user_login_id = ?`,[user_login_id]);
    return rows;
  },

  async bank(user_login_id){

    let sql = `SELECT eb.employee_bank_id, eb.m_bank_id, mb.bank_name, eb.branch_name, eb.account_holder_name, 
    eb.account_number, eb.account_type,  (CASE WHEN eb.account_type = 1 THEN 'Savings'
    WHEN eb.account_type = 2 THEN 'Checking'
    WHEN eb.account_type = 3 THEN 'Current'
    WHEN eb.account_type = 4 THEN 'Salary Account' END) AS account_type_display, eb.ifsc_code FROM employee_bank eb 
    LEFT JOIN m_bank mb ON mb.m_bank_id = eb.m_bank_id AND mb.is_deleted = 0
    WHERE eb.is_deleted = 0 AND eb.user_login_id = ${user_login_id}`;

    const [rows] = await db.query(sql);
  
    return rows;
  },

  async documents(user_login_id, employee_document_id = null) {
    let where = ''; 

    if(employee_document_id != null){
      where = ` AND ed.employee_document_id = ${employee_document_id}`;
    }

    const [rows] = await db.query(`SELECT ROW_NUMBER() OVER(ORDER BY ed.created_on DESC) AS s_no, ed.employee_document_id, ed.user_login_id, ed.document_id, ed.file_name 
    FROM employee_document ed  WHERE ed.is_deleted = 0 AND ed.user_login_id = ? ${where}`,[user_login_id]);
    return rows;
  },

  async salary(user_login_id) {
    const [rows] = await db.query(`SELECT es.employee_salary_id, es.basic_salary, es.house_rent_allowance, es.medical_allowance,
    es.transport_allowance, es.other_allowance, es.tax, es.other_deduction FROM  employee_salary es WHERE es.is_deleted = 0 AND es.user_login_id = ?`,[user_login_id]);
    return rows;
  },

}

// Export functions
module.exports = userModel;
