const Especialidade = require("../models/Especialidade");

exports.listar = (req, res) => {
    Especialidade.listar((err, resultados) => {
        res.render("especialidades/listar", {
            especialidades: resultados
        });
    });
};

exports.formNovo = (req, res) => {
    res.render("especialidades/cadastrar");
};

exports.criar = (req, res) => {

    const { nome, descricao } = req.body;

    Especialidade.criar(
        nome,
        descricao,
        () => {
            res.redirect("/especialidades");
        }
    );
};

exports.formEditar = (req, res) => {

    Especialidade.buscarPorId(
        req.params.id,
        (err, resultado) => {

            res.render(
                "especialidades/editar",
                {
                    especialidade: resultado[0]
                }
            );
        }
    );
};

exports.atualizar = (req, res) => {

    const { nome, descricao } = req.body;

    Especialidade.atualizar(
        req.params.id,
        nome,
        descricao,
        () => {
            res.redirect("/especialidades");
        }
    );
};

exports.excluir = (req, res) => {

    Especialidade.excluir(
        req.params.id,
        () => {
            res.redirect("/especialidades");
        }
    );
};