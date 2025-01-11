const express = require("express");
const payrollController = require("../controllers/payrollController");
const checkPayrollAlreadyExist = require("../middleware/checkPayrollAlreadyExist");
const router = express.Router();

router.get('/payrollList', payrollController.payrollList);
router.post('/savePayroll', checkPayrollAlreadyExist, payrollController.savePayroll);
router.get('/viewPayroll', payrollController.viewPayroll);
router.get('/payslip', payrollController.payslip);

module.exports = router;