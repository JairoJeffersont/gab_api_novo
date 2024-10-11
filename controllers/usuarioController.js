
const Usuario = require('../models/usuarios');
const argon2 = require('argon2');
const { Op } = require('sequelize');


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

    // Hash da senha diretamente na criação do usuário
    const novoUsuario = await Usuario.create({
      ...req.body,
      usuario_senha: await argon2.hash(usuario_senha) // Faz o hash da senha
    });

    res.status(201).json(novoUsuario);
  } catch (error) {

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'E-mail já cadastrado.' });
    }

    if (error.original.errno == 1292 || error.original.errno == 1366) {
      return res.status(400).json({ error: 'Um ou mais campos têm o tipo de dado incorreto.' });
    }

    res.status(500).json({ error: error.message });
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
    await usuario.update(req.body);
    res.json(usuario);
  } catch (error) {

    if (error.original.errno == 1292 || error.original.errno == 1366) {
      return res.status(400).json({ error: 'Um ou mais campos têm o tipo de dado incorreto.' });
    }
    
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
    await usuario.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
