const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']; // Espera que o token seja enviado no cabeçalho 'Authorization'

    if (!token) {
        return res.status(403).json({ status: 403, message: 'Token não fornecido.' });
    }

    // Remove o prefixo "Bearer " do token se estiver presente
    const tokenSemPrefixo = token.startsWith('Bearer ') ? token.slice(7) : token;

    jwt.verify(tokenSemPrefixo, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ status: 401, message: 'Token inválido.' });
        }

        // Salva as informações do usuário decodificado no objeto `req`
        req.usuario_id = decoded.id;
        req.usuario_email = decoded.email;
        req.usuario_id = decoded.id;
        req.usuario_nivel = decoded.nivel;
        
        next(); // Chama o próximo middleware ou a rota
    });
};

module.exports = authMiddleware;
