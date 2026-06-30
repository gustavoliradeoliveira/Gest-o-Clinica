const { Note } = require('../models');

exports.home = (req, res) => {
  res.render('index', { title: 'Home' });
};

exports.dashboard = async (req, res) => {
  const notes = await Note.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] });
  res.render('index', { title: 'Home', notes });
};
