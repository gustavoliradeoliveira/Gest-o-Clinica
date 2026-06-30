const path = require('path');
const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const methodOverride = require('method-override');

const db = require('./config/database');
const { User, Note, Paciente } = require('./models');
const indexRoutes = require('./routes/indexRoutes');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const pacienteRoutes = require('./routes/pacienteRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.use(
  session({
    store: new SQLiteStore({ db: 'sessions.sqlite', dir: path.join(__dirname, '..', 'data') }),
    secret: 'meu-projeto-secreto',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2 },
  })
);

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.error = req.session.error || null;
  res.locals.success = req.session.success || null;
  delete req.session.error;
  delete req.session.success;
  next();
});

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/notes', noteRoutes);
app.use('/pacientes', pacienteRoutes);

app.use((req, res) => {
  res.status(404).render('404', { title: 'Página não encontrada' });
});

async function startServer(port) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
      resolve(server);
    });

    server.on('error', (error) => {
      reject(error);
    });
  });
}

async function start() {
  try {
    await db.sync();
    console.log('Conexão com o banco estabelecida.');

    const pacienteCount = await Paciente.count();
    if (pacienteCount === 0) {
      await Paciente.bulkCreate([
        { nome: 'Carlos Almeida', idade: 28, cpf: '11122233344', telefone: '44991234567' },
        { nome: 'Ana Souza', idade: 35, cpf: '55566677788', telefone: '44998765432' },
      ]);
      console.log('Pacientes iniciais criados.');
    }

    try {
      await startServer(PORT);
    } catch (error) {
      if (error.code === 'EADDRINUSE') {
        console.warn(`Porta ${PORT} ocupada. Tentando porta ${PORT + 1}...`);
        await startServer(PORT + 1);
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
  }
}

start();
