// routes/pessoasTiposRoutes.js

const express = require('express');
const router = express.Router();
const pessoasTiposController = require('../controllers/pessoasTiposController');

// Listar todos os tipos de pessoas
router.get('/', pessoasTiposController.getAllPessoasTipos);

// Criar um novo tipo de pessoa
router.post('/', pessoasTiposController.createPessoaTipo);

// Buscar um tipo de pessoa por ID
router.get('/:id', pessoasTiposController.getPessoaTipoById);

// Atualizar um tipo de pessoa por ID
router.put('/:id', pessoasTiposController.updatePessoaTipo);

// Deletar um tipo de pessoa por ID
router.delete('/:id', pessoasTiposController.deletePessoaTipo);

module.exports = router;
