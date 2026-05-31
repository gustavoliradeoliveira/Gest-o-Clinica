'use strict';

const express = require('express');
const router  = express.Router();

const authRoutes         = require('./authRoutes');
const dashboardRoutes    = require('./dashboardRoutes');
const usuarioRoutes      = require('./usuarioRoutes');
const perfilRoutes       = require('./perfilRoutes');

// Raiz -> redireciona para dashboard
router.get('/', (req, res) => res.redirect('/dashboard'));

router.use('/',              authRoutes);
router.use('/dashboard',     dashboardRoutes);
router.use('/usuarios',      usuarioRoutes);
router.use('/perfis',        perfilRoutes);

module.exports = router;
