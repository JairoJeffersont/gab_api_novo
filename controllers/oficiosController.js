// controllers/oficiosController.js

const Oficio = require('../models/oficios');

// Listar todos os ofícios
exports.getAllOficios = async (req, res) => {
  try {
    const oficios = await Oficio.findAll();
    res.json(oficios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar um novo ofício
exports.createOficio = async (req, res) => {
  try {
    const oficio = await Oficio.create(req.body);
    res.json(oficio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar um ofício por ID
exports.getOficioById = async (req, res) => {
  try {
    const oficio = await Oficio.findByPk(req.params.id);
    if (oficio) {
      res.json(oficio);
    } else {
      res.status(404).json({ error: 'Ofício não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar um ofício por ID
exports.updateOficio = async (req, res) => {
  try {
    const oficio = await Oficio.findByPk(req.params.id);
    if (oficio) {
      await oficio.update(req.body);
      res.json(oficio);
    } else {
      res.status(404).json({ error: 'Ofício não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deletar um ofício por ID
exports.deleteOficio = async (req, res) => {
  try {
    const oficio = await Oficio.findByPk(req.params.id);
    if (oficio) {
      await oficio.destroy();
      res.json({ message: 'Ofício deletado com sucesso' });
    } else {
      res.status(404).json({ error: 'Ofício não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
