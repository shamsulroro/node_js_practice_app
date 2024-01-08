const express = require('express');

const authController = require('../controllers/sessionsController');
const { check } = require('express-validator');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login',[
  check('email').isEmail()
], authController.postLogin);

router.post('/logout', authController.postLogout);


// --------------------------- MISC routes ---------------------------

router.get('/device_info');

module.exports = router;