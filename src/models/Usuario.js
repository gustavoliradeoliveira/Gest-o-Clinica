'use strict';

const { query } = require('./db');
const bcrypt = require('bcryptjs');

class Usuario {
    static async listar({ pagina = 1, limite = 10, busca = '' } = {}) {
        const offset = (pagina - 1) * limite;
        const param  = `%${busca}%`;

        const [rows, count] = await Promise.all([
            query(
                `SELECT u.id, u.nome, u.email, u.ativo, u.criado_em,
                        p.nome AS perfil_nome
                   FROM usuarios u
                   JOIN perfis p ON p.id = u.perfil_id
                  WHERE u.nome ILIKE $1 OR u.email ILIKE $1
                  ORDER BY u.nome
                  LIMIT $2 OFFSET $3`,
                [param, limite, offset]
            ),
            query(
                `SELECT COUNT(*) FROM usuarios u
                  WHERE u.nome ILIKE $1 OR u.email ILIKE $1`,
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
            `SELECT u.*, p.nome AS perfil_nome, p.permissoes
               FROM usuarios u
               JOIN perfis p ON p.id = u.perfil_id
              WHERE u.id = $1`,
            [id]
        );
        return res.rows[0] || null;
    }

    static async buscarPorEmail(email) {
        const res = await query(
            `SELECT u.*, p.permissoes, p.nome AS perfil_nome
               FROM usuarios u
               JOIN perfis p ON p.id = u.perfil_id
              WHERE u.email = $1 AND u.ativo = true`,
            [email]
        );
        return res.rows[0] || null;
    }

    static async criar({ nome, email, senha, perfil_id }) {
        const hash = await bcrypt.hash(senha, 10);
        const res = await query(
            `INSERT INTO usuarios (nome, email, senha, perfil_id)
             VALUES ($1, $2, $3, $4)
             RETURNING id, nome, email, perfil_id, ativo, criado_em`,
            [nome, email, hash, perfil_id]
        );
        return res.rows[0];
    }

    static async atualizar(id, { nome, email, perfil_id, ativo, senha }) {
        if (senha && senha.trim()) {
            const hash = await bcrypt.hash(senha, 10);
            const res = await query(
                `UPDATE usuarios
                    SET nome = $1, email = $2, perfil_id = $3, ativo = $4,
                        senha = $5, atualizado_em = CURRENT_TIMESTAMP
                  WHERE id = $6
              RETURNING id, nome, email, perfil_id, ativo`,
                [nome, email, perfil_id, ativo, hash, id]
            );
            return res.rows[0];
        }

        const res = await query(
            `UPDATE usuarios
                SET nome = $1, email = $2, perfil_id = $3, ativo = $4,
                    atualizado_em = CURRENT_TIMESTAMP
              WHERE id = $5
          RETURNING id, nome, email, perfil_id, ativo`,
            [nome, email, perfil_id, ativo, id]
        );
        return res.rows[0];
    }

    static async deletar(id) {
        await query('DELETE FROM usuarios WHERE id = $1', [id]);
    }

    static async verificarSenha(senhaPlana, senhaHash) {
        return bcrypt.compare(senhaPlana, senhaHash);
    }
}

module.exports = Usuario;
