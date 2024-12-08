
const express = require('express');
const proposicaoController = require('../controllers/proposicaoController');
const router = express.Router();

router.get('/listar', proposicaoController.getProposicoes);
router.get('/atualizar-proposicoes', proposicaoController.atualizarProposicoes);
router.get('/atualizar-autores', proposicaoController.atualizarAutoresProposicoes);
router.get('/medidas-provisorias', proposicaoController.BuscarMP);
router.get('/buscar-principal', proposicaoController.BuscaPrincipal);
router.get('/buscar-apensados-gabinete', proposicaoController.BuscarApensadosDoGabinete);



module.exports = router;
