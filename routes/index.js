// routes/index.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../config/authMiddleware'); // Ajuste o caminho conforme sua estrutura de projeto


const usuarioRoutes = require('./usuarioRoutes');
const orgaosTiposRoutes = require('./orgaosTiposRoutes');
const orgaosRoutes = require('./orgaosRoutes');
const pessoasTiposRoutes = require('./pessoasTiposRoutes');
const pessoasRoutes = require('./pessoasRoutes');
const postagensStatusRoutes = require('./postagemStatusRoutes');
const postagensRoutes = require('./postagensRoutes');
const oficiosRoutes = require('./oficiosRoutes');
const proposicaoRoutes = require('./proposicaoRoute');
const loginRoutes = require('./loginRoutes');

// Definindo as rotas
router.use('/usuarios', authMiddleware, usuarioRoutes);
router.use('/tipos-orgaos', authMiddleware, orgaosTiposRoutes);
router.use('/orgaos', authMiddleware, orgaosRoutes);
router.use('/tipos-pessoas', authMiddleware, pessoasTiposRoutes);
router.use('/pessoas', authMiddleware, pessoasRoutes);
router.use('/postagens-status', authMiddleware, postagensStatusRoutes);
router.use('/postagens', authMiddleware, postagensRoutes);
router.use('/oficios', authMiddleware, oficiosRoutes);
router.use('/proposicoes', authMiddleware, proposicaoRoutes);
router.use('/login', loginRoutes);

router.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

module.exports = router;

