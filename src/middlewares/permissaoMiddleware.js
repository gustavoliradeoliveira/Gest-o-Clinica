'use strict';

/**
 * Fábrica de middleware de permissão.
 * @param {string} modulo  - Ex: 'pacientes', 'medicos'
 * @param {string} acao    - Ex: 'criar', 'ler', 'editar', 'deletar'
 * @returns {Function} Middleware Express
 */
function verificarPermissao(modulo, acao) {
    return (req, res, next) => {
        const usuario = req.session.usuario;

        if (!usuario) {
            req.flash('erro', 'Acesso negado. Faça login.');
            return res.redirect('/login');
        }

        const permissoes = usuario.permissoes || {};
        const moduloPerm = permissoes[modulo] || {};

        if (moduloPerm[acao] === true) {
            return next();
        }

        req.flash('erro', `Você não tem permissão para ${acao} em ${modulo}.`);
        return res.redirect('back');
    };
}

module.exports = { verificarPermissao };
