// models/orgaos.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./usuarios');
const OrgaoTipo = require('./orgaos_tipos');

const Orgao = sequelize.define('Orgao', {
  orgao_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  orgao_nome: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  orgao_email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  orgao_telefone: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  orgao_endereco: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  orgao_bairro: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  orgao_municipio: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  orgao_estado: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  orgao_cep: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  orgao_tipo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: OrgaoTipo,
      key: 'orgao_tipo_id',
    },
  },
  orgao_informacoes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  orgao_site: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  orgao_criado_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  orgao_atualizado_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  orgao_criado_por: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'usuario_id',
    },
  },
}, {
  timestamps: true,
  createdAt: 'orgao_criado_em',
  updatedAt: 'orgao_atualizado_em',
});

module.exports = Orgao;
