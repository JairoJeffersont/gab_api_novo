// models/oficios.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./usuarios');
const Orgao = require('./orgaos');

const Oficio = sequelize.define('Oficio', {
  oficio_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  oficio_titulo: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  oficio_resumo: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  oficio_arquivo: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  oficio_ano: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  oficio_orgao: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Orgao,
      key: 'orgao_id'
    }
  },
  oficio_criado_por: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'usuario_id'
    }
  },
  oficio_criado_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  oficio_atualizado_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  createdAt: 'oficio_criado_em',
  updatedAt: 'oficio_atualizado_em'
});

module.exports = Oficio;
