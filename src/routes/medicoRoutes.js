const express = require('express');
const router = express.Router();
const medicoController = require('../controllers/medicoController');

router.get('/', medicoController.listMedicos);
router.post('/', medicoController.createMedico);
router.post('/update/:id', medicoController.updateMedico);
router.post('/delete/:id', medicoController.deleteMedico);

module.exports = router;
