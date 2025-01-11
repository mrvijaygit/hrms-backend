const payrollModel = require("../models/payrollModel");
const adodb = require('../adodb');
const moment = require('moment');

const payrollController = {
    async payrollList(req, res){
        let params = req.query;
        let cal = (params.currentpage - 1) * params.postperpage;
        let offset = cal < 0 ? 0 : cal;
        let where = "";
        
      
        const logger_type_id = req.body.userDetails.m_user_type_id;
        const logger_id = req.body.userDetails.user_login_id;

        if(logger_type_id < 100 && logger_id > 0){
            where += ` AND ul.user_login_id = ${logger_id}`;
        }
        else if(logger_type_id == 100){
            where += ` AND ul.m_user_type_id NOT IN (100)`;
        }

        let orderBY = "ORDER BY pr.created_on DESC";
        if(params.hasOwnProperty("sorting") && params.sorting['direction'] != 'none'){
            if (params.sorting["accessor"] == "user_name") {
                orderBY = `ORDER BY ul.${params.sorting["accessor"]} ${params.sorting["direction"]}`;
            }
            else{
                orderBY = `ORDER BY pr.${params.sorting["accessor"]} ${params.sorting["direction"]}`;
            }
        }

        if (params.hasOwnProperty('filter')) {
            for (let x in params.filter) {
                if (params.filter[x] != null && x == "payroll_month") {
                    where += ` AND DATE_FORMAT(pr.${x}, '%M-%Y') = DATE_FORMAT(Date('${moment(params.filter[x]).format('YYYY-MM-DD')}'), '%M-%Y')`;
                }
                else if (params.filter[x] != null) {
                    where += ` AND pr.${x} = ${params.filter[x]}`;
                }
            }
        }

        try {
            const data = await payrollModel.payrollList(params.postperpage, offset, orderBY, where);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async viewPayroll(req, res){
        try {
            const data = await payrollModel.viewPayroll(req.query);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async payslip(req, res){
        try {
            const data = await payrollModel.payslip(req.query);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async savePayroll(req, res){
        let pk = req.body.payroll_id;

        if(req.body.hasOwnProperty('payroll_month')){
            req.body['payroll_month'] = moment(req.body['payroll_month']).format("YYYY-MM-DD");
        }

        try{
        
            let id = await adodb.saveData("payroll","payroll_id",req.body);

            let msg = req.body.hasOwnProperty('is_deleted') ? "Deleted Successfully" : (pk < 0) ? "Added Successfully" : "Updated Successfully";

            let code = pk > 0 ? 200 : 201;

            res.status(code).json({'payroll_id': id, "msg": msg});
        }
        catch(err){
            res.status(400).json({"msg":err});
        }
    },
}

module.exports = payrollController;