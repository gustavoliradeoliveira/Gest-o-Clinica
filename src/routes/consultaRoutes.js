'use strict';

const express = require('express');
const router  = express.Router();
const c = require('../controllers/consultaController');
const { autenticado } = require('../middlewares/authMiddleware');
const { verificarPermissao } = require('../middlewares/permissaoMiddleware');
const M = 'consultas';

router.get('/',              autenticado, verificarPermissao(M,'ler'),     c.index);
router.get('/novo',          autenticado, verificarPermissao(M,'criar'),   c.exibirCriar);
router.post('/',             autenticado, verificarPermissao(M,'criar'),   c.criar);
router.get('/:id/editar',    autenticado, verificarPermissao(M,'editar'),  c.exibirEditar);
router.post('/:id',          autenticado, verificarPermissao(M,'editar'),  c.atualizar);
router.post('/:id/deletar',  autenticado, verificarPermissao(M,'deletar'), c.deletar);

module.exports = router;