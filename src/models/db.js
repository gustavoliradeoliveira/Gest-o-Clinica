'use strict';

const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'gestao_clinica',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '2006',
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});

pool.on('error', (err) => {
    console.error('[DB] Erro inesperado no pool:', err.message);
});

/**
 * Executa uma query parametrizada no banco.
 * @param {string} text  - SQL com placeholders $1, $2...
 * @param {Array}  params - Valores dos parâmetros
 * @returns {Promise<import('pg').QueryResult>}
 */
async function query(text, params) {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
        console.log(`[DB] query=${text.substring(0, 80)}... duration=${duration}ms rows=${res.rowCount}`);
    }
    return res;
}

module.exports = { pool, query };
