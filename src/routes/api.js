const express = require('express');

const router = express.Router();

const adminController = require("../controllers/adminController.js");
const userController = require("../controllers/userController.js");
const authVerificationAdmin = require('../middlewares/authVerificationAdmin.js');
const authVerificationUser = require('../middlewares/authVerificationUser.js');
// Admin API
router.post('/admin-register', adminController.register);
router.post('/admin-login', adminController.login);
router.get('/admin',authVerificationAdmin, adminController.admin);
router.get('/admin-verify',authVerificationAdmin, adminController.adminVerify);
router.get('/admin-logout',authVerificationAdmin, adminController.logout);
router.put('/admin-update',authVerificationAdmin, adminController.update);

// User API
router.post('/user-register',userController.register);
router.post('/user-login',userController.login);
router.get('/user',authVerificationUser,userController.user);
router.get('/user-verify',authVerificationUser,userController.userVerify);
router.get('/user-logout',authVerificationUser,userController.logout);
router.put('/user-update',authVerificationUser,userController.update);

module.exports = router;