'use strict';

const express = require('express');
const router  = express.Router();
const authController = require('../controllers/authController');
const { naoAutenticado } = require('../middlewares/authMiddleware');

router.get('/login',  naoAutenticado, authController.exibirLogin);
router.post('/login', naoAutenticado, authController.processarLogin);
router.get('/logout',                authController.logout);

module.exports = router;
