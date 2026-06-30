const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware.ensureAuthenticated);
router.get('/', pacienteController.list);
router.get('/novo', pacienteController.showCreate);
router.post('/', pacienteController.create);
router.get('/:id/editar', pacienteController.showEdit);
router.post('/:id', pacienteController.update);
router.post('/:id/deletar', pacienteController.delete);
router.get('/new', (req, res) => res.redirect('/pacientes/novo'));
router.get('/:id/edit', (req, res) => res.redirect(`/pacientes/${req.params.id}/editar`));
router.put('/:id', pacienteController.update);
router.delete('/:id', pacienteController.delete);

module.exports = router;
