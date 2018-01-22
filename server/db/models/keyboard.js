const Sequelize = require('sequelize');
const db = require('../db');

const Keyboard = db.define('keyboard', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  arrangement: {
    type: Sequelize.ARRAY(Sequelize.JSON)
  },
  track: {
    type: Sequelize.JSON
  },
  tokens: {
    type: Sequelize.ARRAY(Sequelize.STRING)
  },
  contributors: {
    type: Sequelize.ARRAY(Sequelize.BIGINT)
  }
})

module.exports = Keyboard;
