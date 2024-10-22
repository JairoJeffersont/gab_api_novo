
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

        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
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

        res.json(usuarioSemSenha);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Criar novo usuário
exports.createUsuario = async (req, res) => {
    try {
        const { usuario_nome, usuario_email, usuario_telefone, usuario_senha, usuario_nivel, usuario_ativo, usuario_aniversario } = req.body;

        // Verifica se todos os campos obrigatórios estão presentes
        if (!usuario_nome || !usuario_email || !usuario_telefone || !usuario_senha || !usuario_nivel || usuario_ativo === undefined || !usuario_aniversario) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }

        // Verifica se uma foto foi enviada
        let usuario_foto = null;
        if (req.file) {
            usuario_foto = req.file.filename; // Pega o nome do arquivo da foto
        }

        // Criação do novo usuário com hash da senha
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

        // Converte para um objeto simples e remove o campo 'usuario_senha'
        const usuarioSemSenha = novoUsuario.get({ plain: true });
        delete usuarioSemSenha.usuario_senha;

        // Retorna o usuário sem a senha no JSON
        res.status(201).json(usuarioSemSenha);
    } catch (error) {

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'E-mail já cadastrado.' });
        }

        if (error.original && (error.original.errno === 1292 || error.original.errno === 1366)) {
            return res.status(400).json({ error: 'Um ou mais campos têm o tipo de dado incorreto.' });
        }

        res.status(500).json({ error: error.message });
    }
};



// Atualizar um usuário
exports.updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        // Busca o usuário pelo ID
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Verifica se uma nova foto foi enviada
        if (req.file) {
            // Verifica se já existe uma foto anterior
            if (usuario.usuario_foto) {
                const filePath = path.join(__dirname, '../public/uploads/', usuario.usuario_foto);
                // Remove o arquivo anterior do sistema de arquivos
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Erro ao deletar o arquivo anterior:', err);
                        // Você pode optar por continuar mesmo que o arquivo não tenha sido deletado
                    }
                });
            }
            // Atualiza o campo usuario_foto com o novo nome do arquivo
            req.body.usuario_foto = req.file.filename; // Salva o nome do novo arquivo
        }

        // Atualiza o usuário com os dados da requisição
        await usuario.update(req.body);

        // Converte para um objeto simples e remove o campo 'usuario_senha'
        const usuarioAtualizado = usuario.get({ plain: true });
        delete usuarioAtualizado.usuario_senha;

        // Retorna o usuário atualizado sem o campo 'usuario_senha'
        res.json(usuarioAtualizado);
    } catch (error) {
        // Verifica se o erro é relacionado ao tipo de dado incorreto
        if (error.original && (error.original.errno === 1292 || error.original.errno === 1366)) {
            return res.status(400).json({ error: 'Um ou mais campos têm o tipo de dado incorreto.' });
        }

        // Retorna um erro interno do servidor
        res.status(500).json({ error: error.message });
    }
};




// Deletar um usuário
exports.deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Verifica se existe um arquivo associado ao usuário
        if (usuario.usuario_foto) {
            const filePath = path.join(__dirname, '../public/uploads/', usuario.usuario_foto);
            // Remove o arquivo do sistema de arquivos
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Erro ao deletar o arquivo:', err);
                    // Se não conseguir deletar o arquivo, ainda assim continuar a remoção do usuário
                }
            });
        }

        // Deleta o usuário do banco de dados
        await usuario.destroy();
        res.status(200).send();
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({ error: 'Esse usuário não pode ser apagado.' });
        }
        res.status(500).json({ error: error });
    }
};

