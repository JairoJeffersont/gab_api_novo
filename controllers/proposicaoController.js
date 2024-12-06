
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
        const busca = req.query.busca;

        const limit = parseInt(itens, 10);
        const offset = (pagina - 1) * limit;

        const whereAutoriaUnica = {};

        if (autoria_unica === 1) {
            whereAutoriaUnica.proposicao_assinatura = 1;
            whereAutoriaUnica.proposicao_proponente = 1;
        }

        let whereBusca = {};
        if (busca) {
            whereBusca = {
                proposicao_sigla: tipo,
                proposicao_ementa: { [Op.like]: `%${busca}%` }
            }
        } else {
            whereBusca = {
                proposicao_ano: ano,
                proposicao_sigla: tipo,
                proposicao_arquivada: arquivada,
            }
        }


        const proposicoes = await Proposicao.findAndCountAll({
            where: {
                ...whereBusca
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

exports.BuscarMP = async (req, res) => {
    try {
        const ano = req.query.ano || 2024;
        const itens = parseInt(req.query.itens) || 10;
        const pagina = parseInt(req.query.pagina) || 1;

        let response = await axios.get(`https://legis.senado.leg.br/dadosabertos/materia/pesquisa/lista?sigla=mpv&ano=${ano}`);
        const materias = response.data.PesquisaBasicaMateria.Materias.Materia;

        const mappedData = await Promise.all(materias.map(async item => {
            const emendaResponse = await axios.get(`https://legis.senado.leg.br/dadosabertos/materia/emendas/${item.Codigo}`);

            const emendas = emendaResponse?.data?.EmendaMateria?.Materia?.Emendas?.Emenda || [];

            const mappedEmendas = emendas.map(emenda => {
                const autores = Array.isArray(emenda.AutoriaEmenda?.Autor) ? emenda.AutoriaEmenda.Autor : [];

                const ementa_deputado = autores.some(autor => autor.NomeAutor.toLowerCase() === process.env.NOME_PARLAMENTAR.toLowerCase());

                return {
                    codigo: emenda.CodigoEmenda,
                    numero: emenda.NumeroEmenda,
                    descricaoTurno: emenda.DescricaoTurno,
                    descricaoTipoEmenda: emenda.DescricaoTipoEmenda,
                    dataApresentacao: emenda.DataApresentacao,
                    autores: autores.map(autor => ({
                        nome: autor.NomeAutor,
                        partido: autor.IdentificacaoParlamentar?.SiglaPartidoParlamentar,
                        uf: autor.IdentificacaoParlamentar?.UfParlamentar
                    })),
                    textosEmenda: emenda.TextosEmenda?.TextoEmenda?.map(texto => ({
                        descricao: texto.DescricaoTexto,
                        url: texto.UrlTexto
                    })) || [],
                    ementa_deputado
                };
            });

            return {
                id: item.Codigo,
                titulo: item.DescricaoIdentificacao,
                ementa: item.Ementa,
                emenda_do_deputado: mappedEmendas.some(emenda => emenda.ementa_deputado),
                data: item.Data,
                link: `https://www.congressonacional.leg.br/materias/medidas-provisorias/-/mpv/${item.Codigo}`,
                emendas: mappedEmendas
            };
        }));

        mappedData.sort((a, b) => {
            if (a.titulo > b.titulo) return -1;
            if (a.titulo < b.titulo) return 1;
            return 0;
        });

        const totalItens = mappedData.length;
        const totalPaginas = Math.ceil(totalItens / itens);

        const paginaAtual = Math.min(Math.max(pagina, 1), totalPaginas);

        const dataPaginada = mappedData.slice((paginaAtual - 1) * itens, paginaAtual * itens);

        const ultimaPagina = totalPaginas;


        const baseUrl = req.protocol + '://' + req.get('host') + req.baseUrl + '/medidas-provisorias';

        const links = {
            primeira: `${baseUrl}?${querystring.stringify({ ano, itens, pagina: 1 })}`,
            atual: `${baseUrl}?${querystring.stringify({ ano, itens, pagina })}`,
            ultima: `${baseUrl}?${querystring.stringify({ ano, itens, pagina: ultimaPagina })}`,
        };

        return res.status(200).json({
            status: 200,
            message: `${materias.length} medidas provisórias publicadas em ${ano}`,
            dados: dataPaginada,

            links
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
}

exports.BuscaPrincipal = async (req, res) => {

    try {
        const id = req.query.id;

        let uri = `https://dadosabertos.camara.leg.br/api/v2/proposicoes/${id}`;

        const response = await axios.get(uri);
        const dados = response.data.dados;

        if (!dados.uriPropPrincipal) {
            return res.status(200).json({ status: 200, dados: [] });
        }

        while (uri) {
            const response = await axios.get(uri);
            const dados = response.data.dados;

            uri = dados.uriPropPrincipal || null;

            const autoresResponse = await axios.get(`https://dadosabertos.camara.leg.br/api/v2/proposicoes/${dados.id}/autores`);

            const autores = autoresResponse.data.dados.map(autor => ({
                nome: autor.nome,
                proponente: autor.proponente,
                ordem_assinatura: autor.ordemAssinatura,
                autoria_unica: autor.proponente === 1 && autor.ordemAssinatura === 1 ? true : false
            }));

            const resultado = {
                proposicao_id: dados.id,
                proposicao_titulo: `${dados.siglaTipo} ${dados.numero}/${dados.ano}`,
                proposicao_ementa: dados.ementa,
                proposicao_detalhes: {
                    data_apresentacao: dados.dataApresentacao,
                    arquivado: dados.statusProposicao.codSituacao === 923,
                    transformada_em_lei: dados.statusProposicao.codSituacao === 1140,
                    documento: dados.urlInteiroTeor
                },
                proposicao_autores: autores
            };

            if (!uri) {
                return res.status(200).json({ status: 200, message: "OK", dados: resultado });
            }

        }
    } catch (error) {
        return res.status(500).json({ status: 500, message: error });
    }
}

exports.BuscarApensadosDoGabinete = async (req, res) => {
    const id = req.query.id;

    try {
        const response = await axios.get(`https://dadosabertos.camara.leg.br/api/v2//proposicoes/${id}/relacionadas`);

        if (response.data.dados.length == 0) {
            return res.status(200).json({ status: 200, message: 'Nenhuma proposição encontrada.' });
        }

        const proposicoes = await Promise.all(
            response.data.dados
                .filter(proposicao => proposicao.siglaTipo === 'PL')
                .map(async (proposicao) => {

                    const detalhes = await axios.get(`https://dadosabertos.camara.leg.br/api/v2/proposicoes/${proposicao.id}`);
                    const autoresResponse = await axios.get(`https://dadosabertos.camara.leg.br/api/v2//proposicoes/${proposicao.id}/autores`);

                    const autores = autoresResponse.data.dados.map(autor => ({
                        nome: autor.nome,
                        proponente: autor.proponente,
                        ordem_assinatura: autor.ordemAssinatura,
                        autoria_unica: autor.proponente === 1 && autor.ordemAssinatura === 1 ? true : false
                    }));

                    const autorDeputado = autores.some(autor => autor.nome === process.env.NOME_PARLAMENTAR);

                    if (autorDeputado) {
                        return {
                            proposicao_principal: id,
                            apensado_id: proposicao.id,
                            apensado_titulo: `${proposicao.siglaTipo} ${proposicao.numero}/${proposicao.ano}`,
                            apensado_ementa: proposicao.ementa,
                           //proposicao_detalhes: {
                                data_apresentacao: detalhes.data.dados.dataApresentacao,
                                arquivado: detalhes.data.dados.statusProposicao.codSituacao === 923,
                                documento: detalhes.data.dados.urlInteiroTeor
                           // },
                            //apensado_autores: autores
                        };
                    }
                })
        );

        const proposicoesFiltradas = proposicoes.filter(Boolean);

        if (proposicoesFiltradas.length == 0) {
            return res.status(200).json({ status: 200, message: 'Nenhuma proposição encontrada.' });
        }

        return res.status(200).json({ status: 200, dados: proposicoesFiltradas });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error });
    }
}
