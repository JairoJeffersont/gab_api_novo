// routes/orgaosTiposRoutes.js

const express = require('express');
const router = express.Router();
const orgaosTiposController = require('../controllers/orgaosTiposController');

// Listar todos os tipos de órgãos
router.get('/', orgaosTiposController.getAllOrgaosTipos);

// Criar um novo tipo de órgão
router.post('/', orgaosTiposController.createOrgaoTipo);

// Buscar um tipo de órgão por ID
router.get('/:id', orgaosTiposController.getOrgaoTipoById);

// Atualizar um tipo de órgão por ID
router.put('/:id', orgaosTiposController.updateOrgaoTipo);

// Deletar um tipo de órgão por ID
router.delete('/:id', orgaosTiposController.deleteOrgaoTipo);

module.exports = router;
