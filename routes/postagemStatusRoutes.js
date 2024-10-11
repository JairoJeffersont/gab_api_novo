// routes/postagemStatusRoutes.js

const express = require('express');
const router = express.Router();
const postagemStatusController = require('../controllers/postagemStatusController');

// Listar todos os status de postagem
router.get('/', postagemStatusController.getAllStatus);

// Criar novo status de postagem
router.post('/', postagemStatusController.createStatus);

// Buscar status de postagem por ID
router.get('/:id', postagemStatusController.getStatusById);

// Atualizar status de postagem por ID
router.put('/:id', postagemStatusController.updateStatus);

// Deletar status de postagem por ID
router.delete('/:id', postagemStatusController.deleteStatus);

module.exports = router;
