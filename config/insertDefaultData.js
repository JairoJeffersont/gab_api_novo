const  Usuario  = require('../models/usuarios');
const  OrgaosTipos  = require('../models/orgaos_tipos');
const  Orgaos  = require('../models/orgaos');
const  PessoasTipos  = require('../models/pessoas_tipos');
const  PessoasProfissoes  = require('../models/pessoas_profissoes');
const  PostagemStatus  = require('../models/postagem_status');

const insertDefaultData = async () => {
    try {
      // Inserindo usuário padrão
      await Usuario.findOrCreate({
        where: { usuario_id: 1 },
        defaults: {
          usuario_nome: 'USUÁRIO SISTEMA',
          usuario_email: 'email@email.com',
          usuario_telefone: '000000',
          usuario_senha: 'sd9fasdfasd9fasd89fsad9f8',
          usuario_nivel: 1,
          usuario_ativo: 1,
          usuario_aniversario: '2000-01-01',
        },
      });
  
      // Inserindo tipo de órgão padrão
      await OrgaosTipos.findOrCreate({
        where: { orgao_tipo_id: 1 },
        defaults: {
          orgao_tipo_nome: 'Tipo não informado',
          orgao_tipo_descricao: 'Sem tipo definido',
          orgao_tipo_criado_por: 1,
        },
      });
  
      // Inserindo órgão padrão
      await Orgaos.findOrCreate({
        where: { orgao_id: 1 },
        defaults: {
          orgao_nome: 'Órgão não informado',
          orgao_email: 'email@email',
          orgao_municipio: 'municipio',
          orgao_estado: 'estado',
          orgao_tipo: 1,
          orgao_criado_por: 1,
        },
      });
  
      // Inserindo tipo de pessoa padrão
      await PessoasTipos.findOrCreate({
        where: { pessoa_tipo_id: 1 },
        defaults: {
          pessoa_tipo_nome: 'Sem tipo definido',
          pessoa_tipo_descricao: 'Sem tipo definido',
          pessoa_tipo_criado_por: 1,
        },
      });
  
      // Inserindo profissão padrão
      await PessoasProfissoes.findOrCreate({
        where: { pessoas_profissoes_id: 1 },
        defaults: {
          pessoas_profissoes_nome: 'Profissão não informada',
          pessoas_profissoes_descricao: 'Profissão não informada',
          pessoas_profissoes_criado_por: 1,
        },
      }); 
      
  
      // Inserindo status de postagem padrão
      await PostagemStatus.findOrCreate({
        where: { postagem_status_id: 1 },
        defaults: {
          postagem_status_nome: 'Iniciada',
          postagem_status_descricao: 'Iniciada uma postagem',
          postagem_status_criado_por: 1,
        },
      });
  
      console.log('Dados padrão inseridos com sucesso!');
    } catch (error) {
      console.error('Erro ao inserir dados padrão:', error);
    }
  };

module.exports = insertDefaultData;