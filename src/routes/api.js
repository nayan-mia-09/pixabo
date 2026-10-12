const express = require('express');

const router = express.Router();

const adminController = require("../controllers/adminController.js");
const authVerificationAdmin = require('../middlewares/authVerificationAdmin.js');
// Admin API
router.post('/admin-register', adminController.register);
router.post('/admin-login', adminController.login);
router.get('/admin',authVerificationAdmin, adminController.admin);
router.get('/admin-verify',authVerificationAdmin, adminController.adminVerify);
router.get('/admin-logout',authVerificationAdmin, adminController.logout);
router.put('/admin-update',authVerificationAdmin, adminController.update);


module.exports = router;