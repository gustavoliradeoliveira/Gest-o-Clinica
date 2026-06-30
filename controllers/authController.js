const bcrypt = require('bcrypt');
const { User } = require('../models');

exports.showLogin = (req, res) => {
  res.render('auth/login', { title: 'Login' });
};

exports.showRegister = (req, res) => {
  res.render('auth/register', { title: 'Registrar' });
};

exports.register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    req.session.error = 'Todos os campos são obrigatórios.';
    return res.redirect('/auth/register');
  }
  if (password !== confirmPassword) {
    req.session.error = 'As senhas não conferem.';
    return res.redirect('/auth/register');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await User.create({ name, email, password: hashedPassword });
    req.session.success = 'Cadastro realizado com sucesso. Faça login.';
    res.redirect('/auth/login');
  } catch (error) {
    req.session.error = 'Erro ao registrar usuário. Verifique os dados.';
    res.redirect('/auth/register');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    req.session.error = 'Email e senha são obrigatórios.';
    return res.redirect('/auth/login');
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    req.session.error = 'Credenciais inválidas.';
    return res.redirect('/auth/login');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    req.session.error = 'Credenciais inválidas.';
    return res.redirect('/auth/login');
  }

  req.session.user = { id: user.id, name: user.name, email: user.email };
  req.session.success = 'Login realizado com sucesso.';
  res.redirect('/');
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
};
