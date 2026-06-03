const pool = require('../db');

class Medico {
  static async findAll() {
    const result = await pool.query('SELECT * FROM medicos');
    return result.rows;
  }

  static async create(data) {
    const { nome, especialidade, crm, telefone, status } = data;
    await pool.query(
      'INSERT INTO medicos (nome, especialidade, crm, telefone, status) VALUES ($1, $2, $3, $4, $5)',
      [nome, especialidade, crm, telefone, status]
    );
  }

  static async update(id, data) {
    const { nome, especialidade, crm, telefone, status } = data;
    await pool.query(
      'UPDATE medicos SET nome=$1, especialidade=$2, crm=$3, telefone=$4, status=$5 WHERE id=$6',
      [nome, especialidade, crm, telefone, status, id]
    );
  }

  static async delete(id) {
    await pool.query('DELETE FROM medicos WHERE id=$1', [id]);
  }
}

module.exports = Medico;