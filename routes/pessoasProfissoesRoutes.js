// routes/pessoasProfissoesRoutes.js

const express = require('express');
const router = express.Router();
const pessoasProfissoesController = require('../controllers/pessoasProfissoesController'); // Ajuste o caminho conforme necessário

// Listar todas as profissões
router.get('/', pessoasProfissoesController.getAllProfissoes);

// Criar uma nova profissão
router.post('/', pessoasProfissoesController.createProfissao);

// Buscar uma profissão por ID
router.get('/:id', pessoasProfissoesController.getProfissaoById);

// Atualizar uma profissão por ID
router.put('/:id', pessoasProfissoesController.updateProfissao);

// Deletar uma profissão por ID
router.delete('/:id', pessoasProfissoesController.deleteProfissao);

module.exports = router;
