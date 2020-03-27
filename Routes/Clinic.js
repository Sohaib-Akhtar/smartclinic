const path = require('path');

const express = require('express');

const shopController = require('../Controllers/Clinic');
const isAuth = require('../Middleware/is-auth');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/appointment',isAuth, shopController.getAppointment);

router.post('/appointment', shopController.postAppointment);

router.get('/membership', shopController.getMembership);

router.get('/doctors', shopController.getDoctors);

router.get('/membership', shopController.getMembership);

module.exports = router;
