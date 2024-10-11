// models/postagem_status.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./usuarios');

const PostagemStatus = sequelize.define('PostagemStatus', {
  postagem_status_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  postagem_status_nome: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  postagem_status_descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  postagem_status_criado_por: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'usuario_id'
    }
  },
  postagem_status_criado_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  postagem_status_atualizada_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  createdAt: 'postagem_status_criado_em',
  updatedAt: 'postagem_status_atualizada_em'
});

module.exports = PostagemStatus;
