const { Paciente } = require('../models');
const { Op } = require('sequelize');

exports.list = async (req, res) => {
  const busca = req.query.busca ? String(req.query.busca).trim() : '';
  const where = busca
    ? {
        [Op.or]: [
          { nome: { [Op.like]: `%${busca}%` } },
          { cpf: { [Op.like]: `%${busca}%` } },
        ],
      }
    : undefined;

  const registros = await Paciente.findAll({ where, order: [['nome', 'ASC']] });
  const total = registros.length;
  const usuario = {
    permissoes: {
      pacientes: {
        criar: true,
        editar: true,
        deletar: true,
      },
    },
  };

  res.render('pacientes/index', {
    title: 'Pacientes',
    registros,
    total,
    busca,
    usuario,
  });
};

exports.showCreate = (req, res) => {
  res.render('pacientes/create', { title: 'Novo paciente', erros: [], dados: {} });
};

exports.create = async (req, res) => {
  const { nome, data_nasc, cpf, telefone, email, endereco, ativo } = req.body;
  const erros = [];

  if (!nome) erros.push({ msg: 'Nome é obrigatório.' });
  if (!data_nasc) erros.push({ msg: 'Data de nascimento é obrigatória.' });
  if (!cpf) erros.push({ msg: 'CPF é obrigatório.' });

  if (email && email.trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    erros.push({ msg: 'E-mail inválido.' });
  }

  if (erros.length) {
    return res.render('pacientes/create', {
      title: 'Novo paciente',
      erros,
      dados: { nome, data_nasc, cpf, telefone, email, endereco, ativo },
    });
  }

  await Paciente.create({ nome, data_nasc: data_nasc || null, cpf, telefone, email: email && email.trim() !== '' ? email : null, endereco, ativo: ativo !== 'false' });
  req.session.success = 'Paciente criado com sucesso.';
  res.redirect('/pacientes');
};

exports.showEdit = async (req, res) => {
  const paciente = await Paciente.findByPk(req.params.id);
  if (!paciente) return res.redirect('/pacientes');
  res.render('pacientes/edit', { title: 'Editar paciente', paciente, erros: [] });
};

exports.update = async (req, res) => {
  const paciente = await Paciente.findByPk(req.params.id);
  if (!paciente) return res.redirect('/pacientes');

  const { nome, data_nasc, cpf, telefone, email, endereco, ativo } = req.body;
  const erros = [];

  if (!nome) erros.push({ msg: 'Nome é obrigatório.' });
  if (!data_nasc) erros.push({ msg: 'Data de nascimento é obrigatória.' });
  if (!cpf) erros.push({ msg: 'CPF é obrigatório.' });

  if (email && email.trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    erros.push({ msg: 'E-mail inválido.' });
  }

  if (erros.length) {
    return res.render('pacientes/edit', {
      title: 'Editar paciente',
      paciente: { ...paciente.toJSON(), nome, data_nasc, cpf, telefone, email, endereco, ativo: ativo !== 'false' },
      erros,
    });
  }

  await paciente.update({ nome, data_nasc: data_nasc || null, cpf, telefone, email: email && email.trim() !== '' ? email : null, endereco, ativo: ativo !== 'false' });
  req.session.success = 'Paciente atualizado com sucesso.';
  res.redirect('/pacientes');
};

exports.delete = async (req, res) => {
  const paciente = await Paciente.findByPk(req.params.id);
  if (paciente) {
    await paciente.destroy();
    req.session.success = 'Paciente excluído com sucesso.';
  }
  res.redirect('/pacientes');
};
