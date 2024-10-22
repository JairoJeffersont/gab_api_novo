// routes/pessoasRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const pessoasController = require('../controllers/pessoasController');
const upload = require('../config/multerConfig'); // Importa o multer configurado

// Listar todas as pessoas
router.get('/', pessoasController.getAllPessoas);

// Criar uma nova pessoa
//router.post('/', pessoasController.createPessoa);


router.post('/', (req, res) => {
    // Middleware do multer para lidar com upload de arquivo
    upload.single('pessoa_foto')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Erro gerado pelo Multer (ex: arquivo muito grande)
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: 'O arquivo enviado é muito grande. O limite é 20MB.' });
            }
            return res.status(400).json({ error: `Erro no upload: ${err.message}` });
        } else if (err) {
            // Erro geral (ex: tipo de arquivo não suportado)
            return res.status(400).json({ error: err.message });
        }

        // Continua o fluxo normal, chamando o controlador caso o upload seja bem-sucedido
        pessoasController.createPessoa(req, res);
    });
});

// Buscar uma pessoa por ID
router.get('/:id', pessoasController.getPessoaById);

// Atualizar uma pessoa por ID
//router.put('/:id', pessoasController.updatePessoa);


router.put('/:id', (req, res) => {
    // Middleware do multer para lidar com upload de arquivo
    upload.single('pessoa_foto')(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            // Erro gerado pelo Multer (ex: arquivo muito grande)
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: 'O arquivo enviado é muito grande. O limite é 20MB.' });
            }
            return res.status(400).json({ error: `Erro no upload: ${err.message}` });
        } else if (err) {
            // Erro geral (ex: tipo de arquivo não suportado)
            return res.status(400).json({ error: err.message });
        }

        // Continua o fluxo normal, chamando o controlador caso o upload seja bem-sucedido
        pessoasController.updatePessoa(req, res);
    });
});

// Deletar uma pessoa por ID
router.delete('/:id', pessoasController.deletePessoa);

module.exports = router;
