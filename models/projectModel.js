const db = require('../config/db');

const projectModel = {
    async clients(pagesize, offset, orderBY){
        let limit = `LIMIT ${pagesize} OFFSET ${offset}`;

        let [count] = await db.execute(`SELECT COUNT(c.client_id) AS counts FROM clients c WHERE c.is_deleted = 0`);
        let [rows] = await db.execute(`SELECT ROW_NUMBER() OVER(${orderBY}) as s_no, c.client_id, c.client_name,
             c.contact_person_name, c.contact_no, c.email_id FROM clients c WHERE c.is_deleted = 0 ${limit}`);
  
        return {data:rows, totalRecord:count[0]['counts']};
    },
    async viewClient(params){

        let [rows] = await db.execute(`SELECT c.client_id, c.client_name, c.contact_person_name, c.contact_no,
             c.email_id FROM clients c WHERE c.is_deleted = 0 AND c.client_id = ?`, [params.client_id]);

        return rows;
    },
    async projects(pagesize, offset, orderBY, where){
        let limit = `LIMIT ${pagesize} OFFSET ${offset}`;

        let joins = ` INNER JOIN clients c ON c.client_id = pt.client_id AND c.is_deleted = 0
        INNER JOIN user_login ul ON ul.user_login_id = pt.project_manager_id AND ul.is_deleted = 0
        LEFT JOIN project_status ps ON ps.project_status_id = pt.project_status_id AND ps.is_deleted = 0 
        LEFT JOIN project_members pm ON pm.project_id = pt.project_id AND pm.is_deleted = 0 `;

        let [count] = await db.execute(`SELECT COUNT(pt.project_id) AS counts FROM projects pt ${joins} WHERE pt.is_deleted = 0 ${where} GROUP BY pt.project_id`);
        let sql = `SELECT ROW_NUMBER() OVER(${orderBY}) as s_no, pt.project_id, pt.project_name, pt.project_description, c.client_name, ul.user_name AS project_manager,
        DATE_FORMAT(pt.start_date, "%d-%b-%Y") AS start_date, DATE_FORMAT(pt.deadline, "%d-%b-%Y") AS deadline, 
        pt.project_value, pt.project_status_id, ps.project_status, ps.status_color
        FROM projects pt ${joins} WHERE pt.is_deleted = 0 ${where} GROUP BY pt.project_id ${limit}`;
       
        let [rows] = await db.execute(sql);
  
        return {data:rows, totalRecord:count[0]['counts']};
    },
    async viewProject(params){

        let [rows] = await db.execute(`SELECT  pt.project_id, pt.project_name, pt.project_description, CAST(pt.client_id AS CHAR) AS client_id  , 
        CAST(pt.project_manager_id AS CHAR) as project_manager_id, c.client_name, ul.user_name as project_manager,
        DATE_FORMAT(pt.start_date, "%d-%b-%Y") AS start_date, DATE_FORMAT(pt.deadline, "%d-%b-%Y") AS deadline,
        pt.project_status_id, pt.project_value, ps.project_status, ps.status_color, md.department_name FROM projects pt 
        INNER JOIN clients c ON c.client_id = pt.client_id AND c.is_deleted = 0
        LEFT JOIN user_login ul ON ul.user_login_id = pt.project_manager_id AND ul.is_deleted = 0
        LEFT JOIN employees e ON e.user_login_id = pt.project_manager_id AND e.is_deleted = 0
        LEFT JOIN m_departments md ON md.m_department_id = e.m_department_id AND md.is_deleted = 0
        LEFT JOIN project_status ps ON ps.project_status_id = pt.project_status_id AND ps.is_deleted = 0
        WHERE pt.is_deleted = 0 AND pt.project_id = ?`, [params.project_id]);

        return rows;
    },
    async teamMembers(params){

        let [rows] = await db.execute(`SELECT pm.project_member_id, pm.project_id, pm.user_login_id, ul.user_name, ul.email_id, e.phone_number,  pm.role,
        DATE_FORMAT(pm.start_date, "%d-%b-%Y") AS start_date , DATE_FORMAT(pm.end_date, "%d-%b-%Y") AS end_date 
        FROM project_members pm
        INNER JOIN user_login ul ON ul.user_login_id = pm.user_login_id AND ul.is_deleted = 0
        INNER JOIN employees e ON e.user_login_id = pm.user_login_id AND e.is_deleted = 0
        WHERE pm.is_deleted = 0 AND pm.project_id = ?`, [params.project_id]);

        return rows;
    },
}

module.exports = projectModel;