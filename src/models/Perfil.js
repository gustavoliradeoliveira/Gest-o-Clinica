'use strict';

const { query } = require('./db');

class Perfil {
    // -------------------------
    // LISTAGEM COM PAGINAÇÃO
    // -------------------------
    static async listar({ pagina = 1, limite = 10, busca = '' } = {}) {
        const offset = (pagina - 1) * limite;
        const params = [`%${busca}%`, limite, offset];

        const [rows, count] = await Promise.all([
            query(
                `SELECT id, nome, descricao, ativo, criado_em
                   FROM perfis
                  WHERE nome ILIKE $1
                  ORDER BY nome
                  LIMIT $2 OFFSET $3`,
                params
            ),
            query(
                `SELECT COUNT(*) FROM perfis WHERE nome ILIKE $1`,
                [`%${busca}%`]
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
        const res = await query('SELECT * FROM perfis WHERE id = $1', [id]);
        return res.rows[0] || null;
    }

    static async buscarTodos() {
        const res = await query('SELECT id, nome FROM perfis WHERE ativo = true ORDER BY nome');
        return res.rows;
    }

    static async criar({ nome, descricao, permissoes }) {
        const res = await query(
            `INSERT INTO perfis (nome, descricao, permissoes)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [nome, descricao || null, JSON.stringify(permissoes)]
        );
        return res.rows[0];
    }

    static async atualizar(id, { nome, descricao, permissoes, ativo }) {
        const res = await query(
            `UPDATE perfis
                SET nome = $1, descricao = $2, permissoes = $3, ativo = $4,
                    atualizado_em = CURRENT_TIMESTAMP
              WHERE id = $5
          RETURNING *`,
            [nome, descricao || null, JSON.stringify(permissoes), ativo, id]
        );
        return res.rows[0];
    }

    static async deletar(id) {
        await query('DELETE FROM perfis WHERE id = $1', [id]);
    }
}

module.exports = Perfil;
