const db = require("../database/connection");

class Especialidade {

    static listar(callback) {
        db.query("SELECT * FROM especialidades", callback);
    }

    static buscarPorId(id, callback) {
        db.query(
            "SELECT * FROM especialidades WHERE id = ?",
            [id],
            callback
        );
    }

    static criar(nome, descricao, callback) {
        db.query(
            "INSERT INTO especialidades (nome, descricao) VALUES (?, ?)",
            [nome, descricao],
            callback
        );
    }

    static atualizar(id, nome, descricao, callback) {
        db.query(
            "UPDATE especialidades SET nome=?, descricao=? WHERE id=?",
            [nome, descricao, id],
            callback
        );
    }

    static excluir(id, callback) {
        db.query(
            "DELETE FROM especialidades WHERE id=?",
            [id],
            callback
        );
    }
}

module.exports = Especialidade;