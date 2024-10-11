// routes/pessoasRoutes.js

const express = require('express');
const router = express.Router();
const pessoasController = require('../controllers/pessoasController');

// Listar todas as pessoas
router.get('/', pessoasController.getAllPessoas);

// Criar uma nova pessoa
router.post('/', pessoasController.createPessoa);

// Buscar uma pessoa por ID
router.get('/:id', pessoasController.getPessoaById);

// Atualizar uma pessoa por ID
router.put('/:id', pessoasController.updatePessoa);

// Deletar uma pessoa por ID
router.delete('/:id', pessoasController.deletePessoa);

module.exports = router;
