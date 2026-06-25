'use strict';

const express = require('express');
const router  = express.Router();

const authRoutes         = require('./authRoutes');
const dashboardRoutes    = require('./dashboardRoutes');
const usuarioRoutes      = require('./usuarioRoutes');
const perfilRoutes       = require('./perfilRoutes');
const pacienteRoutes     = require('./pacienteRoutes');
const medicoRoutes       = require('./medicoRoutes');
const consultaRoutes     = require('./consultaRoutes');
const prontuarioRoutes   = require('./prontuarioRoutes');
const especialidadeRoutes = require('./especialidadeRoutes');

// Raiz -> redireciona para dashboard
router.get('/', (req, res) => res.redirect('/dashboard'));

router.use('/',              authRoutes);
router.use('/dashboard',     dashboardRoutes);
router.use('/usuarios',      usuarioRoutes);
router.use('/perfis',        perfilRoutes);
router.use('/pacientes',     pacienteRoutes);
router.use('/medicos',       medicoRoutes);
router.use('/consultas',     consultaRoutes);
router.use('/prontuarios',   prontuarioRoutes);
router.use('/especialidades', especialidadeRoutes);

module.exports = router;