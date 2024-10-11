// controllers/pessoasTiposController.js

const PessoaTipo = require('../models/pessoas_tipos');

// Listar todos os tipos de pessoas
exports.getAllPessoasTipos = async (req, res) => {
  try {
    const pessoasTipos = await PessoaTipo.findAll();
    res.json(pessoasTipos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar um novo tipo de pessoa
exports.createPessoaTipo = async (req, res) => {
  try {
    const pessoaTipo = await PessoaTipo.create(req.body);
    res.json(pessoaTipo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar um tipo de pessoa por ID
exports.getPessoaTipoById = async (req, res) => {
  try {
    const pessoaTipo = await PessoaTipo.findByPk(req.params.id);
    if (pessoaTipo) {
      res.json(pessoaTipo);
    } else {
      res.status(404).json({ error: 'Tipo de pessoa não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar um tipo de pessoa por ID
exports.updatePessoaTipo = async (req, res) => {
  try {
    const pessoaTipo = await PessoaTipo.findByPk(req.params.id);
    if (pessoaTipo) {
      await pessoaTipo.update(req.body);
      res.json(pessoaTipo);
    } else {
      res.status(404).json({ error: 'Tipo de pessoa não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deletar um tipo de pessoa por ID
exports.deletePessoaTipo = async (req, res) => {
  try {
    const pessoaTipo = await PessoaTipo.findByPk(req.params.id);
    if (pessoaTipo) {
      await pessoaTipo.destroy();
      res.json({ message: 'Tipo de pessoa deletado com sucesso' });
    } else {
      res.status(404).json({ error: 'Tipo de pessoa não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
