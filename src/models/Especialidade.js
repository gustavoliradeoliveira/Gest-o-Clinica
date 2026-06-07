'use strict';

const { query } = require('./db');

class Especialidade {
    static async listar({ pagina = 1, limite = 10, busca = '' } = {}) {
        const offset = (pagina - 1) * limite;
        const param  = `%${busca}%`;

        const [rows, count] = await Promise.all([
            query(
                `SELECT * FROM especialidades
                  WHERE nome ILIKE $1
                  ORDER BY nome
                  LIMIT $2 OFFSET $3`,
                [param, limite, offset]
            ),
            query(
                `SELECT COUNT(*) FROM especialidades WHERE nome ILIKE $1`,
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
        const res = await query('SELECT * FROM especialidades WHERE id = $1', [id]);
        return res.rows[0] || null;
    }

    static async buscarTodas() {
        const res = await query(
            'SELECT id, nome FROM especialidades WHERE ativo = true ORDER BY nome'
        );
        return res.rows;
    }

    static async criar({ nome, descricao }) {
        const res = await query(
            `INSERT INTO especialidades (nome, descricao) VALUES ($1, $2) RETURNING *`,
            [nome, descricao || null]
        );
        return res.rows[0];
    }

    static async atualizar(id, { nome, descricao, ativo }) {
        const res = await query(
            `UPDATE especialidades
                SET nome = $1, descricao = $2, ativo = $3,
                    atualizado_em = CURRENT_TIMESTAMP
              WHERE id = $4 RETURNING *`,
            [nome, descricao || null, ativo, id]
        );
        return res.rows[0];
    }

    static async deletar(id) {
        await query('DELETE FROM especialidades WHERE id = $1', [id]);
    }
}

module.exports = Especialidade;