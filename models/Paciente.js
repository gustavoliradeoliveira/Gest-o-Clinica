const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Paciente = db.define('Paciente', {
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  idade: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  data_nasc: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  cpf: {
    type: DataTypes.STRING(14),
    allowNull: true,
  },
  telefone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(120),
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  endereco: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

module.exports = Paciente;
