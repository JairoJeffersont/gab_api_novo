// controllers/pessoasController.js

const Pessoa = require('../models/pessoas');
const querystring = require('querystring');
const Usuario = require('../models/usuarios');
const PessoaTipo = require('../models/pessoas_tipos');
const PessoaProfissao = require('../models/pessoas_profissoes');
const Orgao = require('../models/orgaos');
const { Op } = require('sequelize');


// Listar todas as pessoas
exports.getAllPessoas = async (req, res) => {
    const { itens = 10, pagina = 1, ordenarPor = 'pessoa_id', ordem = 'ASC', busca } = req.query;

    try {
        const limit = parseInt(itens, 10);
        const offset = (pagina - 1) * limit;

        const where = busca ? { nome: { [Op.like]: `%${busca}%` } } : {};

        const pessoas = await Pessoa.findAll({
            where: where,
            order: [[ordenarPor, ordem]],
            limit: limit,
            offset: offset,
            include: [
                {
                    model: Usuario,
                    as: 'Usuario',
                    attributes: ['usuario_id', 'usuario_nome'], // atributos que você deseja retornar
                },
                {
                    model: PessoaTipo,
                    as: 'PessoaTipo',
                    attributes: ['pessoa_tipo_id', 'pessoa_tipo_nome'], // atributos que você deseja retornar
                },
                {
                    model: Orgao,
                    as: 'Orgao',
                    attributes: ['orgao_id', 'orgao_nome'], // atributos que você deseja retornar
                },
                {
                    model: PessoaProfissao,
                    as: 'PessoaProfissao',
                    attributes: ['pessoas_profissoes_id', 'pessoas_profissoes_nome'], // atributos que você deseja retornar
                },
            ],
        });

        const totalPessoas = await Pessoa.count({ where: where });
        const totalPaginas = Math.ceil(totalPessoas / limit);

        const baseUrl = req.protocol + '://' + req.get('host') + req.baseUrl;

        const links = {
            primeira: `${baseUrl}?${querystring.stringify({ itens, pagina: 1, ordenarPor, ordem, ...(busca && { busca }) })}`,
            atual: `${baseUrl}?${querystring.stringify({ itens, pagina, ordenarPor, ordem, ...(busca && { busca }) })}`,
            ultima: `${baseUrl}?${querystring.stringify({ itens, pagina: totalPaginas, ordenarPor, ordem, ...(busca && { busca }) })}`,
        };

        if (pessoas.length === 0) {
            return res.status(200).json({ status: 200, message: 'Nenhuma pessoa encontrada' });
        }

        return res.status(200).json({
            status: 200,
            message: pessoas.length + ' pessoa(s) encontrada(s)',
            dados: pessoas,
            links: links
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};

// Criar uma nova pessoa
exports.createPessoa = async (req, res) => {
    try {

        const { pessoa_nome, pessoa_aniversario, pessoa_email, pessoa_municipio, pessoa_estado, pessoa_profissao, pessoa_tipo, pessoa_orgao } = req.body;

        if (!pessoa_nome || !pessoa_aniversario || !pessoa_email || !pessoa_municipio || !pessoa_estado || !pessoa_profissao || !pessoa_tipo || !pessoa_orgao) {
            return res.status(400).json({ error: 'Preencha os campos obrigatórios.' });
        }

        req.body.pessoa_criada_por = req.usuario_id;

        const pessoa = await Pessoa.create(req.body);
        return res.status(201).json({ status: 201, message: 'Pessoa criada com sucesso.', dados: pessoa });
    } catch (error) {

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ status: 409, message: 'Pessoa já cadastrada.' });
        }

        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({ status: 409, message: 'Tipo de pessoa inválida.' });
        }

        if (error.name === 'SequelizeDatabaseError') {
            return res.status(422).json({ status: 422, message: 'Um ou mais campos têm o tipo de dado incorreto.' });
        }

        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};

// Buscar uma pessoa por ID
exports.getPessoaById = async (req, res) => {
    try {
        const pessoa = await Pessoa.findByPk(req.params.id, {
            include: [
                {
                    model: Usuario,
                    as: 'Usuario',
                    attributes: ['usuario_id', 'usuario_nome'], // atributos que você deseja retornar
                },
                {
                    model: PessoaTipo,
                    as: 'PessoaTipo',
                    attributes: ['pessoa_tipo_id', 'pessoa_tipo_nome'], // atributos que você deseja retornar
                },
                {
                    model: Orgao,
                    as: 'Orgao',
                    attributes: ['orgao_id', 'orgao_nome'], // atributos que você deseja retornar
                },
                {
                    model: PessoaProfissao,
                    as: 'PessoaProfissao',
                    attributes: ['pessoas_profissoes_id', 'pessoas_profissoes_nome'], // atributos que você deseja retornar
                },
            ],
        });
        if (!pessoa) {
            return res.status(404).json({ status: 404, message: 'Pessoa não encontrada' });
        }
        return res.status(200).json({ status: 200, message: 'Pessoa encontrado.', dados: pessoa });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};

// Atualizar uma pessoa por ID
exports.updatePessoa = async (req, res) => {
    try {
        const pessoa = await Pessoa.findByPk(req.params.id);

        if (!pessoa) {
            return res.status(404).json({ status: 404, message: 'Pessoa não encontrada' });
        }

        await pessoa.update(req.body);

        return res.status(200).json({
            status: 200,
            message: 'Pessoa atualizada com sucesso.',
            dados: pessoa
        });

    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'Erro ao atualizar pessoa',
            error: error.message
        });
    }
};

// Deletar uma pessoa por ID
exports.deletePessoa = async (req, res) => {
    try {
        const pessoa = await Pessoa.findByPk(req.params.id);
        if (pessoa) {
            await pessoa.destroy();
            return res.status(200).json({ status: 200, message: 'Pessoa apagada com sucesso.' });
        } else {
            return res.status(404).json({ status: 404, message: 'Pessoa não encontrada' });
        }
    } catch (error) {

        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({ status: 409, message: 'Essa pessoa não pode ser apagada.' });
        }

        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};
