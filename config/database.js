
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('api', 'jairo', 'intell01', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
