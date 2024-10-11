// models/pessoas.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./usuarios');
const PessoaTipo = require('./pessoas_tipos');
const PessoaProfissao = require('./pessoas_profissoes');
const Orgao = require('./orgaos');

const Pessoa = sequelize.define('Pessoa', {
  pessoa_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  pessoa_nome: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  pessoa_aniversario: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  pessoa_email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  pessoa_telefone: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  pessoa_endereco: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  pessoa_bairro: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  pessoa_municipio: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  pessoa_estado: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  pessoa_cep: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  pessoa_sexo: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  pessoa_facebook: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  pessoa_instagram: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  pessoa_x: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  pessoa_informacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  pessoa_profissao: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PessoaProfissao,
      key: 'pessoas_profissoes_id'
    }
  },
  pessoa_cargo: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  pessoa_tipo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PessoaTipo,
      key: 'pessoa_tipo_id'
    }
  },
  pessoa_orgao: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Orgao,
      key: 'orgao_id'
    }
  },
  pessoa_foto: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  pessoa_criada_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  pessoa_atualizada_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  pessoa_criada_por: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'usuario_id'
    }
  }
}, {
  timestamps: true,
  createdAt: 'pessoa_criada_em',
  updatedAt: 'pessoa_atualizada_em'
});

module.exports = Pessoa;
