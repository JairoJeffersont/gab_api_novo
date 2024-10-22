const Usuario = require('../models/usuarios');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
require('dotenv').config();


exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Verifica se o usuário é o root
        if (process.env.MASTER_EMAIL === email && process.env.MASTER_PASS === senha) {
            const token = jwt.sign(
                {
                    id: 1000, // Id do usuário root
                    email: process.env.MASTER_EMAIL, // Email do usuário root
                    nome: process.env.MASTER_USER, // Nome do usuário root
                    nivel: 1 // Nível do usuário root
                },
                process.env.JWT_SECRET,
                { expiresIn: '5m' }
            );
            return res.json({
                nome: process.env.MASTER_USER,
                email: process.env.MASTER_EMAIL,
                nivel: 1,
                id: 1000,
                token: token
            }); // Retorna o token e sai da função
        }

        // Busca o usuário pelo campo usuario_email
        const usuario = await Usuario.findOne({ where: { usuario_email: email } });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Verifica se a senha está correta
        const senhaCorreta = await argon2.verify(usuario.usuario_senha, senha);
        if (!senhaCorreta) {
            return res.status(401).json({ error: 'Senha incorreta' });
        }

        if (!usuario.usuario_ativo) {
            return res.status(401).json({ error: 'Usuário desativado' });
        }

        // Gera um token JWT com dados do usuário no payload
        const token = jwt.sign(
            {
                id: usuario.usuario_id, // Id do usuário
                email: usuario.usuario_email, // Email do usuário
                nome: usuario.usuario_nome, // Nome do usuário
                nivel: usuario.usuario_nivel // Nível do usuário
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );

        // Retorna os dados do usuário e o token
        res.json({
            nome: usuario.usuario_nome,
            email: usuario.usuario_email,
            nivel: usuario.usuario_nivel,
            id: usuario.usuario_id,
            token: token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};