const especialidadeController = {
    async index(req, res) {
        try {
            const pagina = parseInt(req.query.pagina) || 1;
            const busca  = req.query.busca || '';
            const dados  = await Especialidade.listar({ pagina, busca });
            res.render('especialidades/index', {
                titulo: 'Especialidades', ...dados, busca
            });
        } catch (err) {
            req.flash('erro', 'Erro ao listar especialidades.');
            res.redirect('/dashboard');
        }
    },

    exibirCriar(req, res) {
        res.render('especialidades/create', { titulo: 'Nova Especialidade', erros: [] });
    },

    async criar(req, res) {
        const { nome, descricao } = req.body;
        if (!nome || !nome.trim()) {
            return res.render('especialidades/create', {
                titulo: 'Nova Especialidade',
                erros: [{ msg: 'Nome é obrigatório.' }]
            });
        }
        try {
            await Especialidade.criar({ nome: nome.trim(), descricao });
            req.flash('sucesso', 'Especialidade criada com sucesso!');
            res.redirect('/especialidades');
        } catch (err) {
            const msg = err.code === '23505' ? 'Já existe uma especialidade com este nome.' : 'Erro ao criar especialidade.';
            return res.render('especialidades/create', {
                titulo: 'Nova Especialidade', erros: [{ msg }]
            });
        }
    },

    async exibirEditar(req, res) {
        try {
            const especialidade = await Especialidade.buscarPorId(req.params.id);
            if (!especialidade) { req.flash('erro', 'Especialidade não encontrada.'); return res.redirect('/especialidades'); }
            res.render('especialidades/edit', { titulo: 'Editar Especialidade', especialidade, erros: [] });
        } catch (err) {
            req.flash('erro', 'Erro ao carregar especialidade.');
            res.redirect('/especialidades');
        }
    },

    async atualizar(req, res) {
        const { nome, descricao, ativo } = req.body;
        if (!nome || !nome.trim()) {
            const especialidade = await Especialidade.buscarPorId(req.params.id);
            return res.render('especialidades/edit', {
                titulo: 'Editar Especialidade', especialidade,
                erros: [{ msg: 'Nome é obrigatório.' }]
            });
        }
        try {
            await Especialidade.atualizar(req.params.id, {
                nome: nome.trim(), descricao, ativo: ativo === 'true'
            });
            req.flash('sucesso', 'Especialidade atualizada com sucesso!');
            res.redirect('/especialidades');
        } catch (err) {
            const msg = err.code === '23505' ? 'Já existe uma especialidade com este nome.' : 'Erro ao atualizar.';
            req.flash('erro', msg);
            res.redirect(`/especialidades/${req.params.id}/editar`);
        }
    },

    async deletar(req, res) {
        try {
            await Especialidade.deletar(req.params.id);
            req.flash('sucesso', 'Especialidade removida com sucesso!');
        } catch (err) {
            const msg = err.code === '23503'
                ? 'Não é possível remover: existem médicos vinculados a esta especialidade.'
                : 'Erro ao remover especialidade.';
            req.flash('erro', msg);
        }
        res.redirect('/especialidades');
    }
};

module.exports = especialidadeController;