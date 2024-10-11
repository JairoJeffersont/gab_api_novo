// controllers/orgaosTiposController.js

const OrgaoTipo = require('../models/orgaos_tipos');

// Listar todos os tipos de órgãos
exports.getAllOrgaosTipos = async (req, res) => {
  try {
    const orgaosTipos = await OrgaoTipo.findAll();
    res.json(orgaosTipos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar um novo tipo de órgão
exports.createOrgaoTipo = async (req, res) => {
  try {
    const orgaoTipo = await OrgaoTipo.create(req.body);
    res.json(orgaoTipo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar um tipo de órgão por ID
exports.getOrgaoTipoById = async (req, res) => {
  try {
    const orgaoTipo = await OrgaoTipo.findByPk(req.params.id);
    if (orgaoTipo) {
      res.json(orgaoTipo);
    } else {
      res.status(404).json({ error: 'Tipo de órgão não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar um tipo de órgão por ID
exports.updateOrgaoTipo = async (req, res) => {
  try {
    const orgaoTipo = await OrgaoTipo.findByPk(req.params.id);
    if (orgaoTipo) {
      await orgaoTipo.update(req.body);
      res.json(orgaoTipo);
    } else {
      res.status(404).json({ error: 'Tipo de órgão não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deletar um tipo de órgão por ID
exports.deleteOrgaoTipo = async (req, res) => {
  try {
    const orgaoTipo = await OrgaoTipo.findByPk(req.params.id);
    if (orgaoTipo) {
      await orgaoTipo.destroy();
      res.json({ message: 'Tipo de órgão deletado com sucesso' });
    } else {
      res.status(404).json({ error: 'Tipo de órgão não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
