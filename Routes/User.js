const express = require('express');

const authController = require('../Controllers/User');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/logindoc', authController.getLoginDoc);

router.get('/signup', authController.getSignup);

router.get('/signupdoc', authController.getSignupDoc);

router.post('/signupdoc', authController.postSignupDoc);

router.post('/login', authController.postLogin);

router.post('/logindoc', authController.postLoginDoc);

router.post('/signup', authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/userappointments',authController.getAppointments);

router.get('/dashboard',authController.getDashboard);

router.get('/removeappointment/:AppointID',authController.getRemoveAppointment);

module.exports = router;