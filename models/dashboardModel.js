const db = require('../config/db');

const dashboardModel = {
    async notice(){
        let [rows] = await db.execute(`SELECT n.notice_id, n.notice_title, n.notice_content, DATE_FORMAT(n.issue_date, "%d-%b-%Y") AS issue_date_display , n.issue_date, n.notice_status
        FROM notice n WHERE n.is_deleted = 0 AND n.notice_status = 1 ORDER BY n.issue_date DESC LIMIT 5`);
        return rows;
    },
    async upcomingHolidays(){
        let [rows] = await db.execute(`SELECT h.holiday_id, h.holiday_title, DATE_FORMAT(h.holiday_date, "%d-%b-%Y") AS holiday_date, 
        DATE_FORMAT(h.holiday_date, "%W") AS holiday_day FROM holiday h 
        WHERE h.is_deleted = 0 AND h.holiday_date >= DATE(NOW()) ORDER BY h.holiday_date ASC`);
        return rows;
    },
    async todayBirthday(){
        let [rows] = await db.execute(`SELECT e.employee_id, ul.user_login_id, ul.user_name, md.department_name, mdn.designation_name, 
        DATE_FORMAT(e.date_of_birth, "%d-%b-%Y") AS date_of_birth,
        (YEAR(NOW()) - YEAR(e.date_of_birth)) AS age FROM employees e 
        INNER JOIN user_login ul ON ul.user_login_id = e.user_login_id AND ul.is_deleted = 0
        INNER JOIN m_departments md ON md.m_department_id = e.m_department_id AND md.is_deleted = 0
        INNER JOIN m_designation mdn ON mdn.m_designation_id = e.m_designation_id AND mdn.is_deleted = 0
        WHERE e.is_deleted = 0 AND e.m_employee_status_id = 1 AND DATE_FORMAT(e.date_of_birth , "%m-%d") = DATE_FORMAT(NOW(), "%m-%d")`);
        return rows;
    },
    async newHires(){
        let [rows] = await db.execute(`SELECT e.employee_id, ul.user_login_id, ul.user_name, md.department_name, mdn.designation_name,
        DATE_FORMAT(e.date_of_joining, "%d-%b-%Y") AS date_of_joining FROM employees e 
        INNER JOIN user_login ul ON ul.user_login_id = e.user_login_id AND ul.is_deleted = 0
        INNER JOIN m_departments md ON md.m_department_id = e.m_department_id AND md.is_deleted = 0
        INNER JOIN m_designation mdn ON mdn.m_designation_id = e.m_designation_id AND mdn.is_deleted = 0
        WHERE e.is_deleted = 0 AND e.m_employee_status_id = 1 AND e.date_of_joining BETWEEN  DATE(DATE_SUB(NOW(), INTERVAL 30 DAY)) AND DATE(NOW()) 
        ORDER BY e.date_of_joining DESC`);
        return rows;
    },
    async workAnniversary(){
        let [rows] = await db.execute(`SELECT e.employee_id, ul.user_login_id, ul.user_name, md.department_name, mdn.designation_name, 
        DATE_FORMAT(e.date_of_joining, "%d-%b-%y")  AS date_of_joining,
        (YEAR(NOW()) - YEAR(e.date_of_joining)) AS anniversary_year  
        FROM employees e 
        INNER JOIN user_login ul ON ul.user_login_id = e.user_login_id AND ul.is_deleted = 0
        INNER JOIN m_departments md ON md.m_department_id = e.m_department_id AND md.is_deleted = 0
        INNER JOIN m_designation mdn ON mdn.m_designation_id = e.m_designation_id AND mdn.is_deleted = 0
        WHERE e.is_deleted = 0 AND e.m_employee_status_id = 1 
        AND DATE_FORMAT(e.date_of_joining, "%d-%b") = DATE_FORMAT(NOW(), "%d-%b")
        AND YEAR(e.date_of_joining) <> YEAR(NOW())
        ORDER BY e.date_of_joining DESC`);
        return rows;
    },
    async adminCard(){
        let [rows] = await db.execute(`SELECT JSON_ARRAY( 
            JSON_OBJECT('title', 'Total Employees', 'count', COUNT(ul.user_login_id), 'icon', 'FaUsers', 'id', 'total_employee'),
            JSON_OBJECT('title', 'Human Resources', 'count', COUNT(CASE WHEN ul.m_user_type_id = 100 THEN ul.user_login_id END), 'icon', 'FaUserTie', 'id', 'hr_count'),
            JSON_OBJECT('title', 'Managers', 'count', COUNT(CASE WHEN ul.m_user_type_id = 20 THEN ul.user_login_id END), 'icon', 'FaUserTie', 'id', 'manager_count'),
            JSON_OBJECT('title', 'Employees', 'count', COUNT(CASE WHEN ul.m_user_type_id = 1 THEN ul.user_login_id END), 'icon', 'FaUser', 'id', 'employee_count'),
            JSON_OBJECT('title', 'Clients', 'count', (SELECT COUNT(c.client_id) FROM clients c WHERE c.is_deleted = 0), 'icon', 'FaHandshake', 'id', 'client_count'),
            JSON_OBJECT('title', 'Projects', 'count', (SELECT COUNT(p.project_id) FROM projects p INNER JOIN clients c ON c.client_id = p.client_id AND c.is_deleted = 0 WHERE p.is_deleted = 0), 'icon', 'FaClipboardList', 'id', 'project_count'),
            JSON_OBJECT('title', 'Pending Leave Requests', 'count', (SELECT COUNT(CASE WHEN ul2.m_user_type_id = 100 THEN lr.leave_id END) FROM leave_requests lr INNER JOIN user_login ul2 ON ul2.user_login_id = lr.user_login_id AND ul2.is_deleted = 0 WHERE lr.is_deleted = 0 AND lr.m_leave_status_id = 1 ), 'icon', 'FaCalendarCheck', 'id', 'pending_leave_request_count')
        ) AS counts
        FROM user_login ul 
        WHERE ul.is_deleted = 0 AND ul.m_user_type_id NOT IN (1000);`);
        return rows[0]['counts'];
    },


}

module.exports = dashboardModel;