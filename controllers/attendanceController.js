const attendanceModel = require("../models/attendanceModel");
const adodb = require('../adodb');
const moment = require("moment");

const attendanceController = {
    async attendance(req, res) {
        let params = req.query;
        let cal = (params.currentpage - 1) * params.postperpage;
        let offset = cal < 0 ? 0 : cal;
        let where = "";

        let orderBY = "ORDER BY att.attendance_date DESC";
        if (params.hasOwnProperty("sorting") && params.sorting['direction'] != 'none') {
            if (params.sorting["accessor"] == "user_name") {
                orderBY = `ORDER BY ul.${params.sorting["accessor"]} ${params.sorting["direction"]}`;
            }
            else if (params.sorting["accessor"] == "attendance_status") {
                orderBY = `ORDER BY mas.${params.sorting["accessor"]} ${params.sorting["direction"]}`;
            }
            else if (params.sorting["accessor"] == "working_hours") {
                orderBY = `ORDER BY DATE_FORMAT(TIMEDIFF(att.punch_out, att.punch_in), "%h:%i") ${params.sorting["direction"]}`;
            }
            else {
                orderBY = `ORDER BY att.${params.sorting["accessor"]} ${params.sorting["direction"]}`;
            }
        }

        if (params.hasOwnProperty('filter')) {
            for (let x in params.filter) {
                if (params.filter[x] != null && x == "attendance_date") {
                    where += ` AND att.${x} = Date('${moment(params.filter[x]).format('YYYY-MM-DD')}')`;
                }
                else if (params.filter[x] != null) {
                    where += ` AND att.${x} = ${params.filter[x]}`;
                }
            }
        }

        try {
            const data = await attendanceModel.attendance(params.postperpage, offset, orderBY, where);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async viewAttendance(req, res) {
        try {
            const data = await attendanceModel.viewAttendance(req.query);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async saveAttendance(req, res) {
        let pk = req.body.attendance_id;

        if (!req.body.hasOwnProperty("is_deleted")) {
            req.body["attendance_date"] = moment(req.body.attendance_date).format("YYYY-MM-DD");
        }

        try {
            let id = await adodb.saveData("attendance", "attendance_id", req.body);

            let msg = req.body.hasOwnProperty('is_deleted') ? "Deleted Successfully" : (pk < 0) ? "Added Successfully" : "Updated Successfully";

            let code = pk > 0 ? 200 : 201;

            res.status(code).json({ 'attendance_id': id, "msg": msg });
        }
        catch (err) {
            res.status(400).json({ "msg": err });
        }
    },
}

module.exports = attendanceController;