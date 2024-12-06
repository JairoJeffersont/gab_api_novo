
const { Proposicao, ProposicoesAutores } = require('../models/proposicao');
const argon2 = require('argon2');
const { Op } = require('sequelize');
const axios = require('axios');
const querystring = require('querystring');


require('dotenv').config();


const BATCH_SIZE = 100;


exports.getProposicoes = async (req, res) => {
    try {
        const autor = req.query.autor || process.env.ID_DEPUTADO;
        const ano = req.query.ano || new Date().getFullYear();
        const tipo = req.query.tipo || 'PL';
        const arquivada = req.query.arquivada || 0;
        const itens = req.query.itens || 10;
        const pagina = req.query.pagina || 1;
        const ordenarPor = req.query.ordenarPor || 'proposicao_id';
        const ordem = req.query.ordem || 'DESC';
        const autoria_unica = parseInt(req.query.autoria_unica, 10) ?? 0;

        const limit = parseInt(itens, 10);
        const offset = (pagina - 1) * limit;

        const whereAutoriaUnica = {};

        if (autoria_unica === 1) {
            whereAutoriaUnica.proposicao_assinatura = 1;
            whereAutoriaUnica.proposicao_proponente = 1;
        }

        const proposicoes = await Proposicao.findAndCountAll({
            where: {
                proposicao_ano: ano,
                proposicao_sigla: tipo,
                proposicao_arquivada: arquivada,
            },
            order: [[ordenarPor, ordem]],
            limit: limit,
            offset: offset,
            include: [
                {
                    model: ProposicoesAutores,
                    as: 'autores',
                    where: {
                        proposicao_id_autor: autor,
                        ...whereAutoriaUnica,
                    },
                },
            ],
        });

        const totalProposicoes = proposicoes.count
        const totalPaginas = Math.ceil(totalProposicoes / limit);

        const baseUrl = req.protocol + '://' + req.get('host') + req.baseUrl + '/listar';

        const links = {
            primeira: `${baseUrl}?${querystring.stringify({ autor, ano, tipo, arquivada, itens, pagina: 1, ordenarPor, ordem, autoria_unica })}`,
            atual: `${baseUrl}?${querystring.stringify({ autor, ano, tipo, arquivada, itens, pagina, ordenarPor, ordem, autoria_unica })}`,
            ultima: `${baseUrl}?${querystring.stringify({ autor, ano, tipo, arquivada, itens, pagina: totalPaginas, ordenarPor, ordem, autoria_unica })}`,
        };


        if (proposicoes.count === 0) {
            return res.status(200).json({ status: 200, message: 'Nenhuma proposição encontrada' });
        }

        const proposicoesSemAutores = proposicoes.rows.map(proposicao => {
            const { autores, ...proposicaoSemAutores } = proposicao.dataValues;
            return proposicaoSemAutores;
        });

        return res.status(200).json({
            status: 200,
            message: proposicoes.count + ' proposições(s) encontrada(s)',
            dados: proposicoesSemAutores,
            links: links
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.atualizarProposicoes = async (req, res) => {
    try {
        const ano = req.query.ano || new Date().getFullYear();

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
            proposicao_arquivada: item.ultimoStatus.idSituacao === '923',
            proposicao_documento: item.urlInteiroTeor
        }));

        await Proposicao.destroy({ where: { proposicao_ano: ano } });

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
        const ano = req.query.ano || new Date().getFullYear();
        const url = `https://dadosabertos.camara.leg.br/arquivos/proposicoesAutores/json/proposicoesAutores-${ano}.json`;

        const response = await axios.get(url);
        const dados = response.data.dados;

        const proposicoesExistentes = await Proposicao.findAll({
            where: { proposicao_ano: ano },
            attributes: ['proposicao_id'],
        });

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
            .filter(autor => proposicoesIds.has(autor.proposicao_id));

        await ProposicoesAutores.destroy({ where: { proposicao_ano: ano } });

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
