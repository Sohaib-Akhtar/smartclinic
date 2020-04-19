const path = require('path');

const express = require('express');

const shopController = require('../Controllers/Clinic');
const isAuth = require('../Middleware/is-auth');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/appointment/:DocID',isAuth, shopController.getAppointment);

router.post('/appointment/:DocID', shopController.postAppointment);

router.get('/membership', shopController.getMembership);

router.get('/doctors', shopController.getDoctors);

router.get('/membership', shopController.getMembership);

router.post('/comment/:DocID', shopController.postComment);

module.exports = router;
