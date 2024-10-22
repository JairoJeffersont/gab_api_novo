const multer = require('multer');
const path = require('path');
const crypto = require('crypto'); // Para gerar um hash único

// Configura o local de armazenamento e o nome do arquivo
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/'); // Pasta onde as fotos serão armazenadas
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Obtém a extensão do arquivo
        const hash = crypto.randomBytes(8).toString('hex'); // Gera um hash aleatório de 8 bytes
        const fileName = `${Date.now()}-${hash}${ext}`; // Nome único: timestamp + hash + extensão
        cb(null, fileName);
    }
});

// Filtrar tipo de arquivo
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de arquivo não permitido. Apenas JPEG e PNG são permitidos.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 20 } // Limite de 20MB para a foto
});

module.exports = upload;
