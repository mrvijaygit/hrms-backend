const projectModel = require("../models/projectModel");
const adodb = require('../adodb');
const moment = require('moment');

const projectController = {
    async clients(req, res){
        let params = req.query;
        let cal = (params.currentpage - 1) * params.postperpage;
        let offset = cal < 0 ? 0 : cal;

        let orderBY = "ORDER BY c.created_on DESC";
        if(params.hasOwnProperty("sorting") && params.sorting['direction'] != 'none'){
            orderBY = `ORDER BY c.${params.sorting["accessor"]} ${params.sorting["direction"]}`;
        }

        try {
            const data = await projectModel.clients(params.postperpage, offset, orderBY);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async viewClient(req, res){
        try {
            const data = await projectModel.viewClient(req.query);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async saveClient(req, res){
        let pk = req.body.client_id;
        
        try{
            let id = await adodb.saveData("clients","client_id",req.body);

            let msg = req.body.hasOwnProperty('is_deleted') ? "Deleted Successfully" : (pk < 0) ? "Added Successfully" : "Updated Successfully";

            let code = pk > 0 ? 200 : 201;

            res.status(code).json({'client_id': id, "msg": msg});
        }
        catch(err){
            res.status(400).json({"msg":err});
        }
    },
    async projects(req, res){
        let params = req.query;
        let cal = (params.currentpage - 1) * params.postperpage;
        let offset = cal < 0 ? 0 : cal;

        let where = "";
        const logger_type_id = req.body.userDetails.m_user_type_id;
        const logger_id = req.body.userDetails.user_login_id;

        if(logger_type_id == 20){
            where += ` AND ul.user_login_id = ${logger_id}`;
        }
        else if(logger_type_id == 1){
            where += ` AND pm.user_login_id = ${logger_id}`;
        }

        let orderBY = "ORDER BY pt.created_on DESC";
        if(params.hasOwnProperty("sorting") && params.sorting['direction'] != 'none'){
            orderBY = `ORDER BY pt.${params.sorting["accessor"]} ${params.sorting["direction"]}`;
        }

        try {
            const data = await projectModel.projects(params.postperpage, offset, orderBY, where);
            res.status(200).json(data);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async viewProject(req, res){
        try {
            const data = await projectModel.viewProject(req.query);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async projectDetails(req, res){
        try {
            const basic = await projectModel.viewProject(req.query);
            const teamMembers = await projectModel.teamMembers(req.query);

            res.status(200).json({
                basic:basic.length > 0 ? basic[0] : null,
                teamMembers:teamMembers.length > 0 ? teamMembers : null,
            });
            
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async saveProject(req, res){
        let pk = req.body.project_id;

        if(req.body.hasOwnProperty('start_date') && String(req.body['start_date']).length > 0){
            req.body['start_date'] = moment(req.body['start_date']).format("YYYY-MM-DD");
        }

        if(req.body.hasOwnProperty('deadline') && String(req.body['deadline']).length > 0){
            req.body['deadline'] = moment(req.body['deadline']).format("YYYY-MM-DD");
        }

        try{
            let id = await adodb.saveData("projects","project_id",req.body);

            let msg = req.body.hasOwnProperty('is_deleted') ? "Deleted Successfully" : (pk < 0) ? "Added Successfully" : "Updated Successfully";

            let code = pk > 0 ? 200 : 201;

            res.status(code).json({'project_id': id, "msg": msg});
        }
        catch(err){
            res.status(400).json({"msg":err});
        }
    },

    async saveTeamMember(req, res){
        let pk = req.body.project_member_id;

        if(req.body.hasOwnProperty('start_date') && String(req.body['start_date']).length > 0){
            req.body['start_date'] = moment(req.body['start_date']).format("YYYY-MM-DD");
        }

        if(req.body.hasOwnProperty('end_date') && String(req.body['end_date']).length > 0){
            req.body['end_date'] = moment(req.body['end_date']).format("YYYY-MM-DD");
        }

        try{
            let id = await adodb.saveData("project_members","project_member_id",req.body);

            let msg = req.body.hasOwnProperty('is_deleted') ? "Deleted Successfully" : (pk < 0) ? "Added Successfully" : "Updated Successfully";

            let code = pk > 0 ? 200 : 201;

            res.status(code).json({'project_member_id': id, "msg": msg});
        }
        catch(err){
            res.status(400).json({"msg":err});
        }
    },
}

module.exports = projectController;