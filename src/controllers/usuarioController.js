'use strict';

const Usuario = require('../models/Usuario');
const Perfil  = require('../models/Perfil');

const usuarioController = {
    async index(req, res) {
        try {
            const pagina = parseInt(req.query.pagina) || 1;
            const busca  = req.query.busca || '';
            const dados  = await Usuario.listar({ pagina, busca });
            res.render('usuarios/index', { titulo: 'Usuários', ...dados, busca });
        } catch (err) {
            req.flash('erro', 'Erro ao listar usuários.');
            res.redirect('/dashboard');
        }
    },

    async exibirCriar(req, res) {
        const perfis = await Perfil.buscarTodos();
        res.render('usuarios/create', { titulo: 'Novo Usuário', perfis, erros: [] });
    },

    async criar(req, res) {
        const { nome, email, senha, perfil_id } = req.body;
        const erros = [];
        if (!nome || !nome.trim()) erros.push({ msg: 'Nome é obrigatório.' });
        if (!email || !email.trim()) erros.push({ msg: 'E-mail é obrigatório.' });
        if (!senha || senha.length < 6) erros.push({ msg: 'Senha deve ter no mínimo 6 caracteres.' });
        if (!perfil_id) erros.push({ msg: 'Perfil é obrigatório.' });

        if (erros.length) {
            const perfis = await Perfil.buscarTodos();
            return res.render('usuarios/create', { titulo: 'Novo Usuário', perfis, erros });
        }
        try {
            await Usuario.criar({ nome: nome.trim(), email: email.trim().toLowerCase(), senha, perfil_id });
            req.flash('sucesso', 'Usuário criado com sucesso!');
            res.redirect('/usuarios');
        } catch (err) {
            const perfis = await Perfil.buscarTodos();
            const msg = err.code === '23505' ? 'Já existe um usuário com este e-mail.' : 'Erro ao criar usuário.';
            return res.render('usuarios/create', { titulo: 'Novo Usuário', perfis, erros: [{ msg }] });
        }
    },

    async exibirEditar(req, res) {
        try {
            const [usuario, perfis] = await Promise.all([
                Usuario.buscarPorId(req.params.id),
                Perfil.buscarTodos()
            ]);
            if (!usuario) { req.flash('erro', 'Usuário não encontrado.'); return res.redirect('/usuarios'); }
            res.render('usuarios/edit', { titulo: 'Editar Usuário', usuario_edit: usuario, perfis, erros: [] });
        } catch (err) {
            req.flash('erro', 'Erro ao carregar usuário.');
            res.redirect('/usuarios');
        }
    },

    async atualizar(req, res) {
        const { nome, email, perfil_id, ativo, senha } = req.body;
        try {
            await Usuario.atualizar(req.params.id, {
                nome: nome.trim(),
                email: email.trim().toLowerCase(),
                perfil_id, ativo: ativo === 'true', senha
            });
            req.flash('sucesso', 'Usuário atualizado com sucesso!');
            res.redirect('/usuarios');
        } catch (err) {
            req.flash('erro', 'Erro ao atualizar usuário.');
            res.redirect(`/usuarios/${req.params.id}/editar`);
        }
    },

    async deletar(req, res) {
        // Impede auto-exclusão
        if (parseInt(req.params.id) === req.session.usuario.id) {
            req.flash('erro', 'Você não pode excluir sua própria conta.');
            return res.redirect('/usuarios');
        }
        try {
            await Usuario.deletar(req.params.id);
            req.flash('sucesso', 'Usuário removido com sucesso!');
        } catch (err) {
            req.flash('erro', 'Erro ao remover usuário.');
        }
        res.redirect('/usuarios');
    }
};

module.exports = usuarioController;
