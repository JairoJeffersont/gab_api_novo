const express = require('express');
const sequelize = require('./config/database');
const routes = require('./routes'); // Importando as rotas
const insertDefaultData = require('./config/insertDefaultData');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/public', express.static('public')); // Rota para a pasta public


// Usando as rotas
app.use('/api', routes);

// Sincronizando o banco de dados e iniciando o servidor
sequelize.sync()
  .then(() => {
    console.log('Banco de dados sincronizado');
    return insertDefaultData(); // Chama a função para inserir dados padrão
  })
  .then(() => {
    app.listen(3000, () => {
      console.log('Servidor rodando na porta 3000');
    });
  })
  .catch((error) => {
    console.error('Erro ao sincronizar o banco de dados:', error);
  });
