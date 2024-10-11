// models/postagens.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./usuarios');
const PostagemStatus = require('./postagem_status');

const Postagem = sequelize.define('Postagem', {
  postagem_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  postagem_titulo: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  postagem_data: {
    type: DataTypes.DATE,
    allowNull: true
  },
  postagem_pasta: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  postagem_informacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  postagem_midias: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  postagem_status: {
    type: DataTypes.INTEGER,
    references: {
      model: PostagemStatus,
      key: 'postagem_status_id'
    }
  },
  postagem_criada_por: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'usuario_id'
    }
  },
  postagem_criada_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  postagem_atualizada_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  createdAt: 'postagem_criada_em',
  updatedAt: 'postagem_atualizada_em'
});

module.exports = Postagem;
