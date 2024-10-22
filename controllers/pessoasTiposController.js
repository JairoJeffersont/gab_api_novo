// controllers/pessoasTiposController.js

const PessoaTipo = require('../models/pessoas_tipos');
const Usuario = require('../models/usuarios');


// Listar todos os tipos de pessoas
exports.getAllPessoasTipos = async (req, res) => {
    try {
        const pessoasTipos = await PessoaTipo.findAll({
            include: [
                {
                    model: Usuario,
                    as: 'Usuario',
                    attributes: ['usuario_nome'],
                }
            ]
        });

        if (pessoasTipos.length === 0) {
            return res.status(200).json({ status: 200, message: 'Nenhum tipo de pessoa encontrado' });
        }

        return res.status(200).json({ status: 200, message: `${pessoasTipos.length} tipo(s) encontrado(s)`, dados: pessoasTipos });

    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};

// Criar um novo tipo de pessoa
exports.createPessoaTipo = async (req, res) => {
    try {

        const { pessoa_tipo_nome, pessoa_tipo_descricao } = req.body;

        if (!pessoa_tipo_nome || !pessoa_tipo_descricao) {
            return res.status(400).json({ error: 'Preencha os campos obrigatórios.' });
        }

        req.body.pessoa_tipo_criado_por = req.usuario_id;

        const pessoaTipo = await PessoaTipo.create(req.body);
        return res.status(201).json({ status: 201, message: 'Tipo de pessoa criado com sucesso.', dados: pessoaTipo });
    } catch (error) {

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ status: 409, message: 'Tipo de pessoa já cadastrado.' });
        }

        if (error.name === 'SequelizeDatabaseError') {
            return res.status(422).json({ status: 422, message: 'Um ou mais campos têm o tipo de dado incorreto.' });
        }

        return res.status(500).json({ status: 500, message: error });
    }
};

// Buscar um tipo de pessoa por ID
exports.getPessoaTipoById = async (req, res) => {
    try {
        const pessoaTipo = await PessoaTipo.findByPk(req.params.id);
        if (pessoaTipo) {
            return res.status(200).json({ status: 200, message: 'Tipo encontrado', dados: pessoaTipo });
        } else {
            return res.status(404).json({ status: 404, message: 'Tipo de pessoa não encontrado' });
        }
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};

// Atualizar um tipo de pessoa por ID
exports.updatePessoaTipo = async (req, res) => {
    try {
        const pessoaTipo = await PessoaTipo.findByPk(req.params.id);
        if (pessoaTipo) {
            await pessoaTipo.update(req.body);
            return res.status(200).json({ status: 200, message: 'Tipo de pessoa atualizado com sucesso.', dados: pessoaTipo });
        } else {
            return res.status(404).json({ status: 404, message: 'Tipo de pessoa não encontrado' });
        }
    } catch (error) {
        if (error.name === 'SequelizeDatabaseError') {
            return res.status(422).json({ status: 422, message: 'Um ou mais campos têm o tipo de dado incorreto.' });
        }
        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};

// Deletar um tipo de pessoa por ID
exports.deletePessoaTipo = async (req, res) => {
    try {
        const pessoaTipo = await PessoaTipo.findByPk(req.params.id);
        if (pessoaTipo) {
            await pessoaTipo.destroy();
            return res.status(200).json({ status: 200, message: 'Tipo de pessoa deletado com sucesso.' });
        } else {
            return res.status(404).json({ status: 404, message: 'Tipo de pessoa não encontrado' });
        }
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({ status: 409, message: 'Esse tipo de pessoa não pode ser apagado.' });
        }
        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};
