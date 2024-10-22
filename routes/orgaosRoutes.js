const express = require('express');
const router = express.Router();
const orgaosController = require('../controllers/orgaosController'); // Verifique se o caminho está correto

// Definindo as rotas
router.get('/', orgaosController.getOrgaos); // Certifique-se de que getAllOrgaos está definido
router.get('/:id', orgaosController.getOrgaoById); // Certifique-se de que getOrgaoById está definido
router.post('/', orgaosController.createOrgao); // Certifique-se de que createOrgao está definido
router.put('/:id', orgaosController.updateOrgao); // Certifique-se de que updateOrgao está definido
router.delete('/:id', orgaosController.deleteOrgao); // Certifique-se de que deleteOrgao está definido

module.exports = router;
