const db = require('../config/db');

const announcementModel = {
    async notice(pagesize, offset, orderBY){
        let limit = `LIMIT ${pagesize} OFFSET ${offset}`;

        let [count] = await db.execute(`SELECT COUNT(n.notice_id) AS counts FROM notice n WHERE n.is_deleted = 0`);
        let [rows] = await db.execute(`SELECT ROW_NUMBER() OVER(${orderBY}) as s_no, n.notice_id, n.notice_title, n.notice_content, DATE_FORMAT(n.issue_date, "%d-%b-%Y") AS issue_date_display,
        IF(n.notice_status = 1, 'Active', 'Expired') AS notice_status FROM notice n WHERE n.is_deleted = 0 ${limit}`);
  
        return {data:rows, totalRecord:count[0]['counts']};
    },
    async viewNotice(params){

        let [rows] = await db.execute(`SELECT n.notice_id, n.notice_title, n.notice_content, DATE_FORMAT(n.issue_date, "%d-%b-%Y") AS issue_date_display,
        n.notice_status FROM notice n WHERE n.is_deleted = 0 AND n.notice_id = ?`, [params.notice_id]);

        return rows;
    },
}

module.exports = announcementModel;