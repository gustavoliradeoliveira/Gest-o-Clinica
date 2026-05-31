'use strict';

const express = require('express');
const router  = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { autenticado } = require('../middlewares/authMiddleware');

router.get('/', autenticado, dashboardController.index);

module.exports = router;
