// controllers/orgaosController.js

const Orgao = require('../models/orgaos');

// Listar todos os órgãos
exports.getAllOrgaos = async (req, res) => {
  try {
    const orgaos = await Orgao.findAll();
    res.json(orgaos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar um novo órgão
exports.createOrgao = async (req, res) => {
  try {
    const orgao = await Orgao.create(req.body);
    res.json(orgao);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar um órgão por ID
exports.getOrgaoById = async (req, res) => {
  try {
    const orgao = await Orgao.findByPk(req.params.id);
    if (orgao) {
      res.json(orgao);
    } else {
      res.status(404).json({ error: 'Órgão não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar um órgão por ID
exports.updateOrgao = async (req, res) => {
  try {
    const orgao = await Orgao.findByPk(req.params.id);
    if (orgao) {
      await orgao.update(req.body);
      res.json(orgao);
    } else {
      res.status(404).json({ error: 'Órgão não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deletar um órgão por ID
exports.deleteOrgao = async (req, res) => {
  try {
    const orgao = await Orgao.findByPk(req.params.id);
    if (orgao) {
      await orgao.destroy();
      res.json({ message: 'Órgão deletado com sucesso' });
    } else {
      res.status(404).json({ error: 'Órgão não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
