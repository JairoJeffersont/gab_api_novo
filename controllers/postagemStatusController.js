// controllers/postagemStatusController.js

const PostagemStatus = require('../models/postagem_status');

// Listar todos os status de postagem
exports.getAllStatus = async (req, res) => {
  try {
    const status = await PostagemStatus.findAll();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar novo status de postagem
exports.createStatus = async (req, res) => {
  try {
    const status = await PostagemStatus.create(req.body);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar status de postagem por ID
exports.getStatusById = async (req, res) => {
  try {
    const status = await PostagemStatus.findByPk(req.params.id);
    if (status) {
      res.json(status);
    } else {
      res.status(404).json({ error: 'Status não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar status de postagem por ID
exports.updateStatus = async (req, res) => {
  try {
    const status = await PostagemStatus.findByPk(req.params.id);
    if (status) {
      await status.update(req.body);
      res.json(status);
    } else {
      res.status(404).json({ error: 'Status não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deletar status de postagem por ID
exports.deleteStatus = async (req, res) => {
  try {
    const status = await PostagemStatus.findByPk(req.params.id);
    if (status) {
      await status.destroy();
      res.json({ message: 'Status deletado com sucesso' });
    } else {
      res.status(404).json({ error: 'Status não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
