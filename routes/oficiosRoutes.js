// routes/oficiosRoutes.js

const express = require('express');
const router = express.Router();
const oficiosController = require('../controllers/oficiosController');

// Listar todos os ofícios
router.get('/', oficiosController.getAllOficios);

// Criar um novo ofício
router.post('/', oficiosController.createOficio);

// Buscar um ofício por ID
router.get('/:id', oficiosController.getOficioById);

// Atualizar um ofício por ID
router.put('/:id', oficiosController.updateOficio);

// Deletar um ofício por ID
router.delete('/:id', oficiosController.deleteOficio);

module.exports = router;
