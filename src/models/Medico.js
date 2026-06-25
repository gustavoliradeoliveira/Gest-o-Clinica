'use strict';

const { query } = require('./db');

class Medico {
    static async listar({ pagina = 1, limite = 10, busca = '' } = {}) {
        const offset = (pagina - 1) * limite;
        const param  = `%${busca}%`;

        const [rows, count] = await Promise.all([
            query(
                `SELECT m.id, m.nome, m.crm, m.telefone, m.email, m.ativo, m.criado_em,
                        e.nome AS especialidade_nome
                   FROM medicos m
                   LEFT JOIN especialidades e ON e.id = m.especialidade_id
                  WHERE m.nome ILIKE $1 OR m.crm ILIKE $1
                  ORDER BY m.nome
                  LIMIT $2 OFFSET $3`,
                [param, limite, offset]
            ),
            query(
                `SELECT COUNT(*) FROM medicos m
                  WHERE m.nome ILIKE $1 OR m.crm ILIKE $1`,
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
            `SELECT m.*, e.nome AS especialidade_nome
               FROM medicos m
               LEFT JOIN especialidades e ON e.id = m.especialidade_id
              WHERE m.id = $1`,
            [id]
        );
        return res.rows[0] || null;
    }

    static async buscarTodos() {
        const res = await query(
            'SELECT id, nome, crm FROM medicos WHERE ativo = true ORDER BY nome'
        );
        return res.rows;
    }

    static async criar({ nome, crm, telefone, email, especialidade_id }) {
        const res = await query(
            `INSERT INTO medicos (nome, crm, telefone, email, especialidade_id)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [nome, crm, telefone || null, email || null, especialidade_id || null]
        );
        return res.rows[0];
    }

    static async atualizar(id, { nome, crm, telefone, email, especialidade_id, ativo }) {
        const res = await query(
            `UPDATE medicos
                SET nome = $1, crm = $2, telefone = $3, email = $4,
                    especialidade_id = $5, ativo = $6,
                    atualizado_em = CURRENT_TIMESTAMP
              WHERE id = $7 RETURNING *`,
            [nome, crm, telefone || null, email || null, especialidade_id || null, ativo, id]
        );
        return res.rows[0];
    }

    static async deletar(id) {
        await query('DELETE FROM medicos WHERE id = $1', [id]);
    }
}

module.exports = Medico;