// controllers/pessoasProfissoesController.js

const PessoasProfissoes = require('../models/PessoasProfissoes'); // Ajuste o caminho conforme necessário

// Listar todos as profissões
exports.getAllProfissoes = async (req, res) => {
    try {
        const profissoes = await PessoasProfissoes.findAll();
        res.json(profissoes);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar profissões', error });
    }
};

// Criar uma nova profissão
exports.createProfissao = async (req, res) => {
    try {
        const novaProfissao = await PessoasProfissoes.create(req.body);
        res.status(201).json(novaProfissao);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar profissão', error });
    }
};

// Buscar uma profissão por ID
exports.getProfissaoById = async (req, res) => {
    const { id } = req.params;
    try {
        const profissao = await PessoasProfissoes.findByPk(id);
        if (!profissao) {
            return res.status(404).json({ message: 'Profissão não encontrada' });
        }
        res.json(profissao);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar profissão', error });
    }
};

// Atualizar uma profissão por ID
exports.updateProfissao = async (req, res) => {
    const { id } = req.params;
    try {
        const [updated] = await PessoasProfissoes.update(req.body, { where: { pessoas_profissoes_id: id } });
        if (!updated) {
            return res.status(404).json({ message: 'Profissão não encontrada' });
        }
        const updatedProfissao = await PessoasProfissoes.findByPk(id);
        res.json(updatedProfissao);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar profissão', error });
    }
};

// Deletar uma profissão por ID
exports.deleteProfissao = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await PessoasProfissoes.destroy({ where: { pessoas_profissoes_id: id } });
        if (!deleted) {
            return res.status(404).json({ message: 'Profissão não encontrada' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar profissão', error });
    }
};
