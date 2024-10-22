// controllers/orgaosController.js

const Orgao = require('../models/orgaos');
const Usuario = require('../models/usuarios');
const OrgaoTipo = require('../models/orgaos_tipos');
const { Op } = require('sequelize');
const querystring = require('querystring');


exports.getOrgaos = async (req, res) => {
    const { itens = 10, pagina = 1, ordenarPor = 'orgao_id', ordem = 'ASC', busca } = req.query;

    try {
        const limit = parseInt(itens, 10);
        const offset = (pagina - 1) * limit;

        const where = busca ? { orgao_nome: { [Op.like]: `%${busca}%` } } : {};

        const orgaos = await Orgao.findAll({
            where: where,
            order: [[ordenarPor, ordem]],
            limit: limit,
            offset: offset,
            include: [
                {
                    model: Usuario,
                    as: 'Usuario',
                    attributes: ['usuario_nome']
                },
                {
                    model: OrgaoTipo,
                    as: 'tipo',
                    attributes: ['orgao_tipo_nome']
                }
            ]
        });

        const totalOrgaos = await Orgao.count({ where: where });
        const totalPaginas = Math.ceil(totalOrgaos / limit);

        const baseUrl = req.protocol + '://' + req.get('host') + req.baseUrl;

        const links = {
            primeira: `${baseUrl}?${querystring.stringify({ itens, pagina: 1, ordenarPor, ordem, ...(busca && { busca }) })}`,
            atual: `${baseUrl}?${querystring.stringify({ itens, pagina, ordenarPor, ordem, ...(busca && { busca }) })}`,
            ultima: `${baseUrl}?${querystring.stringify({ itens, pagina: totalPaginas, ordenarPor, ordem, ...(busca && { busca }) })}`,
        };

        if (orgaos.length == 0) {
            return res.status(200).json({ status: 200, message: 'Nenhum órgão encontrado' });
        }

        return res.status(200).json({
            status: 200,
            message: orgaos.length + ' órgão(s) encontrado(s)',
            dados: orgaos,
            links: links
        });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
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
        const orgao = await Orgao.findByPk(req.params.id, {
            include: [
                {
                    model: Usuario,
                    as: 'Usuario',
                    attributes: ['usuario_nome']
                },
                {
                    model: OrgaoTipo,
                    as: 'tipo',
                    attributes: ['orgao_tipo_nome']
                }
            ]
        });
        if (!orgao) {
            return res.status(404).json({ status: 404, message: 'Órgão não encontrado' });
        }
        return res.status(200).json({ status: 200, message: 'Órgão encontrado.', dados: orgao });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};

// Atualizar um órgão por ID
exports.updateOrgao = async (req, res) => {
    try {
        const orgao = await Orgao.findByPk(req.params.id);
        if (orgao) {
            await orgao.update(req.body);
            return res.status(200).json({ status: 200, message: 'Órgão atualizado com sucesso.', dados: orgao });
        } else {
            return res.status(404).json({ status: 404, message: 'Órgão não encontrado' });
        }
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};

// Deletar um órgão por ID
exports.deleteOrgao = async (req, res) => {
    try {
        const orgao = await Orgao.findByPk(req.params.id);
        if (orgao) {
            await orgao.destroy();
            return res.status(200).json({ status: 200, message: 'Órgão apagado com sucesso.' });
        } else {
            return res.status(404).json({ status: 404, message: 'Órgão não encontrado' });
        }
    } catch (error) {

        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({ status: 409, message: 'Esse órgão não pode ser apagado.' });
        }

        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};
