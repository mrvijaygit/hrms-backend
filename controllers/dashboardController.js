const dashboardModel = require("../models/dashboardModel");

const dashboardController = {
    async getAll(req, res){
        try {
            const notice = await dashboardModel.notice();
            const upcomingHolidays = await dashboardModel.upcomingHolidays();
            const todayBirthday = await dashboardModel.todayBirthday();
            const newHires = await dashboardModel.newHires();
            const workAnniversary = await dashboardModel.workAnniversary();
            const adminCard = await dashboardModel.adminCard();
        
            res.status(200).json({notice, upcomingHolidays, todayBirthday, newHires, workAnniversary, adminCard});
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

}

module.exports = dashboardController;