'use strict';

const { query } = require('./db');

class Prontuario {
    static async listar({ pagina = 1, limite = 10, busca = '' } = {}) {
        const offset = (pagina - 1) * limite;
        const param  = `%${busca}%`;

        const [rows, count] = await Promise.all([
            query(
                `SELECT pr.id, pr.descricao, pr.diagnostico, pr.criado_em,
                        p.nome  AS paciente_nome,
                        m.nome  AS medico_nome,
                        c.data_hora, c.id AS consulta_id
                   FROM prontuarios pr
                   JOIN consultas c ON c.id = pr.consulta_id
                   JOIN pacientes p ON p.id = c.paciente_id
                   JOIN medicos   m ON m.id = c.medico_id
                  WHERE p.nome ILIKE $1 OR m.nome ILIKE $1
                  ORDER BY pr.criado_em DESC
                  LIMIT $2 OFFSET $3`,
                [param, limite, offset]
            ),
            query(
                `SELECT COUNT(*) FROM prontuarios pr
                   JOIN consultas c ON c.id = pr.consulta_id
                   JOIN pacientes p ON p.id = c.paciente_id
                   JOIN medicos   m ON m.id = c.medico_id
                  WHERE p.nome ILIKE $1 OR m.nome ILIKE $1`,
                [param]
            )
        ]);

        return {
            registros: rows.rows,
            total: parseInt(count.rows[0].count),
            pagina,
            limite,
            totalPaginas: Math.ceil(parseInt(count.rows[0].count) / limite)
        };
    }

    static async buscarPorId(id) {
        const res = await query(
            `SELECT pr.*,
                    p.nome  AS paciente_nome,
                    m.nome  AS medico_nome,
                    c.data_hora, c.status AS consulta_status
               FROM prontuarios pr
               JOIN consultas c ON c.id = pr.consulta_id
               JOIN pacientes p ON p.id = c.paciente_id
               JOIN medicos   m ON m.id = c.medico_id
              WHERE pr.id = $1`,
            [id]
        );
        return res.rows[0] || null;
    }

    static async buscarPorConsulta(consulta_id) {
        const res = await query(
            'SELECT * FROM prontuarios WHERE consulta_id = $1',
            [consulta_id]
        );
        return res.rows[0] || null;
    }

    static async criar({ consulta_id, descricao, diagnostico, prescricao }) {
        const res = await query(
            `INSERT INTO prontuarios (consulta_id, descricao, diagnostico, prescricao)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [consulta_id, descricao, diagnostico || null, prescricao || null]
        );
        return res.rows[0];
    }

    static async atualizar(id, { consulta_id, descricao, diagnostico, prescricao }) {
        const res = await query(
            `UPDATE prontuarios
                SET consulta_id = $1, descricao = $2, diagnostico = $3,
                    prescricao = $4, atualizado_em = CURRENT_TIMESTAMP
              WHERE id = $5 RETURNING *`,
            [consulta_id, descricao, diagnostico || null, prescricao || null, id]
        );
        return res.rows[0];
    }

    static async deletar(id) {
        await query('DELETE FROM prontuarios WHERE id = $1', [id]);
    }
}

module.exports = Prontuario;