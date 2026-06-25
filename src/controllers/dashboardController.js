'use strict';

const { query } = require('../models/db');
const Consulta  = require('../models/Consulta');

const dashboardController = {
    async index(req, res) {
        try {
            const [pacientes, medicos, consultas, especialidades, statusConsultas] = await Promise.all([
                query('SELECT COUNT(*) FROM pacientes WHERE ativo = true'),
                query('SELECT COUNT(*) FROM medicos WHERE ativo = true'),
                query('SELECT COUNT(*) FROM consultas'),
                query('SELECT COUNT(*) FROM especialidades WHERE ativo = true'),
                Consulta.contarPorStatus()
            ]);

            // Próximas consultas (agendadas/confirmadas)
            const proximasRes = await query(
                `SELECT c.data_hora, c.status,
                        p.nome AS paciente_nome,
                        m.nome AS medico_nome
                   FROM consultas c
                   JOIN pacientes p ON p.id = c.paciente_id
                   JOIN medicos   m ON m.id = c.medico_id
                  WHERE c.data_hora >= NOW()
                    AND c.status IN ('agendada', 'confirmada')
                  ORDER BY c.data_hora
                  LIMIT 5`
            );

            res.render('dashboard/index', {
                titulo: 'Dashboard',
                stats: {
                    pacientes:    parseInt(pacientes.rows[0].count),
                    medicos:      parseInt(medicos.rows[0].count),
                    consultas:    parseInt(consultas.rows[0].count),
                    especialidades: parseInt(especialidades.rows[0].count)
                },
                statusConsultas,
                proximasConsultas: proximasRes.rows
            });
        } catch (err) {
            console.error('[Dashboard]', err.message);
            // Se as tabelas ainda não existem (42P01), exibe dashboard vazio
            if (err.code === '42P01') {
                req.flash('erro', 'Algumas tabelas do banco ainda não foram criadas. Execute database/schema.sql e database/seed.sql.');
                return res.render('dashboard/index', {
                    titulo: 'Dashboard',
                    stats: { pacientes: 0, medicos: 0, consultas: 0, especialidades: 0 },
                    statusConsultas: [],
                    proximasConsultas: []
                });
            }
            req.flash('erro', 'Erro ao carregar o dashboard.');
            return res.render('dashboard/index', {
                titulo: 'Dashboard',
                stats: { pacientes: 0, medicos: 0, consultas: 0, especialidades: 0 },
                statusConsultas: [],
                proximasConsultas: []
            });
        }
    }
};

module.exports = dashboardController;