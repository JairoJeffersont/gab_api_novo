// controllers/orgaosController.js

const Orgao = require('../models/orgaos');

// Listar todos os órgãos
exports.getOrgaos = async (req, res) => {
    try {
        const orgaos = await Orgao.findAll();
        res.status(200).json({ status: 200, message: orgaos.length + ' ógãos(s) encontrado(s)', dados: orgaos });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Criar um novo órgão
exports.createOrgao = async (req, res) => {
    try {
        const { orgao_nome, orgao_email, orgao_municipio, orgao_estado, orgao_tipo } = req.body;

        if (!orgao_nome || !orgao_email || !orgao_municipio || !orgao_estado || !orgao_tipo) {
            return res.status(400).json({ error: 'Preencha os campos obrigatórios.' });
        }

        req.body.orgao_criado_por = req.usuario_id;

        const orgao = await Orgao.create(req.body);
        return res.status(201).json({ status: 201, message: 'Órgão criado com sucesso.', dados: orgao });

    } catch (error) {

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ status: 409, message: 'Órgão já cadastrado.' });
        }

        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({ status: 409, message: 'Tipo de órgão inválido.' });
        }

        if (error.name === 'SequelizeDatabaseError') {
            return res.status(422).json({ status: 422, message: 'Um ou mais campos têm o tipo de dado incorreto.' });
        }

        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};


// Buscar um órgão por ID
exports.getOrgaoById = async (req, res) => {
    try {
        const orgao = await Orgao.findByPk(req.params.id);
        if (orgao) {
            res.json(orgao);
        } else {
            res.status(404).json({ error: 'Órgão não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Atualizar um órgão por ID
exports.updateOrgao = async (req, res) => {
    try {
        const orgao = await Orgao.findByPk(req.params.id);
        if (orgao) {
            await orgao.update(req.body);
            res.json(orgao);
        } else {
            res.status(404).json({ error: 'Órgão não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Deletar um órgão por ID
exports.deleteOrgao = async (req, res) => {
    try {
        const orgao = await Orgao.findByPk(req.params.id);
        if (orgao) {
            await orgao.destroy();
            res.json({ message: 'Órgão deletado com sucesso' });
        } else {
            res.status(404).json({ error: 'Órgão não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
