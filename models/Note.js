const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Note = db.define('Note', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = Note;
