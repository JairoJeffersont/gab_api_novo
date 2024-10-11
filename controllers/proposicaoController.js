
const { Proposicao, ProposicoesAutores } = require('../models/proposicao');
const argon2 = require('argon2');
const { Op } = require('sequelize');
const axios = require('axios');

const BATCH_SIZE = 100; // Tamanho do bloco para inserção


// Listar todos os usuários
exports.getProposicoes = async (req, res) => {
    try {
        const usuarios = await Proposicao.findAll();

        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.atualizarProposicoes = async (req, res) => {
    try {
        const ano = req.query.ano;
        const url = `https://dadosabertos.camara.leg.br/arquivos/proposicoes/json/proposicoes-${ano}.json`;

        const response = await axios.get(url);
        const dados = response.data.dados;

        const proposicoes = dados.map(item => ({
            proposicao_id: item.id,
            proposicao_titulo: `${item.siglaTipo} ${item.numero}/${item.ano}`,
            proposicao_numero: item.numero,
            proposicao_sigla: item.siglaTipo,
            proposicao_ano: item.ano !== 0 ? item.ano : ano,
            proposicao_ementa: item.ementa,
            proposicao_apresentacao: item.dataApresentacao,
            proposicao_arquivada: item.ultimoStatus.descricaoSituacao === 'Arquivada'
        }));

        await Proposicao.destroy({ where: { proposicao_ano: ano } });

        // Inserção em blocos
        for (let i = 0; i < proposicoes.length; i += BATCH_SIZE) {
            const chunk = proposicoes.slice(i, i + BATCH_SIZE);
            await Proposicao.bulkCreate(chunk);
        }

        res.status(201).json({ message: 'Proposições atualizadas com sucesso.' });
    } catch (error) {
        console.error('Erro ao atualizar proposições:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.atualizarAutoresProposicoes = async (req, res) => {
    try {
        const ano = req.query.ano;
        const url = `https://dadosabertos.camara.leg.br/arquivos/proposicoesAutores/json/proposicoesAutores-${ano}.json`;

        const response = await axios.get(url);
        const dados = response.data.dados;

        // Buscando todas as proposições existentes para verificar a validade dos autores
        const proposicoesExistentes = await Proposicao.findAll({
            where: { proposicao_ano: ano },
            attributes: ['proposicao_id'], // Selecionando apenas os IDs
        });

        // Criando um conjunto (set) para facilitar a verificação de existência
        const proposicoesIds = new Set(proposicoesExistentes.map(p => p.proposicao_id));

        const autores = dados
            .map(item => ({
                proposicao_id: item.idProposicao,
                proposicao_id_autor: item.idDeputadoAutor ?? null,
                proposicao_nome_autor: item.codTipoAutor == 20000 ? `Senador(a) ${item.nomeAutor}` : item.nomeAutor,
                proposicao_partido_autor: item.siglaPartidoAutor || null,
                proposicao_uf_autor: item.siglaUFAutor || null,
                proposicao_assinatura: item.ordemAssinatura,
                proposicao_proponente: item.proponente,
                proposicao_ano: ano
            }))
            .filter(autor => proposicoesIds.has(autor.proposicao_id)); // Filtrando apenas autores com proposições válidas

        await ProposicoesAutores.destroy({ where: { proposicao_ano: ano } });

        // Inserção em blocos
        for (let i = 0; i < autores.length; i += BATCH_SIZE) {
            const chunk = autores.slice(i, i + BATCH_SIZE);
            await ProposicoesAutores.bulkCreate(chunk);
        }

        res.status(201).json({ message: 'Autores das proposições atualizados com sucesso.' });
    } catch (error) {
        console.error('Erro ao atualizar autores das proposições:', error);
        res.status(500).json({ error: error.message });
    }
};
