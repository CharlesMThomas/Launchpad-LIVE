const Sequelize = require('sequelize');
const db = require('../db');

const Key = db.define('key', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  audioURL: {
    type: Sequelize.TEXT
  }
})

module.exports = Key;
