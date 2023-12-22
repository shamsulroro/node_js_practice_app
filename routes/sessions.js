const express = require('express');

const authController = require('../controllers/sessionsController');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);


// --------------------------- MISC routes ---------------------------

router.get('/device_info');

module.exports = router;