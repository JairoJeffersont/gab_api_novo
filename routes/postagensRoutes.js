// routes/postagensRoutes.js

const express = require('express');
const router = express.Router();
const postagensController = require('../controllers/postagensController');

// Listar todas as postagens
router.get('/', postagensController.getAllPostagens);

// Criar nova postagem
router.post('/', postagensController.createPostagem);

// Buscar uma postagem por ID
router.get('/:id', postagensController.getPostagemById);

// Atualizar uma postagem por ID
router.put('/:id', postagensController.updatePostagem);

// Deletar uma postagem por ID
router.delete('/:id', postagensController.deletePostagem);

module.exports = router;
