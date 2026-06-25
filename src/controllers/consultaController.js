'use strict';

const Consulta = require('../models/Consulta');
const Paciente = require('../models/Paciente');
const Medico   = require('../models/Medico');

const STATUS_VALIDOS = ['agendada', 'confirmada', 'realizada', 'cancelada'];

const consultaController = {
    async index(req, res) {
        try {
            const pagina = parseInt(req.query.pagina) || 1;
            const busca  = req.query.busca || '';
            const dados  = await Consulta.listar({ pagina, busca });
            res.render('consultas/index', { titulo: 'Consultas', ...dados, busca });
        } catch (err) {
            req.flash('erro', 'Erro ao listar consultas.');
            res.redirect('/dashboard');
        }
    },

    async exibirCriar(req, res) {
        const [pacientes, medicos] = await Promise.all([
            Paciente.buscarTodos(), Medico.buscarTodos()
        ]);
        res.render('consultas/create', {
            titulo: 'Nova Consulta', pacientes, medicos, statusValidos: STATUS_VALIDOS, erros: []
        });
    },

    async criar(req, res) {
        const { paciente_id, medico_id, data_hora, status, observacoes } = req.body;
        const erros = [];
        if (!paciente_id) erros.push({ msg: 'Paciente é obrigatório.' });
        if (!medico_id)   erros.push({ msg: 'Médico é obrigatório.' });
        if (!data_hora)   erros.push({ msg: 'Data e hora são obrigatórias.' });

        if (erros.length) {
            const [pacientes, medicos] = await Promise.all([Paciente.buscarTodos(), Medico.buscarTodos()]);
            return res.render('consultas/create', {
                titulo: 'Nova Consulta', pacientes, medicos, statusValidos: STATUS_VALIDOS, erros
            });
        }
        try {
            await Consulta.criar({ paciente_id, medico_id, data_hora, status, observacoes });
            req.flash('sucesso', 'Consulta agendada com sucesso!');
            res.redirect('/consultas');
        } catch (err) {
            req.flash('erro', 'Erro ao agendar consulta.');
            res.redirect('/consultas/novo');
        }
    },

    async exibirEditar(req, res) {
        try {
            const [consulta, pacientes, medicos] = await Promise.all([
                Consulta.buscarPorId(req.params.id),
                Paciente.buscarTodos(),
                Medico.buscarTodos()
            ]);
            if (!consulta) { req.flash('erro', 'Consulta não encontrada.'); return res.redirect('/consultas'); }
            res.render('consultas/edit', {
                titulo: 'Editar Consulta', consulta, pacientes, medicos,
                statusValidos: STATUS_VALIDOS, erros: []
            });
        } catch (err) {
            req.flash('erro', 'Erro ao carregar consulta.');
            res.redirect('/consultas');
        }
    },

    async atualizar(req, res) {
        const { paciente_id, medico_id, data_hora, status, observacoes } = req.body;
        try {
            await Consulta.atualizar(req.params.id, { paciente_id, medico_id, data_hora, status, observacoes });
            req.flash('sucesso', 'Consulta atualizada com sucesso!');
            res.redirect('/consultas');
        } catch (err) {
            req.flash('erro', 'Erro ao atualizar consulta.');
            res.redirect(`/consultas/${req.params.id}/editar`);
        }
    },

    async deletar(req, res) {
        try {
            await Consulta.deletar(req.params.id);
            req.flash('sucesso', 'Consulta removida com sucesso!');
        } catch (err) {
            req.flash('erro', 'Erro ao remover consulta.');
        }
        res.redirect('/consultas');
    }
};

module.exports = consultaController;