const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

const especialidadeRoutes = require("./src/routes/especialidadeRoutes");

app.use("/especialidades", especialidadeRoutes);

app.get("/", (req, res) => {
    res.redirect("/especialidades");
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});