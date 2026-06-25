'use strict';

const Paciente = require('../models/Paciente');

const pacienteController = {
    async index(req, res) {
        try {
            const pagina = parseInt(req.query.pagina) || 1;
            const busca  = req.query.busca || '';
            const dados  = await Paciente.listar({ pagina, busca });
            res.render('pacientes/index', { titulo: 'Pacientes', ...dados, busca });
        } catch (err) {
            req.flash('erro', 'Erro ao listar pacientes.');
            res.redirect('/dashboard');
        }
    },

    exibirCriar(req, res) {
        res.render('pacientes/create', { titulo: 'Novo Paciente', erros: [] });
    },

    async criar(req, res) {
        const { nome, cpf, data_nasc, telefone, email, endereco } = req.body;
        const erros = [];
        if (!nome || !nome.trim()) erros.push({ msg: 'Nome é obrigatório.' });
        if (!cpf  || !cpf.trim())  erros.push({ msg: 'CPF é obrigatório.' });
        if (!data_nasc)            erros.push({ msg: 'Data de nascimento é obrigatória.' });

        if (erros.length) {
            return res.render('pacientes/create', { titulo: 'Novo Paciente', erros });
        }
        try {
            await Paciente.criar({ nome: nome.trim(), cpf: cpf.trim(), data_nasc, telefone, email, endereco });
            req.flash('sucesso', 'Paciente cadastrado com sucesso!');
            res.redirect('/pacientes');
        } catch (err) {
            const msg = err.code === '23505' ? 'Já existe um paciente com este CPF.' : 'Erro ao cadastrar paciente.';
            return res.render('pacientes/create', { titulo: 'Novo Paciente', erros: [{ msg }] });
        }
    },

    async exibirEditar(req, res) {
        try {
            const paciente = await Paciente.buscarPorId(req.params.id);
            if (!paciente) { req.flash('erro', 'Paciente não encontrado.'); return res.redirect('/pacientes'); }
            res.render('pacientes/edit', { titulo: 'Editar Paciente', paciente, erros: [] });
        } catch (err) {
            req.flash('erro', 'Erro ao carregar paciente.');
            res.redirect('/pacientes');
        }
    },

    async atualizar(req, res) {
        const { nome, cpf, data_nasc, telefone, email, endereco, ativo } = req.body;
        try {
            await Paciente.atualizar(req.params.id, {
                nome: nome.trim(), cpf: cpf.trim(), data_nasc, telefone, email, endereco,
                ativo: ativo === 'true'
            });
            req.flash('sucesso', 'Paciente atualizado com sucesso!');
            res.redirect('/pacientes');
        } catch (err) {
            req.flash('erro', 'Erro ao atualizar paciente.');
            res.redirect(`/pacientes/${req.params.id}/editar`);
        }
    },

    async deletar(req, res) {
        try {
            await Paciente.deletar(req.params.id);
            req.flash('sucesso', 'Paciente removido com sucesso!');
        } catch (err) {
            const msg = err.code === '23503'
                ? 'Não é possível remover: existem consultas vinculadas a este paciente.'
                : 'Erro ao remover paciente.';
            req.flash('erro', msg);
        }
        res.redirect('/pacientes');
    }
};

module.exports = pacienteController;