// controllers/pessoasController.js

const Pessoa = require('../models/pessoas');

// Listar todas as pessoas
exports.getAllPessoas = async (req, res) => {
  try {
    const pessoas = await Pessoa.findAll();
    res.json(pessoas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar uma nova pessoa
exports.createPessoa = async (req, res) => {
  try {
    const pessoa = await Pessoa.create(req.body);
    res.json(pessoa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar uma pessoa por ID
exports.getPessoaById = async (req, res) => {
  try {
    const pessoa = await Pessoa.findByPk(req.params.id);
    if (pessoa) {
      res.json(pessoa);
    } else {
      res.status(404).json({ error: 'Pessoa não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar uma pessoa por ID
exports.updatePessoa = async (req, res) => {
  try {
    const pessoa = await Pessoa.findByPk(req.params.id);
    if (pessoa) {
      await pessoa.update(req.body);
      res.json(pessoa);
    } else {
      res.status(404).json({ error: 'Pessoa não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deletar uma pessoa por ID
exports.deletePessoa = async (req, res) => {
  try {
    const pessoa = await Pessoa.findByPk(req.params.id);
    if (pessoa) {
      await pessoa.destroy();
      res.json({ message: 'Pessoa deletada com sucesso' });
    } else {
      res.status(404).json({ error: 'Pessoa não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
