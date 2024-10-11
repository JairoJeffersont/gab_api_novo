// models/Usuario.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  usuario_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  usuario_nome: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  usuario_email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  usuario_telefone: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  usuario_senha: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  usuario_nivel: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  usuario_ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true, // Assume que o usuário é ativo por padrão
  },
  usuario_aniversario: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  usuario_foto: {
    type: DataTypes.STRING(255),
    defaultValue: null, // Pode ser útil para iniciar com uma foto padrão
  },
  // Os timestamps são geridos automaticamente pelo Sequelize
}, {
  // Configurações para timestamps automáticos
  timestamps: true,
  createdAt: 'usuario_criado_em',
  updatedAt: 'usuario_atualizado_em',
});

// Exporta o modelo
module.exports = Usuario;
