const express = require("express");
const router = express.Router();

const especialidadeController =
    require("../controllers/especialidadeController");

router.get(
    "/",
    especialidadeController.listar
);

router.get(
    "/novo",
    especialidadeController.formNovo
);

router.post(
    "/novo",
    especialidadeController.criar
);

router.get(
    "/editar/:id",
    especialidadeController.formEditar
);

router.post(
    "/editar/:id",
    especialidadeController.atualizar
);

router.get(
    "/excluir/:id",
    especialidadeController.excluir
);

module.exports = router;