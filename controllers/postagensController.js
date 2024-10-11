// controllers/postagensController.js

const Postagem = require('../models/postagens');

// Listar todas as postagens
exports.getAllPostagens = async (req, res) => {
  try {
    const postagens = await Postagem.findAll();
    res.json(postagens);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar uma nova postagem
exports.createPostagem = async (req, res) => {
  try {
    const postagem = await Postagem.create(req.body);
    res.json(postagem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar uma postagem por ID
exports.getPostagemById = async (req, res) => {
  try {
    const postagem = await Postagem.findByPk(req.params.id);
    if (postagem) {
      res.json(postagem);
    } else {
      res.status(404).json({ error: 'Postagem não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar uma postagem por ID
exports.updatePostagem = async (req, res) => {
  try {
    const postagem = await Postagem.findByPk(req.params.id);
    if (postagem) {
      await postagem.update(req.body);
      res.json(postagem);
    } else {
      res.status(404).json({ error: 'Postagem não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deletar uma postagem por ID
exports.deletePostagem = async (req, res) => {
  try {
    const postagem = await Postagem.findByPk(req.params.id);
    if (postagem) {
      await postagem.destroy();
      res.json({ message: 'Postagem deletada com sucesso' });
    } else {
      res.status(404).json({ error: 'Postagem não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
