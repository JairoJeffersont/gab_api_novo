// models/PessoasProfissoes.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ajuste o caminho conforme necessário

const PessoasProfissoes = sequelize.define('PessoasProfissoes', {
    pessoas_profissoes_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    pessoas_profissoes_nome: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    pessoas_profissoes_descricao: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    pessoas_profissoes_criado_em: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    pessoas_profissoes_criado_por: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'PessoasProfissoes',
    timestamps: true,
    createdAt: 'pessoas_profissoes_criado_em',
    updatedAt: 'pessoas_profissoes_atualizado_em',
});

module.exports = PessoasProfissoes;
