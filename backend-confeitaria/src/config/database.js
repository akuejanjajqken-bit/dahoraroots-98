const { Sequelize } = require('sequelize');
require('dotenv').config();

/**
 * Configuração do banco de dados MySQL
 * Utiliza Sequelize ORM para gerenciar as conexões e modelos
 */
const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'confeitaria_db',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  },
  timezone: '-03:00' // Timezone do Brasil
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