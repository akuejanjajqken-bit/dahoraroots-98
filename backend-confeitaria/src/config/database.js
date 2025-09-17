const { Sequelize } = require('sequelize');
require('dotenv').config();

/**
 * Configuração do banco de dados SQLite
 * Utiliza Sequelize ORM para gerenciar as conexões e modelos
 */
const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || 'sqlite',
  storage: process.env.DB_STORAGE || './database.sqlite',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  }
});

/**
 * Testa a conexão com o banco de dados
 */
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error.message);
    process.exit(1);
  }
};

/**
 * Sincroniza os modelos com o banco de dados
 * @param {boolean} force - Força a recriação das tabelas
 */
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✅ Banco de dados sincronizado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao sincronizar banco de dados:', error.message);
    throw error;
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase
};