const announcementModel = require("../models/announcementModel");
const adodb = require('../adodb');
const moment = require("moment");

const announcementController = {
    async notice(req, res){
        let params = req.query;
        let cal = (params.currentpage - 1) * params.postperpage;
        let offset = cal < 0 ? 0 : cal;

        let orderBY = "ORDER BY n.created_on DESC";
        if(params.hasOwnProperty("sorting") && params.sorting['direction'] != 'none'){
            orderBY = `ORDER BY n.${params.sorting["accessor"]} ${params.sorting["direction"]}`;
        }

        try {
            const data = await announcementModel.notice(params.postperpage, offset, orderBY);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async viewNotice(req, res){
        try {
            const data = await announcementModel.viewNotice(req.query);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async saveNotice(req, res){
        let pk = req.body.notice_id;

        if(!req.body.hasOwnProperty("is_deleted")){
            req.body["issue_date"] = moment(req.body.issue_date).format("YYYY-MM-DD");
        }
        
        try{
            let id = await adodb.saveData("notice","notice_id",req.body);

            let msg = req.body.hasOwnProperty('is_deleted') ? "Deleted Successfully" : (pk < 0) ? "Added Successfully" : "Updated Successfully";

            let code = pk > 0 ? 200 : 201;

            res.status(code).json({'notice_id': id, "msg": msg});
        }
        catch(err){
            res.status(400).json({"msg":err});
        }
    },
}

module.exports = announcementController;