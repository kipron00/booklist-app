// models/index.js
const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const config = require('../config/database.cjs');

const sequelize = new Sequelize(config.development);

let models = {};

const modelFiles = fs.readdirSync(__dirname).filter(file => {
  return file !== 'index.cjs' && file.endsWith('.cjs');
});

modelFiles.forEach(file => {
  const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
  models[model.name] = model;
});

// Define associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;