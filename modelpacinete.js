const db = require("../config/db");

class pacient{
    static listar(callback){
        db.query(
            "SELECT * FROM paciente",
            callback
        );
}
}
class cadastrar{
    static cadastrar(dados, callbeck){
        db.query(
    "INSERT INTO paciente(nome, idade, cpf, telefone) value(?, ?, ?, ?)",
   [
    dados.cpf,
    dados.nome,
    dados.idade,
    dados.telefone,
   ],
    );
  }
}
