'use strict';

const Usuario = require('../models/Usuario');

const authController = {
    // GET /login
    exibirLogin(req, res) {
        res.render('auth/login', { titulo: 'Login — Gestão Clínica', layout: 'layouts/auth' });
    },

    // POST /login
    async processarLogin(req, res) {
        const { email, senha } = req.body;

        if (!email || !senha) {
            req.flash('erro', 'Preencha todos os campos.');
            return res.redirect('/login');
        }

        try {
            const usuario = await Usuario.buscarPorEmail(email.trim().toLowerCase());

            if (!usuario) {
                req.flash('erro', 'E-mail ou senha inválidos.');
                return res.redirect('/login');
            }

            const senhaValida = await Usuario.verificarSenha(senha, usuario.senha);
            if (!senhaValida) {
                req.flash('erro', 'E-mail ou senha inválidos.');
                return res.redirect('/login');
            }

            // Montar objeto de sessão (sem a senha)
            req.session.usuario = {
                id:          usuario.id,
                nome:        usuario.nome,
                email:       usuario.email,
                perfil_nome: usuario.perfil_nome,
                permissoes:  typeof usuario.permissoes === 'string'
                    ? JSON.parse(usuario.permissoes)
                    : usuario.permissoes
            };

            req.flash('sucesso', `Bem-vindo(a), ${usuario.nome}!`);
            return res.redirect('/dashboard');
        } catch (err) {
            console.error('[Auth] Erro no login:', err);
            req.flash('erro', 'Erro interno. Tente novamente.');
            return res.redirect('/login');
        }
    },

    // GET /logout
    logout(req, res) {
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.redirect('/login');
        });
    }
};

module.exports = authController;
