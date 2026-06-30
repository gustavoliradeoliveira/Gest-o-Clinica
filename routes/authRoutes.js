const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/login', authMiddleware.guestOnly, authController.showLogin);
router.post('/login', authController.login);
router.get('/register', authMiddleware.guestOnly, authController.showRegister);
router.post('/register', authController.register);
router.post('/logout', authController.logout);

module.exports = router;
