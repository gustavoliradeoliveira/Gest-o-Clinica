'use strict';

/**
 * Middleware de autenticação.
 * Verifica se o usuário está logado (sessão ativa).
 * Se não estiver, redireciona para /login.
 */
function autenticado(req, res, next) {
    if (req.session && req.session.usuario) {
        return next();
    }
    req.flash('erro', 'Você precisa fazer login para acessar esta página.');
    return res.redirect('/login');
}

/**
 * Middleware que redireciona usuários já autenticados para o dashboard.
 * Usado nas rotas públicas (login).
 */
function naoAutenticado(req, res, next) {
    if (req.session && req.session.usuario) {
        return res.redirect('/dashboard');
    }
    return next();
}

module.exports = { autenticado, naoAutenticado };
