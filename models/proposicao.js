// models/Proposicoes.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Definindo o modelo Proposicoes
const Proposicao = sequelize.define('Proposicoes', {
  proposicao_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: false,
  },
  proposicao_titulo: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  proposicao_sigla: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  proposicao_numero: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  proposicao_ano: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  proposicao_ementa: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  proposicao_apresentacao: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  proposicao_arquivada: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
}, {
  timestamps: false
});

// Definindo o modelo ProposicoesAutores
const ProposicoesAutores = sequelize.define('ProposicoesAutores', {
  proposicao_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Proposicao, // Nome do modelo
      key: 'proposicao_id' // Chave estrangeira
    }
  },
  proposicao_id_autor: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  proposicao_ano: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  proposicao_nome_autor: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  proposicao_partido_autor: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  proposicao_uf_autor: {
    type: DataTypes.CHAR(2),
    allowNull: true,
  },
  proposicao_assinatura: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  proposicao_proponente: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  timestamps: false,
  indexes: [
    {
      unique: false,
      fields: ['proposicao_id']
    }
  ]
});

// Definindo os relacionamentos
Proposicao.hasMany(ProposicoesAutores, {
  foreignKey: 'proposicao_id',
  sourceKey: 'proposicao_id',
  as: 'autores' // Nome da associação, pode ser usado em consultas
});

ProposicoesAutores.belongsTo(Proposicao, {
  foreignKey: 'proposicao_id',
  targetKey: 'proposicao_id',
  as: 'proposicao' // Nome da associação, pode ser usado em consultas
});

// Exportando os modelos
module.exports = {
  Proposicao,
  ProposicoesAutores,
};
