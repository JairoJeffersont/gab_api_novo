
const express = require('express');
const multer = require('multer');
const usuarioController = require('../controllers/usuarioController');
const upload = require('../config/multerConfig'); // Importa o multer configurado


const router = express.Router();

router.get('/', usuarioController.getUsuarios);
router.get('/:id', usuarioController.findUsuario);
router.post('/', (req, res) => {
    // Middleware do multer para lidar com upload de arquivo
    upload.single('usuario_foto')(req, res, (err) => {
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
        usuarioController.createUsuario(req, res);
    });
});
router.put('/:id', (req, res) => {
    // Middleware do multer para lidar com upload de arquivo
    upload.single('usuario_foto')(req, res, async (err) => {
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
        usuarioController.updateUsuario(req, res);
    });
});
router.delete('/:id', usuarioController.deleteUsuario);

module.exports = router;