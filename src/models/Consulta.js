'use strict';

const { query } = require('./db');

class Consulta {
    static async listar({ pagina = 1, limite = 10, busca = '' } = {}) {
        const offset = (pagina - 1) * limite;
        const param  = `%${busca}%`;

        const [rows, count] = await Promise.all([
            query(
                `SELECT c.id, c.data_hora, c.status, c.observacoes, c.criado_em,
                        p.nome AS paciente_nome,
                        m.nome AS medico_nome,
                        e.nome AS especialidade_nome
                   FROM consultas c
                   JOIN pacientes p ON p.id = c.paciente_id
                   JOIN medicos   m ON m.id = c.medico_id
                   LEFT JOIN especialidades e ON e.id = m.especialidade_id
                  WHERE p.nome ILIKE $1 OR m.nome ILIKE $1
                  ORDER BY c.data_hora DESC
                  LIMIT $2 OFFSET $3`,
                [param, limite, offset]
            ),
            query(
                `SELECT COUNT(*) FROM consultas c
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
            `SELECT c.*,
                    p.nome AS paciente_nome,
                    m.nome AS medico_nome,
                    e.nome AS especialidade_nome
               FROM consultas c
               JOIN pacientes p ON p.id = c.paciente_id
               JOIN medicos   m ON m.id = c.medico_id
               LEFT JOIN especialidades e ON e.id = m.especialidade_id
              WHERE c.id = $1`,
            [id]
        );
        return res.rows[0] || null;
    }

    static async criar({ paciente_id, medico_id, data_hora, status, observacoes }) {
        const res = await query(
            `INSERT INTO consultas (paciente_id, medico_id, data_hora, status, observacoes)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [paciente_id, medico_id, data_hora, status || 'agendada', observacoes || null]
        );
        return res.rows[0];
    }

    static async atualizar(id, { paciente_id, medico_id, data_hora, status, observacoes }) {
        const res = await query(
            `UPDATE consultas
                SET paciente_id = $1, medico_id = $2, data_hora = $3,
                    status = $4, observacoes = $5,
                    atualizado_em = CURRENT_TIMESTAMP
              WHERE id = $6 RETURNING *`,
            [paciente_id, medico_id, data_hora, status, observacoes || null, id]
        );
        return res.rows[0];
    }

    static async deletar(id) {
        await query('DELETE FROM consultas WHERE id = $1', [id]);
    }

    static async contarPorStatus() {
        const res = await query(
            `SELECT status, COUNT(*) AS total FROM consultas GROUP BY status`
        );
        return res.rows;
    }
}

module.exports = Consulta;