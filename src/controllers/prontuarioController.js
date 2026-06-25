'use strict';

const Prontuario = require('../models/Prontuario');
const Consulta   = require('../models/Consulta');

const prontuarioController = {
    async index(req, res) {
        try {
            const pagina = parseInt(req.query.pagina) || 1;
            const busca  = req.query.busca || '';
            const dados  = await Prontuario.listar({ pagina, busca });
            res.render('prontuarios/index', { titulo: 'Prontuários', ...dados, busca });
        } catch (err) {
            req.flash('erro', 'Erro ao listar prontuários.');
            res.redirect('/dashboard');
        }
    },

    async exibirCriar(req, res) {
        try {
            // Lista consultas realizadas que ainda não possuem prontuário
            const { query } = require('../models/db');
            const consultasRes = await query(
                `SELECT c.id,
                        p.nome AS paciente_nome,
                        m.nome AS medico_nome,
                        c.data_hora
                   FROM consultas c
                   JOIN pacientes p ON p.id = c.paciente_id
                   JOIN medicos   m ON m.id = c.medico_id
                  WHERE c.status = 'realizada'
                    AND c.id NOT IN (SELECT consulta_id FROM prontuarios)
                  ORDER BY c.data_hora DESC`
            );
            res.render('prontuarios/create', {
                titulo: 'Novo Prontuário',
                consultas: consultasRes.rows, erros: []
            });
        } catch (err) {
            req.flash('erro', 'Erro ao carregar formulário.');
            res.redirect('/prontuarios');
        }
    },

    async criar(req, res) {
        const { consulta_id, descricao, diagnostico, prescricao } = req.body;
        if (!consulta_id || !descricao || !descricao.trim()) {
            req.flash('erro', 'Consulta e descrição são obrigatórios.');
            return res.redirect('/prontuarios/novo');
        }
        try {
            await Prontuario.criar({ consulta_id, descricao: descricao.trim(), diagnostico, prescricao });
            req.flash('sucesso', 'Prontuário criado com sucesso!');
            res.redirect('/prontuarios');
        } catch (err) {
            req.flash('erro', 'Erro ao criar prontuário.');
            res.redirect('/prontuarios/novo');
        }
    },

    async exibirEditar(req, res) {
        try {
            const prontuario = await Prontuario.buscarPorId(req.params.id);
            if (!prontuario) { req.flash('erro', 'Prontuário não encontrado.'); return res.redirect('/prontuarios'); }
            res.render('prontuarios/edit', { titulo: 'Editar Prontuário', prontuario, erros: [] });
        } catch (err) {
            req.flash('erro', 'Erro ao carregar prontuário.');
            res.redirect('/prontuarios');
        }
    },

    async atualizar(req, res) {
        const { consulta_id, descricao, diagnostico, prescricao } = req.body;
        if (!descricao || !descricao.trim()) {
            req.flash('erro', 'Descrição é obrigatória.');
            return res.redirect(`/prontuarios/${req.params.id}/editar`);
        }
        try {
            await Prontuario.atualizar(req.params.id, {
                consulta_id, descricao: descricao.trim(), diagnostico, prescricao
            });
            req.flash('sucesso', 'Prontuário atualizado com sucesso!');
            res.redirect('/prontuarios');
        } catch (err) {
            req.flash('erro', 'Erro ao atualizar prontuário.');
            res.redirect(`/prontuarios/${req.params.id}/editar`);
        }
    },

    async deletar(req, res) {
        try {
            await Prontuario.deletar(req.params.id);
            req.flash('sucesso', 'Prontuário removido com sucesso!');
        } catch (err) {
            req.flash('erro', 'Erro ao remover prontuário.');
        }
        res.redirect('/prontuarios');
    }
};

module.exports = prontuarioController;