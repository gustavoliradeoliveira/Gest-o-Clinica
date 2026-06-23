'use strict';

const Medico       = require('../models/Medico');
const Especialidade = require('../models/Especialidade');

const medicoController = {
    async index(req, res) {
        try {
            const pagina = parseInt(req.query.pagina) || 1;
            const busca  = req.query.busca || '';
            const dados  = await Medico.listar({ pagina, busca });
            res.render('medicos/index', { titulo: 'Médicos', ...dados, busca });
        } catch (err) {
            req.flash('erro', 'Erro ao listar médicos.');
            res.redirect('/dashboard');
        }
    },

    async exibirCriar(req, res) {
        const especialidades = await Especialidade.buscarTodas();
        res.render('medicos/create', { titulo: 'Novo Médico', especialidades, erros: [] });
    },

    async criar(req, res) {
        const { nome, crm, telefone, email, especialidade_id } = req.body;
        const erros = [];
        if (!nome || !nome.trim()) erros.push({ msg: 'Nome é obrigatório.' });
        if (!crm  || !crm.trim())  erros.push({ msg: 'CRM é obrigatório.' });

        if (erros.length) {
            const especialidades = await Especialidade.buscarTodas();
            return res.render('medicos/create', { titulo: 'Novo Médico', especialidades, erros });
        }
        try {
            await Medico.criar({ nome: nome.trim(), crm: crm.trim(), telefone, email, especialidade_id: especialidade_id || null });
            req.flash('sucesso', 'Médico cadastrado com sucesso!');
            res.redirect('/medicos');
        } catch (err) {
            const especialidades = await Especialidade.buscarTodas();
            const msg = err.code === '23505' ? 'Já existe um médico com este CRM.' : 'Erro ao cadastrar médico.';
            return res.render('medicos/create', { titulo: 'Novo Médico', especialidades, erros: [{ msg }] });
        }
    },

    async exibirEditar(req, res) {
        try {
            const [medico, especialidades] = await Promise.all([
                Medico.buscarPorId(req.params.id),
                Especialidade.buscarTodas()
            ]);
            if (!medico) { req.flash('erro', 'Médico não encontrado.'); return res.redirect('/medicos'); }
            res.render('medicos/edit', { titulo: 'Editar Médico', medico, especialidades, erros: [] });
        } catch (err) {
            req.flash('erro', 'Erro ao carregar médico.');
            res.redirect('/medicos');
        }
    },

    async atualizar(req, res) {
        const { nome, crm, telefone, email, especialidade_id, ativo } = req.body;
        try {
            await Medico.atualizar(req.params.id, {
                nome: nome.trim(), crm: crm.trim(), telefone, email,
                especialidade_id: especialidade_id || null, ativo: ativo === 'true'
            });
            req.flash('sucesso', 'Médico atualizado com sucesso!');
            res.redirect('/medicos');
        } catch (err) {
            req.flash('erro', 'Erro ao atualizar médico.');
            res.redirect(`/medicos/${req.params.id}/editar`);
        }
    },

    async deletar(req, res) {
        try {
            await Medico.deletar(req.params.id);
            req.flash('sucesso', 'Médico removido com sucesso!');
        } catch (err) {
            const msg = err.code === '23503'
                ? 'Não é possível remover: existem consultas vinculadas a este médico.'
                : 'Erro ao remover médico.';
            req.flash('erro', msg);
        }
        res.redirect('/medicos');
    }
};

module.exports = medicoController;