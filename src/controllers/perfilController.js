'use strict';

const Perfil = require('../models/Perfil');

const MODULOS = ['usuarios', 'perfis', 'pacientes', 'medicos', 'consultas', 'prontuarios', 'especialidades'];

const perfilController = {
    async index(req, res) {
        try {
            const pagina = parseInt(req.query.pagina) || 1;
            const busca  = req.query.busca || '';
            const dados  = await Perfil.listar({ pagina, busca });
            res.render('perfis/index', { titulo: 'Perfis de Acesso', ...dados, busca });
        } catch (err) {
            req.flash('erro', 'Erro ao listar perfis.');
            res.redirect('/dashboard');
        }
    },

    exibirCriar(req, res) {
        res.render('perfis/create', {
            titulo: 'Novo Perfil', modulos: MODULOS, erros: []
        });
    },

    async criar(req, res) {
        const { nome, descricao } = req.body;
        if (!nome || !nome.trim()) {
            return res.render('perfis/create', {
                titulo: 'Novo Perfil', modulos: MODULOS,
                erros: [{ msg: 'Nome do perfil é obrigatório.' }]
            });
        }
        // Montar objeto de permissões a partir do body
        const permissoes = {};
        for (const modulo of MODULOS) {
            permissoes[modulo] = {
                criar:   req.body[`perm_${modulo}_criar`]   === 'on',
                ler:     req.body[`perm_${modulo}_ler`]     === 'on',
                editar:  req.body[`perm_${modulo}_editar`]  === 'on',
                deletar: req.body[`perm_${modulo}_deletar`] === 'on'
            };
        }
        try {
            await Perfil.criar({ nome: nome.trim(), descricao, permissoes });
            req.flash('sucesso', 'Perfil criado com sucesso!');
            res.redirect('/perfis');
        } catch (err) {
            const msg = err.code === '23505' ? 'Já existe um perfil com este nome.' : 'Erro ao criar perfil.';
            return res.render('perfis/create', {
                titulo: 'Novo Perfil', modulos: MODULOS, erros: [{ msg }]
            });
        }
    },

    async exibirEditar(req, res) {
        try {
            const perfil = await Perfil.buscarPorId(req.params.id);
            if (!perfil) { req.flash('erro', 'Perfil não encontrado.'); return res.redirect('/perfis'); }
            const permissoes = typeof perfil.permissoes === 'string'
                ? JSON.parse(perfil.permissoes) : perfil.permissoes;
            res.render('perfis/edit', {
                titulo: 'Editar Perfil', perfil: { ...perfil, permissoes },
                modulos: MODULOS, erros: []
            });
        } catch (err) {
            req.flash('erro', 'Erro ao carregar perfil.');
            res.redirect('/perfis');
        }
    },

    async atualizar(req, res) {
        const { nome, descricao, ativo } = req.body;
        const permissoes = {};
        for (const modulo of MODULOS) {
            permissoes[modulo] = {
                criar:   req.body[`perm_${modulo}_criar`]   === 'on',
                ler:     req.body[`perm_${modulo}_ler`]     === 'on',
                editar:  req.body[`perm_${modulo}_editar`]  === 'on',
                deletar: req.body[`perm_${modulo}_deletar`] === 'on'
            };
        }
        try {
            await Perfil.atualizar(req.params.id, { nome, descricao, permissoes, ativo: ativo === 'true' });
            req.flash('sucesso', 'Perfil atualizado com sucesso!');
            res.redirect('/perfis');
        } catch (err) {
            req.flash('erro', 'Erro ao atualizar perfil.');
            res.redirect(`/perfis/${req.params.id}/editar`);
        }
    },

    async deletar(req, res) {
        try {
            await Perfil.deletar(req.params.id);
            req.flash('sucesso', 'Perfil removido com sucesso!');
        } catch (err) {
            const msg = err.code === '23503'
                ? 'Não é possível remover: existem usuários vinculados a este perfil.'
                : 'Erro ao remover perfil.';
            req.flash('erro', msg);
        }
        res.redirect('/perfis');
    }
};

module.exports = perfilController;
