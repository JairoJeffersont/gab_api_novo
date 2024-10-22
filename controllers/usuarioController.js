
const Usuario = require('../models/usuarios');
const argon2 = require('argon2');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');



// Listar todos os usuários
exports.getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: {
                exclude: ['usuario_senha'], // Exclui o campo de senha
            },
            where: {
                usuario_id: {
                    [Op.ne]: 1
                }
            }
        });

        return res.status(200).json({ status: 200, message: usuarios.length + ' usuário(s) encontrado(s)', dados: usuarios });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};

// Encontrar um usuário pelo ID ou outros critérios
exports.findUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        if (id === '1') {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const { usuario_senha, ...usuarioSemSenha } = usuario.toJSON();

        return res.status(200).json({ status: 200, message: 'Usuário encontrado', dados: usuarioSemSenha });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};


// Criar novo usuário
exports.createUsuario = async (req, res) => {
    try {
        const { usuario_nome, usuario_email, usuario_telefone, usuario_senha, usuario_nivel, usuario_ativo, usuario_aniversario } = req.body;

        if (!usuario_nome || !usuario_email || !usuario_telefone || !usuario_senha || !usuario_nivel || usuario_ativo === undefined || !usuario_aniversario) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }

        let usuario_foto = null;
        if (req.file) {
            usuario_foto = req.file.filename; // Pega o nome do arquivo da foto
        }


        const novoUsuario = await Usuario.create({
            usuario_nome,
            usuario_email,
            usuario_telefone,
            usuario_senha: await argon2.hash(usuario_senha), // Faz o hash da senha
            usuario_nivel,
            usuario_ativo,
            usuario_aniversario,
            usuario_foto // Salva o nome do arquivo da foto no banco
        });

        const usuarioSemSenha = novoUsuario.get({ plain: true });
        delete usuarioSemSenha.usuario_senha;

        return res.status(201).json({ status: 201, message: 'Usuário criado com sucesso.', dados: usuarioSemSenha });
    } catch (error) {

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ status: 409, message: 'E-mail já cadastrado.' });
        }

        if (error.name === 'SequelizeDatabaseError') {
            return res.status(422).json({ status: 422, message: 'Um ou mais campos têm o tipo de dado incorreto.' });
        }

        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};



// Atualizar um usuário
exports.updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        if (req.file) {
            if (usuario.usuario_foto) {
                const filePath = path.join(__dirname, '../public/uploads/', usuario.usuario_foto);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Erro ao deletar o arquivo anterior:', err);
                    }
                });
            }
            req.body.usuario_foto = req.file.filename; 
        }

        await usuario.update(req.body);

        const usuarioAtualizado = usuario.get({ plain: true });
        delete usuarioAtualizado.usuario_senha;

        return res.status(200).json({ status: 200, message: 'Usuário atualizado com sucesso.', dados: usuarioAtualizado });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ status: 409, message: 'E-mail já cadastrado.' });
        }

        if (error.name === 'SequelizeDatabaseError') {
            return res.status(400).json({ status: 400, message: 'Um ou mais campos têm o tipo de dado incorreto.' });
        }

        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};




// Deletar um usuário
exports.deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ status: 404, message: 'Esse usuário não encontrado.' });
        }

        if (usuario.usuario_foto) {
            const filePath = path.join(__dirname, '../public/uploads/', usuario.usuario_foto);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Erro ao deletar o arquivo:', err);
                }
            });
        }

        await usuario.destroy();
        return res.status(200).send();
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({ status: 409, message: 'Esse usuário não pode ser apagado.' });
        }
        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};