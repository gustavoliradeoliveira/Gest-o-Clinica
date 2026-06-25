'use strict';

const { query } = require('./db');

class Paciente {
    static async listar({ pagina = 1, limite = 10, busca = '' } = {}) {
        const offset = (pagina - 1) * limite;
        const param  = `%${busca}%`;

        const [rows, count] = await Promise.all([
            query(
                `SELECT * FROM pacientes
                  WHERE nome ILIKE $1 OR cpf ILIKE $1
                  ORDER BY nome
                  LIMIT $2 OFFSET $3`,
                [param, limite, offset]
            ),
            query(
                `SELECT COUNT(*) FROM pacientes WHERE nome ILIKE $1 OR cpf ILIKE $1`,
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
        const res = await query('SELECT * FROM pacientes WHERE id = $1', [id]);
        return res.rows[0] || null;
    }

    static async buscarTodos() {
        const res = await query(
            'SELECT id, nome, cpf FROM pacientes WHERE ativo = true ORDER BY nome'
        );
        return res.rows;
    }

    static async criar({ nome, cpf, data_nasc, telefone, email, endereco }) {
        const res = await query(
            `INSERT INTO pacientes (nome, cpf, data_nasc, telefone, email, endereco)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [nome, cpf, data_nasc, telefone || null, email || null, endereco || null]
        );
        return res.rows[0];
    }

    static async atualizar(id, { nome, cpf, data_nasc, telefone, email, endereco, ativo }) {
        const res = await query(
            `UPDATE pacientes
                SET nome = $1, cpf = $2, data_nasc = $3, telefone = $4,
                    email = $5, endereco = $6, ativo = $7,
                    atualizado_em = CURRENT_TIMESTAMP
              WHERE id = $8 RETURNING *`,
            [nome, cpf, data_nasc, telefone || null, email || null, endereco || null, ativo, id]
        );
        return res.rows[0];
    }

    static async deletar(id) {
        await query('DELETE FROM pacientes WHERE id = $1', [id]);
    }
}

module.exports = Paciente;