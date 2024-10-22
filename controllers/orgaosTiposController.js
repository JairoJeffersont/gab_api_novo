// controllers/orgaosTiposController.js

const OrgaoTipo = require('../models/orgaos_tipos');
const Usuario = require('../models/usuarios');


// Listar todos os tipos de órgãos
exports.getAllOrgaosTipos = async (req, res) => {
    try {
        const orgaosTipos = await OrgaoTipo.findAll({
            include: [
                {
                    model: Usuario,
                    as: 'Usuario',
                    attributes: ['usuario_nome'],
                }
            ]
        });

        if (orgaosTipos.length == 0) {
            return res.status(200).json({ status: 200, message: 'Nenhum tipo de órgão encontrado' });
        }

        return res.status(200).json({ status: 200, message: orgaosTipos.length + ' tipos(s) encontrado(s)', dados: orgaosTipos });

    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};

// Criar um novo tipo de órgão
exports.createOrgaoTipo = async (req, res) => {
    try {

        const { orgao_tipo_nome, orgao_tipo_descricao } = req.body;

        if (!orgao_tipo_nome || !orgao_tipo_descricao) {
            return res.status(400).json({ error: 'Preencha os campos obrigatórios.' });
        }

        req.body.orgao_tipo_criado_por = req.usuario_id;

        const orgaoTipo = await OrgaoTipo.create(req.body);

        return res.status(201).json({ status: 201, message: 'Tpo de órgão criado com sucesso.', dados: orgaoTipo });

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ status: 409, message: 'Tipo de órgão já cadastrado.' });
        }

        if (error.name === 'SequelizeDatabaseError') {
            return res.status(422).json({ status: 422, message: 'Um ou mais campos têm o tipo de dado incorreto.' });
        }

        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};

// Buscar um tipo de órgão por ID
exports.getOrgaoTipoById = async (req, res) => {
    try {
        const orgaoTipo = await OrgaoTipo.findByPk(req.params.id, {
            include: [
                {
                    model: Usuario,
                    as: 'Usuario',
                    attributes: ['usuario_nome'],
                }
            ]
        });
        if (orgaoTipo) {
            return res.status(200).json({ status: 200, message: 'tipos encontrado', dados: orgaoTipo });
        }
        return res.status(200).json({ status: 200, message: 'Tipo de órgão não encontrado' });

    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};

// Atualizar um tipo de órgão por ID
exports.updateOrgaoTipo = async (req, res) => {
    try {
        const orgaoTipo = await OrgaoTipo.findByPk(req.params.id);
        if (orgaoTipo) {
            await orgaoTipo.update(req.body);
            return res.status(201).json({ status: 201, message: 'Tpo de órgão atualizado com sucesso.', dados: orgaoTipo });
        }

        return res.status(200).json({ status: 200, message: 'Tipo de órgão não encontrado' });

    } catch (error) {
        if (error.name === 'SequelizeDatabaseError') {
            return res.status(422).json({ status: 422, message: 'Um ou mais campos têm o tipo de dado incorreto.' });
        }

        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};

// Deletar um tipo de órgão por ID
exports.deleteOrgaoTipo = async (req, res) => {
    try {
        const orgaoTipo = await OrgaoTipo.findByPk(req.params.id);
        if (orgaoTipo) {
            await orgaoTipo.destroy();
            return res.status(200).json({ status: 200, message: 'Tipo de órgão apagado com sucesso.' });
        }
        return res.status(404).json({ status: 404, message: 'Órgão não encontrado' });
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({ status: 409, message: 'Esse tipo de órgão não pode ser apagado.' });
        }
        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};
