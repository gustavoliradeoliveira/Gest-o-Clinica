const  paciente = require("../config/db");

class pacientecontroller{
 static cadastrar(rewq, res){
    paciente.cadastrar(req.body, (erro)=> {
        if(erro){
            console.log(erro);
            return;
    }else{
            res.redirect("/pacientes");
    }
 });
 }
}
module.exports = controlerpaciente;