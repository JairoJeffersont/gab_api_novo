
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('api', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
  port: 8889
});

module.exports = sequelize;
