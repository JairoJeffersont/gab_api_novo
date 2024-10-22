// controllers/pessoasProfissoesController.js

const PessoasProfissoes = require('../models/PessoasProfissoes'); // Ajuste o caminho conforme necessário

// Listar todos as profissões
exports.getAllProfissoes = async (req, res) => {
    try {
        const profissoes = await PessoasProfissoes.findAll();

        if (profissoes.length === 0) {
            return res.status(200).json({ status: 200, message: 'Nenhuma profissão encontrada' });
        }

        return res.status(200).json({ status: 200, message: `${profissoes.length} profissão(ões) encontrada(s)`, dados: profissoes });

    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};

// Criar uma nova profissão
exports.createProfissao = async (req, res) => {
    try {
        const novaProfissao = await PessoasProfissoes.create(req.body);
        return res.status(201).json({ status: 201, message: 'Profissão criada com sucesso.', dados: novaProfissao });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};

// Buscar uma profissão por ID
exports.getProfissaoById = async (req, res) => {
    const { id } = req.params;
    try {
        const profissao = await PessoasProfissoes.findByPk(id);
        if (!profissao) {
            return res.status(404).json({ status: 404, message: 'Profissão não encontrada' });
        }
        return res.status(200).json({ status: 200, message: 'Profissão encontrada', dados: profissao });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};

// Atualizar uma profissão por ID
exports.updateProfissao = async (req, res) => {
    const { id } = req.params;
    try {
        const [updated] = await PessoasProfissoes.update(req.body, { where: { pessoas_profissoes_id: id } });
        if (!updated) {
            return res.status(404).json({ status: 404, message: 'Profissão não encontrada' });
        }
        const updatedProfissao = await PessoasProfissoes.findByPk(id);
        return res.status(200).json({ status: 200, message: 'Profissão atualizada com sucesso.', dados: updatedProfissao });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};

// Deletar uma profissão por ID
exports.deleteProfissao = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await PessoasProfissoes.destroy({ where: { pessoas_profissoes_id: id } });
        if (!deleted) {
            return res.status(404).json({ status: 404, message: 'Profissão não encontrada' });
        }
        return res.status(200).json({ status: 200, message: 'Profissão deletada com sucesso.' });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};
