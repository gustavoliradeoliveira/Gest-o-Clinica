exports.ensureAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;
    return next();
  }
  req.session.error = 'É necessário fazer login para acessar esta página.';
  res.redirect('/auth/login');
};

exports.guestOnly = (req, res, next) => {
  if (req.session && req.session.user) {
    return res.redirect('/');
  }
  next();
};
