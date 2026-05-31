'use strict';

require('dotenv').config();

const express      = require('express');
const path         = require('path');
const session      = require('express-session');
const pgSession    = require('connect-pg-simple')(session);
const ejsLayouts   = require('express-ejs-layouts');
const flash        = require('connect-flash');
const { pool }     = require('./src/models/db');

const indexRouter  = require('./src/routes/index');

const app  = express();
const PORT = process.env.PORT || 3000;

// =============================================================
// VIEW ENGINE
// =============================================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(ejsLayouts);
app.set('layout', 'layouts/main');  // layout padrão
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

// =============================================================
// MIDDLEWARES GLOBAIS
// =============================================================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Arquivos estáticos
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Sessão com store no PostgreSQL
app.use(session({
    store: new pgSession({
        pool,
        tableName: 'session',
        createTableIfMissing: true
    }),
    secret:            process.env.SESSION_SECRET || 'gestao_clinica_secret',
    resave:            false,
    saveUninitialized: false,
    cookie: {
        secure:   false, // true em produção com HTTPS
        httpOnly: true,
        maxAge:   parseInt(process.env.SESSION_MAX_AGE) || 86400000
    }
}));

// Flash messages
app.use(flash());

// Variáveis locais globais para as views
app.use((req, res, next) => {
    res.locals.usuario       = req.session.usuario || null;
    res.locals.flashSucesso  = req.flash('sucesso');
    res.locals.flashErro     = req.flash('erro');
    res.locals.flashInfo     = req.flash('info');
    next();
});

// =============================================================
// ROTAS
// =============================================================
app.use('/', indexRouter);

// =============================================================
// HANDLER: 404
// =============================================================
app.use((req, res) => {
    if (res.headersSent) return;
    // Tenta renderizar a view, se falhar usa HTML inline
    try {
        res.status(404).render('erros/404', { titulo: 'Página não encontrada' });
    } catch (e) {
        res.status(404).send('<h1>404 — Página não encontrada</h1><a href="/dashboard">Voltar</a>');
    }
});

// =============================================================
// HANDLER: ERRO GERAL
// =============================================================
app.use((err, req, res, next) => {
    console.error('[ERRO]', err.stack);
    if (res.headersSent) return next(err);
    const msg = process.env.NODE_ENV === 'development' ? err.message : 'Ocorreu um erro inesperado.';
    // Usa HTML inline para evitar falha em cascata se o próprio render falhar
    res.status(500).send(`
        <!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
        <title>Erro 500</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
        </head><body class="bg-light d-flex align-items-center justify-content-center" style="min-height:100vh">
        <div class="text-center p-4">
            <h1 class="display-1 text-danger fw-bold">500</h1>
            <h4>Erro interno do servidor</h4>
            <p class="text-muted">${msg}</p>
            <a href="/dashboard" class="btn btn-primary">Voltar ao Dashboard</a>
        </div></body></html>`);
});

// =============================================================
// INICIAR SERVIDOR
// =============================================================
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
    console.log(`   Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
