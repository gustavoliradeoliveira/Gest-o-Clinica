const Medico = require('../models/Medico');

exports.listMedicos = async (req, res) => {
  const medicos = await Medico.findAll();
  res.render('medicos/index', { medicos });
};

exports.createMedico = async (req, res) => {
  await Medico.create(req.body);
  res.redirect('/medicos');
};

exports.updateMedico = async (req, res) => {
  await Medico.update(req.params.id, req.body);
  res.redirect('/medicos');
};

exports.deleteMedico = async (req, res) => {
  await Medico.delete(req.params.id);
  res.redirect('/medicos');
};