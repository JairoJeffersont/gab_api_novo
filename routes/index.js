// routes/index.js

const express = require('express');
const router = express.Router();

const usuarioRoutes = require('./usuarioRoutes');
const orgaosTiposRoutes = require('./orgaosTiposRoutes');
const orgaosRoutes = require('./orgaosRoutes');
const pessoasTiposRoutes = require('./pessoasTiposRoutes');
const pessoasRoutes = require('./pessoasRoutes');
const postagensStatusRoutes = require('./postagemStatusRoutes');
const postagensRoutes = require('./postagensRoutes');
const oficiosRoutes = require('./oficiosRoutes');
const proposicaoRoutes = require('./proposicaoRoute');

// Definindo as rotas
router.use('/usuarios', usuarioRoutes);
router.use('/tipos-orgaos', orgaosTiposRoutes);
router.use('/orgaos', orgaosRoutes);
router.use('/tipos-pessoas', pessoasTiposRoutes);
router.use('/pessoas', pessoasRoutes);
router.use('/postagens-status', postagensStatusRoutes);
router.use('/postagens', postagensRoutes);
router.use('/oficios', oficiosRoutes);
router.use('/proposicao', proposicaoRoutes);

router.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
  });

module.exports = router;

