const { Note } = require('../models');

exports.list = async (req, res) => {
  try {
    const notes = await Note.findAll({ where: { userId: req.session.user.id } });
    res.render('notes/index', { title: 'Minhas Notas', notes });
  } catch (error) {
    console.error('Erro ao listar notas:', error);
    req.session.error = 'Erro ao carregar notas.';
    res.redirect('/');
  }
};

exports.showCreate = (req, res) => {
  res.render('notes/create', { title: 'Criar Nota' });
};

exports.create = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    req.session.error = 'Título e conteúdo são obrigatórios.';
    return res.redirect('/notes/new');
  }

  try {
    await Note.create({ title, content, userId: req.session.user.id });
    req.session.success = 'Nota criada com sucesso.';
    res.redirect('/notes');
  } catch (error) {
    console.error('Erro ao criar nota:', error);
    req.session.error = 'Erro ao criar nota.';
    res.redirect('/notes/new');
  }
};

exports.showEdit = async (req, res) => {
  const { id } = req.params;

  try {
    const note = await Note.findOne({ where: { id, userId: req.session.user.id } });
    if (!note) {
      req.session.error = 'Nota não encontrada.';
      return res.redirect('/notes');
    }
    res.render('notes/edit', { title: 'Editar Nota', note });
  } catch (error) {
    console.error('Erro ao carregar nota:', error);
    req.session.error = 'Erro ao carregar nota.';
    res.redirect('/notes');
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title || !content) {
    req.session.error = 'Título e conteúdo são obrigatórios.';
    return res.redirect(`/notes/${id}/edit`);
  }

  try {
    const note = await Note.findOne({ where: { id, userId: req.session.user.id } });
    if (!note) {
      req.session.error = 'Nota não encontrada.';
      return res.redirect('/notes');
    }
    await note.update({ title, content });
    req.session.success = 'Nota atualizada com sucesso.';
    res.redirect('/notes');
  } catch (error) {
    console.error('Erro ao atualizar nota:', error);
    req.session.error = 'Erro ao atualizar nota.';
    res.redirect(`/notes/${id}/edit`);
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    const note = await Note.findOne({ where: { id, userId: req.session.user.id } });
    if (!note) {
      req.session.error = 'Nota não encontrada.';
      return res.redirect('/notes');
    }
    await note.destroy();
    req.session.success = 'Nota deletada com sucesso.';
    res.redirect('/notes');
  } catch (error) {
    console.error('Erro ao deletar nota:', error);
    req.session.error = 'Erro ao deletar nota.';
    res.redirect('/notes');
  }
};
