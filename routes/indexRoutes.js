const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware.ensureAuthenticated, indexController.dashboard);

module.exports = router;
